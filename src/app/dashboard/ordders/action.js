'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────
//  HELPER — يحوّل Decimal إلى Number و Date إلى string
//  لتجنب "Only plain objects" و "Objects not valid as React child"
// ─────────────────────────────────────────────
function serializeOrder(order) {
  return {
    ...order,
    totalPrice:  Number(order.totalPrice),
    createdAt:   order.createdAt?.toISOString?.() ?? String(order.createdAt),
    updatedAt:   order.updatedAt?.toISOString?.() ?? String(order.updatedAt),
    items: order.items.map((item) => ({
      ...item,
      price:     Number(item.price),
      createdAt: undefined,
      updatedAt: undefined,
    })),
  };
}

// ─────────────────────────────────────────────
//  GET — جلب جميع الطلبات مع العناصر
// ─────────────────────────────────────────────
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                flavors: true,
                sizes: true,
                productImages: { select: { image: true }, take: 1 },
              },
            },
          },
        },
      },
    });
    return { success: true, data: orders.map(serializeOrder) };
  } catch (error) {
    console.error('[getOrders]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب الطلبات' };
  }
}

// ─────────────────────────────────────────────
//  GET ONE — جلب طلب واحد بالتفصيل
// ─────────────────────────────────────────────
export async function getOrderById(id) {
  if (!id) return { success: false, message: 'المعرف مطلوب' };

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(id) },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                flavors: true,
                sizes: true,
                productImages: { select: { image: true }, take: 1 },
              },
            },
          },
        },
      },
    });

    if (!order) return { success: false, message: 'الطلب غير موجود' };
    return { success: true, data: serializeOrder(order) };
  } catch (error) {
    console.error('[getOrderById]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب الطلب' };
  }
}


// ─────────────────────────────────────────────
//  UPDATE STATUS — تحديث حالة الطلب
// ─────────────────────────────────────────────
export async function updateOrderStatus(id, status) {
  const validStatuses = ['PENDING', 'COMPLETED', 'CANCELLED'];
  if (!id || !validStatuses.includes(status)) {
    return { success: false, message: 'المعرف أو الحالة غير صحيحة' };
  }

  try {
    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: { status },
    });

    revalidatePath('/dashboard/ordders');
    revalidatePath(`/dashboard/ordders/${id}`);
    return { success: true, data: updated, message: 'تم تحديث حالة الطلب بنجاح' };
  } catch (error) {
    console.error('[updateOrderStatus]', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث حالة الطلب' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE ORDER — تعديل بيانات الطلب
// ─────────────────────────────────────────────
export async function updateOrder(id, formData) {
  const { name, phoneNumber, address } = formData ?? {};

  if (!id || !name?.trim() || !phoneNumber?.trim() || !address?.trim()) {
    return { success: false, message: 'جميع حقول بيانات الزبون مطلوبة' };
  }

  try {
    const updated = await prisma.order.update({
      where: { id: Number(id) },
      data: {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      },
    });

    revalidatePath('/dashboard/ordders');
    revalidatePath(`/dashboard/ordders/${id}`);
    return { success: true, data: updated, message: 'تم تحديث بيانات الطلب بنجاح' };
  } catch (error) {
    console.error('[updateOrder]', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث الطلب' };
  }
}

// ─────────────────────────────────────────────
//  DELETE — حذف طلب
// ─────────────────────────────────────────────
export async function deleteOrder(id) {
  if (!id) return { success: false, message: 'المعرف مطلوب' };

  try {
    await prisma.orderItem.deleteMany({ where: { orderId: Number(id) } });
    await prisma.order.delete({ where: { id: Number(id) } });

    revalidatePath('/dashboard/ordders');
    return { success: true, message: 'تم حذف الطلب بنجاح' };
  } catch (error) {
    console.error('[deleteOrder]', error);
    return { success: false, message: 'حدث خطأ أثناء حذف الطلب' };
  }
}

// ─────────────────────────────────────────────
//  ADD ITEM — إضافة منتج لطلب موجود
// ─────────────────────────────────────────────
export async function addOrderItem(orderId, { productId, quantity, flavor, size }) {
  if (!orderId || !productId || !quantity) {
    return { success: false, message: 'البيانات غير مكتملة' };
  }

  try {
    const product = await prisma.product.findFirst({
      where: { id: Number(productId), deleteAt: null },
      select: { id: true, name: true, endPrice: true, isAvailable: true, sizes: true },
    });

    if (!product)          return { success: false, message: 'المنتج غير موجود' };
    if (!product.isAvailable) return { success: false, message: 'المنتج غير متوفر' };

    // ── احسب التوصيل من القيمة الحالية (قبل الإضافة) ──
    const orderBefore = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });
    const prevSubtotal = orderBefore.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const shipping     = Number(orderBefore.totalPrice) - prevSubtotal; // ← نحافظ على التوصيل

    // ── حساب السعر شاملاً الزيادة الخاصة بالحجم ──
    let addon = 0;
    if (size && Array.isArray(product.sizes)) {
      const sizeObj = product.sizes.find(s => s.name === size);
      addon = Number(sizeObj?.price || 0);
    }
    const price = Number(product.endPrice) + addon;

    // أضف العنصر
    const item = await prisma.orderItem.create({
      data: {
        orderId:   Number(orderId),
        productId: Number(productId),
        quantity:  Number(quantity),
        price,
        flavor:    flavor || null,
        size:      size || null,
      },
      include: {
        product: {
          select: {
            id: true, name: true, flavors: true, sizes: true,
            productImages: { select: { image: true }, take: 1 },
          },
        },
      },
    });

    // الإجمالي الجديد = المجموع الفرعي الجديد + التوصيل المحفوظ
    const newSubtotal = prevSubtotal + price * Number(quantity);
    const newTotal    = newSubtotal + shipping;
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { totalPrice: newTotal },
    });

    revalidatePath(`/dashboard/ordders/${orderId}`);
    return {
      success: true,
      message: 'تم إضافة المنتج للطلب بنجاح',
      item: {
        ...item,
        price:     Number(item.price),
        createdAt: undefined,
        updatedAt: undefined,
      },
    };
  } catch (error) {
    console.error('[addOrderItem]', error);
    return { success: false, message: 'حدث خطأ أثناء إضافة المنتج' };
  }
}

// ─────────────────────────────────────────────
//  REMOVE ITEM — حذف عنصر من الطلب
// ─────────────────────────────────────────────
export async function removeOrderItem(orderId, itemId) {
  if (!orderId || !itemId) return { success: false, message: 'البيانات غير مكتملة' };

  try {
    // ── احفظ التوصيل قبل الحذف ────────────────────────
    const orderBefore = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { items: true },
    });
    const prevSubtotal = orderBefore.items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const shipping     = Number(orderBefore.totalPrice) - prevSubtotal;

    // احذف العنصر
    const removedItem = orderBefore.items.find((i) => i.id === Number(itemId));
    await prisma.orderItem.delete({ where: { id: Number(itemId) } });

    // الإجمالي الجديد = المجموع الفرعي - سعر العنصر المحذوف + التوصيل
    const removedCost = removedItem ? Number(removedItem.price) * removedItem.quantity : 0;
    const newTotal    = prevSubtotal - removedCost + shipping;
    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { totalPrice: Math.max(0, newTotal) },
    });

    revalidatePath(`/dashboard/ordders/${orderId}`);
    return { success: true, message: 'تم حذف المنتج من الطلب' };
  } catch (error) {
    console.error('[removeOrderItem]', error);
    return { success: false, message: 'حدث خطأ أثناء حذف المنتج' };
  }
}

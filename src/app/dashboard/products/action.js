'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─── مساعد: حذف صورة من Uploadcare ──────────────────────
async function deleteFromUploadcare(uuid) {
  if (!uuid) return;
  try {
    await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Uploadcare.Simple ${process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        Accept: 'application/vnd.uploadcare-v0.7+json',
      },
    });
  } catch (e) {
    console.error('[deleteFromUploadcare]', e);
  }
}

// استخراج UUID من رابط Uploadcare
function extractUuid(url) {
  const match = url?.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
  );
  return match ? match[1] : null;
}

// ── Helper: يحوّل Decimal → Number و Date → string ────────────
function serializeProduct(p) {
  return {
    ...p,
    price:     Number(p.price),
    endPrice:  Number(p.endPrice),
    createdAt: p.createdAt?.toISOString?.() ?? String(p.createdAt),
    updatedAt: p.updatedAt?.toISOString?.() ?? String(p.updatedAt),
    deleteAt:  p.deleteAt ? (p.deleteAt?.toISOString?.() ?? String(p.deleteAt)) : null,
  };
}

// ─────────────────────────────────────────────
//  GET — جلب جميع المنتجات
// ─────────────────────────────────────────────
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { deleteAt: null },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      include: {
        category: { select: { id: true, name: true } },
        productImages: { select: { id: true, image: true } },
      },
    });
    return { success: true, data: products.map(serializeProduct) };
  } catch (error) {
    console.error('[getProducts]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب المنتجات' };
  }
}

// ─────────────────────────────────────────────
//  POST — إنشاء منتج جديد
// ─────────────────────────────────────────────
export async function createProduct(data) {
  const {
    name, description, price, endPrice,
    stock, isAvailable, categoryId,
    sizes, flavors, images,
  } = data;

  if (!name || price == null || endPrice == null) {
    return { success: false, message: 'الاسم والسعران (الأساسي والنهائي) مطلوبان' };
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price,
        endPrice,
        stock: stock ?? 0,
        isAvailable: isAvailable ?? true,
        categoryId: categoryId || null,
        sizes: sizes?.length ? sizes : [],
        flavors: flavors?.length ? flavors : [],
        ...(images?.length && {
          productImages: {
            create: images.map((url) => ({ image: url })),
          },
        }),
      },
    });

    revalidatePath('/dashboard/products');
    return { success: true, data: product, message: 'تم إنشاء المنتج بنجاح' };
  } catch (error) {
    console.error('[createProduct]', error);
    return { success: false, message: 'حدث خطأ أثناء إنشاء المنتج' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE — تعديل منتج
// ─────────────────────────────────────────────
export async function updateProduct(id, data) {
  const {
    name, description, price, endPrice,
    stock, isAvailable, categoryId,
    sizes, flavors, newImages, removedImageIds,
  } = data;

  if (!id || !name || price == null) {
    return { success: false, message: 'البيانات الأساسية مطلوبة' };
  }

  try {
    // حذف الصور المحذوفة من DB + Uploadcare
    if (removedImageIds?.length) {
      const toDelete = await prisma.productImage.findMany({
        where: { id: { in: removedImageIds } },
      });
      await prisma.productImage.deleteMany({
        where: { id: { in: removedImageIds } },
      });
      for (const img of toDelete) {
        const uuid = extractUuid(img.image);
        if (uuid) await deleteFromUploadcare(uuid);
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price,
        endPrice: endPrice ?? price,
        stock: stock ?? 0,
        isAvailable: isAvailable ?? true,
        categoryId: categoryId || null,
        sizes: sizes?.length ? sizes : [],
        flavors: flavors?.length ? flavors : [],
        ...(newImages?.length && {
          productImages: {
            create: newImages.map((url) => ({ image: url })),
          },
        }),
      },
    });

    revalidatePath('/dashboard/products');
    return { success: true, data: product, message: 'تم تحديث المنتج بنجاح' };
  } catch (error) {
    console.error('[updateProduct]', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث المنتج' };
  }
}

// ─────────────────────────────────────────────
//  DELETE — حذف منتج (soft delete)
// ─────────────────────────────────────────────
export async function deleteProduct(id) {
  if (!id) return { success: false, message: 'المعرف مطلوب' };

  try {
    await prisma.product.update({
      where: { id },
      data: { deleteAt: new Date() },
    });

    revalidatePath('/dashboard/products');
    return { success: true, message: 'تم حذف المنتج بنجاح' };
  } catch (error) {
    console.error('[deleteProduct]', error);
    return { success: false, message: 'حدث خطأ أثناء حذف المنتج' };
  }
}

// ─────────────────────────────────────────────
//  GET Categories — للقائمة المنسدلة
// ─────────────────────────────────────────────
export async function getCategoriesList() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('[getCategoriesList]', error);
    return { success: false, data: [] };
  }
}

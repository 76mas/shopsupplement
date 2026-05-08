'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────
//  GET — جلب جميع الفئات مع عدد منتجاتها
// ─────────────────────────────────────────────
export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: { where: { deleteAt: null } } },
        },
      },
    });

    return { success: true, data: categories };
  } catch (error) {
    console.error('[getCategories]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب الفئات' };
  }
}

// ─────────────────────────────────────────────
//  POST — إنشاء فئة جديدة
// ─────────────────────────────────────────────
export async function createCategory(formData) {
  const name = formData?.name?.trim();

  if (!name) {
    return { success: false, message: 'اسم الفئة مطلوب' };
  }

  try {
    // تحقق من عدم تكرار الاسم
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      return { success: false, message: 'هذه الفئة موجودة مسبقاً' };
    }

    const category = await prisma.category.create({
      data: { name },
    });

    revalidatePath('/dashboard/categories');
    return { success: true, data: category, message: 'تم إنشاء الفئة بنجاح' };
  } catch (error) {
    console.error('[createCategory]', error);
    return { success: false, message: 'حدث خطأ أثناء إنشاء الفئة' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE — تعديل اسم فئة موجودة
// ─────────────────────────────────────────────
export async function updateCategory(id, formData) {
  const name = formData?.name?.trim();

  if (!id || !name) {
    return { success: false, message: 'المعرف واسم الفئة مطلوبان' };
  }

  try {
    // تحقق من وجود الفئة
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'الفئة غير موجودة' };
    }

    // تحقق من عدم تكرار الاسم مع فئة أخرى
    const duplicate = await prisma.category.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (duplicate) {
      return { success: false, message: 'هذا الاسم مستخدم من قِبل فئة أخرى' };
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name },
    });

    revalidatePath('/dashboard/categories');
    return { success: true, data: updated, message: 'تم تحديث الفئة بنجاح' };
  } catch (error) {
    console.error('[updateCategory]', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث الفئة' };
  }
}

// ─────────────────────────────────────────────
//  DELETE — حذف فئة
// ─────────────────────────────────────────────
export async function deleteCategory(id) {
  if (!id) {
    return { success: false, message: 'المعرف مطلوب' };
  }

  try {
    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'الفئة غير موجودة' };
    }

    // فك ربط المنتجات أولاً (نحول categoryId إلى null)
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryId: null },
    });

    await prisma.category.delete({ where: { id } });

    revalidatePath('/dashboard/categories');
    return { success: true, message: 'تم حذف الفئة بنجاح' };
  } catch (error) {
    console.error('[deleteCategory]', error);
    return { success: false, message: 'حدث خطأ أثناء حذف الفئة' };
  }
}

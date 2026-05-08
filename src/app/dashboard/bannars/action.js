'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────
//  GET — جلب جميع البنرات
// ─────────────────────────────────────────────
export async function getBanners() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return { success: true, data: banners };
  } catch (error) {
    console.error('[getBanners]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب البنرات' };
  }
}

// ─────────────────────────────────────────────
//  GET ONE — جلب بنر واحد بالنوع
// ─────────────────────────────────────────────
export async function getBannerByType(type) {
  try {
    const banner = await prisma.banner.findFirst({ where: { type } });
    return { success: true, data: banner };
  } catch (error) {
    console.error('[getBannerByType]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب البنر' };
  }
}

// ─────────────────────────────────────────────
//  UPSERT — إنشاء أو تحديث بنر
// ─────────────────────────────────────────────
export async function upsertBanner({ type, image, items }) {
  const validTypes = ['FIRST', 'SECOND', 'THIRD'];
  if (!type || !validTypes.includes(type)) {
    return { success: false, message: 'نوع البنر غير صحيح' };
  }

  try {
    const existing = await prisma.banner.findFirst({ where: { type } });

    let banner;
    if (existing) {
      banner = await prisma.banner.update({
        where: { id: existing.id },
        data: {
          ...(image !== undefined && { image }),
          ...(items !== undefined && { items }),
        },
      });
    } else {
      banner = await prisma.banner.create({
        data: {
          type,
          image: image || '',
          items: items || [],
        },
      });
    }

    revalidatePath('/dashboard/bannars');
    revalidatePath('/');
    return { success: true, data: banner, message: 'تم حفظ البنر بنجاح' };
  } catch (error) {
    console.error('[upsertBanner]', error);
    return { success: false, message: 'حدث خطأ أثناء حفظ البنر' };
  }
}

// ─────────────────────────────────────────────
//  GET Products List — للقائمة المنسدلة
// ─────────────────────────────────────────────
export async function getProductsForBanner() {
  try {
    const products = await prisma.product.findMany({
      where: { deleteAt: null, isAvailable: true },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        productImages: { select: { image: true }, take: 1 },
      },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error('[getProductsForBanner]', error);
    return { success: false, data: [] };
  }
}

// ─────────────────────────────────────────────
//  GET Categories List — للقائمة المنسدلة
// ─────────────────────────────────────────────
export async function getCategoriesForBanner() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('[getCategoriesForBanner]', error);
    return { success: false, data: [] };
  }
}

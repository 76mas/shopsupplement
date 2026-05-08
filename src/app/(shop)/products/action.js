'use server';

import prisma from '@/lib/prisma';

const PAGE_SIZE = 12;

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
//  GET — جلب المنتجات مع الفلترة والـ pagination
// ─────────────────────────────────────────────
export async function getShopProducts({
  categoryId,
  minPrice,
  maxPrice,
  page = 1,
  search,
} = {}) {
  try {
    const where = {
      deleteAt: null,
      // isAvailable لا نفلتر حسبه — نعرض الكل لكن مع شريط "غير متوفر" في الفرونت
      ...(categoryId && { categoryId: Number(categoryId) }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(minPrice != null || maxPrice != null
        ? {
            endPrice: {
              ...(minPrice != null && { gte: minPrice }),
              ...(maxPrice != null && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          category: { select: { id: true, name: true } },
          productImages: { select: { id: true, image: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      success: true,
      data: products.map(serializeProduct),
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    };
  } catch (error) {
    console.error('[getShopProducts]', error);
    return { success: false, data: [], total: 0, totalPages: 0 };
  }
}

// ─────────────────────────────────────────────
//  GET — جلب منتج واحد كامل
// ─────────────────────────────────────────────
export async function getShopProductById(id) {
  try {
    const product = await prisma.product.findFirst({
      where: { id: Number(id), deleteAt: null },
      include: {
        category: { select: { id: true, name: true } },
        productImages: { select: { id: true, image: true } },
      },
    });
    if (!product) return { success: false, message: 'المنتج غير موجود' };
    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    console.error('[getShopProductById]', error);
    return { success: false, message: 'حدث خطأ' };
  }
}


// ─────────────────────────────────────────────
//  GET — جلب الفئات للفلتر
// ─────────────────────────────────────────────
export async function getShopCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: { where: { deleteAt: null, isAvailable: true } },
          },
        },
      },
    });
    return { success: true, data: categories };
  } catch (error) {
    console.error('[getShopCategories]', error);
    return { success: false, data: [] };
  }
}

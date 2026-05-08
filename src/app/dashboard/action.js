'use server';

import prisma from '@/lib/prisma';

// ─────────────────────────────────────────────
//  GET — إحصائيات لوحة التحكم
// ─────────────────────────────────────────────
export async function getDashboardStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalProducts,
      totalCategories,
      totalAdmins,
      revenueResult,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'COMPLETED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.product.count({ where: { deleteAt: null } }),
      prisma.category.count(),
      prisma.admin.count(),
      prisma.order.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { totalPrice: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          status: true,
          totalPrice: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        cancelledOrders,
        totalProducts,
        totalCategories,
        totalAdmins,
        totalRevenue: Number(revenueResult._sum.totalPrice ?? 0),
        recentOrders: recentOrders.map((o) => ({
          ...o,
          totalPrice: Number(o.totalPrice),
          createdAt:  o.createdAt?.toISOString?.() ?? String(o.createdAt),
          updatedAt:  o.updatedAt?.toISOString?.() ?? String(o.updatedAt),
        })),
      },
    };
  } catch (error) {
    console.error('[getDashboardStats]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب الإحصائيات' };
  }
}

'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────
//  GET — جلب إعدادات المتجر
// ─────────────────────────────────────────────
export async function getShopInfo() {
  try {
    // نجلب أول سجل دائماً (سجل واحد فقط)
    let info = await prisma.shopInfo.findFirst();

    // إذا ما في سجل، نبني واحد افتراضي
    if (!info) {
      info = await prisma.shopInfo.create({
        data: {
          name: 'متجر المكملات',
          description: 'أفضل المكملات الغذائية في العراق',
          phoneNumbers: '',
          soicalLinks: [],
          deliveryPrice: 5000,
          acceptOrders: true,
        },
      });
    }

    return { success: true, data: info };
  } catch (error) {
    console.error('[getShopInfo]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب إعدادات المتجر' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE — تحديث إعدادات المتجر
// ─────────────────────────────────────────────
export async function updateShopInfo(formData) {
  const {
    name,
    description,
    phoneNumbers,
    logo,
    deliveryPrice,
    acceptOrders,
    soicalLinks,
  } = formData ?? {};

  try {
    let info = await prisma.shopInfo.findFirst();

    const data = {
      ...(name !== undefined && { name: name?.trim() }),
      ...(description !== undefined && { description: description?.trim() }),
      ...(phoneNumbers !== undefined && { phoneNumbers: phoneNumbers?.trim() }),
      ...(logo !== undefined && { logo }),
      ...(deliveryPrice !== undefined && { deliveryPrice: Number(deliveryPrice) }),
      ...(acceptOrders !== undefined && { acceptOrders: Boolean(acceptOrders) }),
      ...(soicalLinks !== undefined && { soicalLinks: Array.isArray(soicalLinks) ? soicalLinks : [] }),
    };

    if (info) {
      info = await prisma.shopInfo.update({ where: { id: info.id }, data });
    } else {
      info = await prisma.shopInfo.create({
        data: {
          name: name?.trim() || 'متجر المكملات',
          description: description?.trim() || '',
          phoneNumbers: phoneNumbers?.trim() || '',
          soicalLinks: soicalLinks || [],
          deliveryPrice: Number(deliveryPrice) || 5000,
          acceptOrders: acceptOrders ?? true,
          logo: logo || '',
        },
      });
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/');
    return { success: true, data: info, message: 'تم حفظ إعدادات المتجر بنجاح' };
  } catch (error) {
    console.error('[updateShopInfo]', error);
    return { success: false, message: 'حدث خطأ أثناء حفظ الإعدادات' };
  }
}

// ─────────────────────────────────────────────
//  CHANGE PASSWORD — تغيير كلمة مرور المدير الحالي
// ─────────────────────────────────────────────
export async function changeMyPassword(adminId, { currentPassword, newPassword }) {
  if (!adminId || !currentPassword || !newPassword) {
    return { success: false, message: 'جميع الحقول مطلوبة' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin) return { success: false, message: 'المدير غير موجود' };

    const valid = await bcrypt.compare(currentPassword, admin.password);
    if (!valid) return { success: false, message: 'كلمة المرور الحالية غير صحيحة' };

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.admin.update({ where: { id: adminId }, data: { password: hashed } });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  } catch (error) {
    console.error('[changeMyPassword]', error);
    return { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' };
  }
}

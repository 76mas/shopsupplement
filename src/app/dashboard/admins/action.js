'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────
//  GET — جلب جميع المدراء
// ─────────────────────────────────────────────
export async function getAdmins() {
  try {
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return { success: true, data: admins };
  } catch (error) {
    console.error('[getAdmins]', error);
    return { success: false, message: 'حدث خطأ أثناء جلب المدراء' };
  }
}

// ─────────────────────────────────────────────
//  POST — إنشاء مدير جديد
// ─────────────────────────────────────────────
export async function createAdmin(formData) {
  const { name, phoneNumber, password } = formData ?? {};

  if (!name?.trim() || !phoneNumber?.trim() || !password) {
    return { success: false, message: 'جميع الحقول مطلوبة' };
  }

  if (!/^[0-9]{11}$/.test(phoneNumber.trim())) {
    return { success: false, message: 'رقم الهاتف يجب أن يكون 11 رقماً' };
  }

  try {
    // تحقق من عدم تكرار رقم الهاتف
    const existing = await prisma.admin.findUnique({
      where: { phoneNumber: phoneNumber.trim() },
    });
    if (existing) {
      return { success: false, message: 'رقم الهاتف مسجّل مسبقاً' };
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        password: hashed,
      },
      select: { id: true, name: true, phoneNumber: true, createdAt: true },
    });

    revalidatePath('/dashboard/admins');
    return { success: true, data: admin, message: 'تمت إضافة المدير بنجاح' };
  } catch (error) {
    console.error('[createAdmin]', error);
    return { success: false, message: 'حدث خطأ أثناء إضافة المدير' };
  }
}

// ─────────────────────────────────────────────
//  UPDATE — تعديل بيانات مدير
// ─────────────────────────────────────────────
export async function updateAdmin(id, formData) {
  const { name, phoneNumber } = formData ?? {};

  if (!id || !name?.trim() || !phoneNumber?.trim()) {
    return { success: false, message: 'المعرف والاسم ورقم الهاتف مطلوبة' };
  }

  if (!/^[0-9]{11}$/.test(phoneNumber.trim())) {
    return { success: false, message: 'رقم الهاتف يجب أن يكون 11 رقماً' };
  }

  try {
    // تحقق من عدم تكرار الرقم مع مدير آخر
    const duplicate = await prisma.admin.findFirst({
      where: {
        phoneNumber: phoneNumber.trim(),
        NOT: { id },
      },
    });
    if (duplicate) {
      return { success: false, message: 'رقم الهاتف مستخدم من قِبل مدير آخر' };
    }

    const updated = await prisma.admin.update({
      where: { id },
      data: {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
      },
      select: { id: true, name: true, phoneNumber: true, createdAt: true },
    });

    revalidatePath('/dashboard/admins');
    return { success: true, data: updated, message: 'تم تحديث بيانات المدير بنجاح' };
  } catch (error) {
    console.error('[updateAdmin]', error);
    return { success: false, message: 'حدث خطأ أثناء تحديث المدير' };
  }
}

// ─────────────────────────────────────────────
//  CHANGE PASSWORD — تغيير كلمة مرور مدير
// ─────────────────────────────────────────────
export async function changeAdminPassword(id, newPassword) {
  if (!id || !newPassword) {
    return { success: false, message: 'المعرف وكلمة المرور مطلوبان' };
  }

  if (newPassword.length < 6) {
    return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id },
      data: { password: hashed },
    });

    revalidatePath('/dashboard/admins');
    return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
  } catch (error) {
    console.error('[changeAdminPassword]', error);
    return { success: false, message: 'حدث خطأ أثناء تغيير كلمة المرور' };
  }
}

// ─────────────────────────────────────────────
//  DELETE — حذف مدير
// ─────────────────────────────────────────────
export async function deleteAdmin(id) {
  if (!id) return { success: false, message: 'المعرف مطلوب' };

  try {
    const existing = await prisma.admin.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'المدير غير موجود' };
    }

    await prisma.admin.delete({ where: { id } });

    revalidatePath('/dashboard/admins');
    return { success: true, message: 'تم حذف المدير بنجاح' };
  } catch (error) {
    console.error('[deleteAdmin]', error);
    return { success: false, message: 'حدث خطأ أثناء حذف المدير' };
  }
}

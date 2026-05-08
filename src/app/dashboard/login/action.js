"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET_KEY = process.env.JWT_SECRET || "mizawala_super_secret_key_123!";

export async function loginAdmin(prevState, formData) {
  const phoneNumber = formData.get("phoneNumber")?.trim();
  const password = formData.get("password");

  if (!phoneNumber || !password) {
    return { success: false, message: "يرجى إدخال رقم الهاتف وكلمة المرور" };
  }


  try {
    const admin = await prisma.admin.findUnique({
      where: { phoneNumber },
    });

    if (!admin) {
      return { success: false, message: "بيانات الدخول غير صحيحة" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { success: false, message: "بيانات الدخول غير صحيحة" };
    }

    // توليد الـ JWT
    const token = jwt.sign(
      { id: admin.id, name: admin.name, role: "admin" },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    // تخزين الـ JWT في الكوكيز
    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return { success: true, message: "تم تسجيل الدخول بنجاح" };
  } catch (error) {
    console.error("[loginAdmin]", error);
    return { success: false, message: "حدث خطأ أثناء تسجيل الدخول" };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return { success: true };
}

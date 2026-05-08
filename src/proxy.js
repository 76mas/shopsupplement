import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET || "mizawala_super_secret_key_123!";
const key = new TextEncoder().encode(SECRET_KEY);

export async function proxy(req) {
  const { pathname } = req.nextUrl;

  // حماية مسارات الداشبورد فقط، واستثناء صفحة تسجيل الدخول
  if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/login")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }

    try {
      // التحقق من التوكن باستخدام jose (لأنه مدعوم في بيئة الـ Edge)
      await jwtVerify(token, key);
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid token:", error.message);
      return NextResponse.redirect(new URL("/dashboard/login", req.url));
    }
  }

  // السماح بمرور باقي المسارات
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

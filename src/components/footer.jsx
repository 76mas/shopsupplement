"use client";
import Image from "next/image";
import Container from "./container";

const Footer = () => {
  return (
    <footer className="bg-[#F0F0F0] flex justify-center pt-10 pb-6 text-black">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* العمود الأول: اللوغو والوصف */}
          <div className="flex items-center flex-col gap-4 text-center">
            {/* <Image
              src="/logo3.png"
              alt="Mizawala Logo"
              width={130}
              height={40}
              className="h-8 w-auto object-contain mx-auto"
            /> */}

                  <span className="text-2xl font-black">LOGO</span>

            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
        حيث تجد مكملاتك الاصلية بجودة عالية 
            </p>
            {/* أيقونات التواصل الاجتماعي */}
            <div className="flex justify-center gap-3 mt-1">
              {/* فيسبوك */}
              <a href="#" className="w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              {/* إنستغرام */}
              <a href="#" className="w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              {/* واتساب */}
              <a href="#" className="w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>

          {/* العمود الثاني: الشركة */}
          <div className="flex flex-col gap-4 text-center items-center col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base font-black uppercase tracking-wider">الشركة</h4>
            <nav className="flex flex-row md:flex-col justify-center gap-x-5 gap-y-2 text-gray-600 text-sm font-bold">
              <a href="#" className="hover:text-black transition-colors">عنا</a>
              <a href="#" className="hover:text-black transition-colors">المميزات</a>
              <a href="#" className="hover:text-black transition-colors">أعمالنا</a>
              <a href="#" className="hover:text-black transition-colors">المدونة</a>
            </nav>
          </div>

          {/* العمود الثالث: المساعدة */}
          <div className="flex flex-col gap-4 text-center items-center col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base font-black uppercase tracking-wider">المساعدة</h4>
            <nav className="flex flex-row md:flex-col justify-center gap-x-5 gap-y-2 text-gray-600 text-sm font-bold">
              <a href="#" className="hover:text-black transition-colors">دعم العملاء</a>
              <a href="#" className="hover:text-black transition-colors">تفاصيل التوصيل</a>
              <a href="#" className="hover:text-black transition-colors">الشروط والأحكام</a>
              <a href="#" className="hover:text-black transition-colors">سياسة الخصوصية</a>
            </nav>
          </div>

          {/* العمود الرابع: الروابط السريعة */}
          <div className="flex flex-col gap-4 text-center items-center col-span-1 sm:col-span-2 lg:col-span-1">
            <h4 className="text-base font-black uppercase tracking-wider">روابط سريعة</h4>
            <nav className="flex flex-row md:flex-col justify-center gap-x-5 gap-y-2 text-gray-600 text-sm font-bold">
              <a href="#" className="hover:text-black transition-colors">الاكثر مبيعاً</a>
              <a href="#" className="hover:text-black transition-colors">وصلنا حديثاً</a>
              <a href="#" className="hover:text-black transition-colors">كل المنتجات</a>
              <a href="#" className="hover:text-black transition-colors">تخفيضات</a>
            </nav>
          </div>
        </div>

        {/* الخط السفلي والحقوق */}
        <div className="pt-6 border-t border-black/5 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-gray-400 text-xs">
            name © 2026. All rights reserved.
          </p>
      
        </div>
      </Container>
    </footer>
  );
};

export default Footer;

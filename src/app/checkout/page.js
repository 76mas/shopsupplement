"use client";
import Container from "@/components/container";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "@base-ui/react/drawer";
import styles from "@/app/products/drawer.module.css";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Whey Gold Standard",
      price: 85000,
      type: "بروتينات",
      quantity: 1,
      image:
        "https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/",
      flavor: "شوكولاتة غنية",
      size: "2.27 كجم",
    },
    {
      id: 2,
      name: "C4 Original Pre-Workout",
      price: 45000,
      type: "طاقة وباور",
      quantity: 1,
      image:
        "https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/",
      flavor: "توت أزرق",
      size: "30 حصة",
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState("store");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = 5000;
  const total = subtotal + shipping;

  return (
    <div
      className="w-full text-black py-24 md:py-40 flex justify-center bg-[#FAFAFA] min-h-screen relative"
      dir="rtl"
    >
      <Container>
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-3 text-sm text-[#888] mb-12 px-2">
          <span className="hover:text-black cursor-pointer transition-colors">
            السلة
          </span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="rotate-180 opacity-40"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-black font-black">اتمام الطلب</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Right Column: Checkout Form */}
          <div className="w-full lg:w-[60%] flex flex-col gap-10">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-gray-100/50">
              <h1 className="text-3xl md:text-5xl font-black mb-10 tracking-tight">
                تفاصيل الشحن
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: محمد علي"
                    className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-[20px] px-6 py-5 outline-none focus:bg-white focus:border-black transition-all duration-300 text-base font-bold placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-[20px] px-6 py-5 outline-none focus:bg-white focus:border-black transition-all duration-300 text-base font-bold placeholder:text-gray-400"
                  />
                </div>

                <div className="flex flex-col gap-3 md:col-span-2">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    العنوان بالتفصيل
                  </label>
                  <textarea
                    placeholder="المحافظة، المدينة، اسم الشارع، أقرب نقطة دالة"
                    rows="3"
                    className="w-full bg-[#F5F5F5] border-2 border-transparent rounded-[24px] px-6 py-5 outline-none focus:bg-white focus:border-black transition-all duration-300 resize-none text-base font-bold placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="mt-14 mb-10">
                <h3 className="text-sm font-black text-black px-1 mb-6 uppercase tracking-wider flex items-center gap-2">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                  طريقة اتمام الطلب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("store")}
                    className={`relative p-6 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 ${
                      paymentMethod === "store"
                        ? "border-black bg-black text-white shadow-xl shadow-black/10"
                        : "border-gray-100 bg-[#F9F9F9] hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "store"
                          ? "border-white"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "store" && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`font-black text-base ${paymentMethod === "store" ? "text-white" : "text-black"}`}
                      >
                        عبر المتجر
                      </span>
                      <span
                        className={`text-[10px] font-bold ${paymentMethod === "store" ? "text-gray-400" : "text-gray-400"}`}
                      >
                        اتمام الطلب بالطريقة التقليدية
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`relative p-6 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 ${
                      paymentMethod === "whatsapp"
                        ? "border-green-500 bg-green-500 text-white shadow-xl shadow-green-200"
                        : "border-gray-100 bg-[#F9F9F9] hover:border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === "whatsapp"
                          ? "border-white"
                          : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "whatsapp" && (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`font-black text-base ${paymentMethod === "whatsapp" ? "text-white" : "text-black"}`}
                      >
                        واتساب مباشر
                      </span>
                      <span
                        className={`text-[10px] font-bold ${paymentMethod === "whatsapp" ? "text-green-100" : "text-gray-400"}`}
                      >
                        تواصل مباشر مع فريقنا
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Checkout Actions Moved Here */}
              <div className="pt-8 border-t border-gray-50">
                <button
                  className={`w-full py-6 rounded-[28px] font-black text-xl transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 ${
                    paymentMethod === "store"
                      ? "bg-black text-white hover:bg-black/90 shadow-black/20"
                      : "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
                  }`}
                >
                  {paymentMethod === "store" ? (
                    <>
                      تأكيد الطلب
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="rotate-180"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      اتمام عبر واتساب
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.396.015 12.03a11.934 11.934 0 001.605 6.057L0 24l6.105-1.603a11.85 11.85 0 005.935 1.579h.005c6.637 0 12.032-5.396 12.035-12.032a11.85 11.85 0 00-3.617-8.517z" />
                      </svg>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2 mt-6 opacity-30">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                    تشفير آمن للبيانات
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-10 opacity-30 px-4 mb-8">
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-blue-600"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  توصيل آمن
                </span>
              </div>
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-50 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-red-600"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  كل محافظات العراق
                </span>
              </div>
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:text-green-600"
                  >
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  دفع عند الاستلام
                </span>
              </div>
            </div>
          </div>

          {/* Left Column: Order Summary (Visible on Desktop) */}
          <div className="hidden lg:flex w-full lg:w-[40%] flex-col gap-6">
            <SummaryContent
              cartItems={cartItems}
              removeItem={removeItem}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
            />
          </div>
        </div>
      </Container>

      {/* Floating Pill Button for Mobile */}
      <div className="fixed bottom-10 left-0 right-0 z-[60] flex justify-center lg:hidden px-6 pointer-events-none">
        <motion.button
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSummaryOpen(true)}
          className="pointer-events-auto bg-black/90 backdrop-blur-xl text-white rounded-full px-8 py-5 flex items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden group"
        >
          {/* Subtle reflection effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">
              الإجمالي
            </span>
            <span className="text-xl font-black">
              {total.toLocaleString()}{" "}
              <span className="text-xs font-bold opacity-60">د.ع</span>
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="relative">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-black shadow-lg animate-bounce-subtle">
              {cartItems.length}
            </span>
          </div>

          {/* Hover Arrow */}
          <div className="mr-2 group-hover:translate-x-[-4px] transition-transform">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </motion.button>
      </div>

      {/* Mobile Summary Drawer */}
      <Drawer.Root open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <Drawer.Portal>
          <Drawer.Backdrop className={styles.Backdrop} />
          <Drawer.Viewport className={styles.Viewport}>
            <Drawer.Popup
              className={`${styles.Popup} flex flex-col h-[85vh]`}
              dir="rtl"
            >
              <div className={styles.DragArea}>
                <div className={styles.Handle} />
              </div>
              <Drawer.Content className={`${styles.Scroll} p-8`}>
                <SummaryContent
                  cartItems={cartItems}
                  removeItem={removeItem}
                  subtotal={subtotal}
                  shipping={shipping}
                  total={total}
                  isDrawer
                />
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

// Shared Summary Component
const SummaryContent = ({
  cartItems,
  removeItem,
  subtotal,
  shipping,
  total,
  isDrawer = false,
}) => (
  <div
    className={`${!isDrawer ? "bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 lg:sticky lg:top-32" : ""}`}
  >
    <h2 className="text-2xl text-black font-black mb-8 pb-4 border-b border-gray-50 tracking-tight flex items-center gap-3">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
      ملخص الطلب
    </h2>

    <div
      className={`flex flex-col gap-6 mb-10 ${!isDrawer ? "max-h-[350px]" : "max-h-[45vh]"} overflow-y-auto scrollbar-hide pr-1`}
    >
      {cartItems.map((item) => (
        <div key={item.id} className="flex gap-5 group items-center">
          <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-[#F9F9F9] shrink-0 border border-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h4 className="font-bold text-sm text-black line-clamp-1">
              {item.name}
            </h4>
            <p className="text-[10px] text-gray-400 font-bold mb-1">
              {item.flavor && <span>{item.flavor}</span>}
              {item.flavor && item.size && <span className="mx-1">/</span>}
              {item.size && <span>{item.size}</span>}
            </p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-gray-400 font-bold">
                {item.quantity} × {item.price.toLocaleString()}
              </span>
              <span className="font-black text-black text-sm">
                {(item.price * item.quantity).toLocaleString()} د.ع
              </span>
            </div>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-5 bg-gray-50/50 p-6 rounded-[28px]">
      <div className="flex justify-between items-center text-gray-500 font-bold">
        <span className="text-xs uppercase tracking-widest">
          المجموع الفرعي
        </span>
        <span className="text-sm">{subtotal.toLocaleString()} د.ع</span>
      </div>
      <div className="flex justify-between items-center text-gray-500 font-bold">
        <span className="text-xs uppercase tracking-widest">سعر التوصيل</span>
        <span className="text-sm">{shipping.toLocaleString()} د.ع</span>
      </div>
      <div className="h-px bg-gray-200/50 my-1" />
      <div className="flex justify-between items-center text-black font-black text-2xl">
        <span className="text-lg">الإجمالي</span>
        <span>
          {total.toLocaleString()}{" "}
          <span className="text-sm font-bold opacity-50">د.ع</span>
        </span>
      </div>
    </div>
  </div>
);

export default CheckoutPage;

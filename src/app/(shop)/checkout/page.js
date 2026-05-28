"use client";
import Container from "@/components/container";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Drawer } from "@base-ui/react/drawer";
import styles from "@/app/(shop)/products/drawer.module.css";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { createOrder, buildWhatsAppUrl, getDeliveryPrice } from "./action";
    

const CheckoutPage = () => {
  const {
    items: cartItems,
    removeItem: removeCartItem,
    total: cartTotal,
    clearCart,
  } = useCart();
  const router = useRouter();

  // ── Form state ────────────────────────────────────────────
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("store");
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [deliveryPrice, setDeliveryPrice] = useState(5000);

  // ── Load delivery price from DB ───────────────────────────
  useEffect(() => {
    getDeliveryPrice().then((r) => {
      if (r.success) setDeliveryPrice(r.price);
    });
  }, []);

  const removeItem = (key) => removeCartItem(key);

  const shipping = deliveryPrice;
  const subtotal = cartTotal;
  const total = subtotal + shipping;

  // ── Validation ────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "يرجى إدخال الاسم الكامل";
    if (!phoneNumber.trim()) e.phoneNumber = "يرجى إدخال رقم الهاتف";
    else if (
      !/^(\+964|00964|0)7[3-9]\d{8}$/.test(phoneNumber.replace(/\s/g, ""))
    )
      e.phoneNumber = "رقم الهاتف غير صحيح (مثال: 07XXXXXXXX)";
    if (!address.trim()) e.address = "يرجى إدخال العنوان بالتفصيل";
    if (!cartItems.length) e.cart = "سلة الشراء فارغة";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      name,
      phoneNumber,
      address,
      deliveryPrice: shipping,
      items: cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        flavor: i.flavor,
        size: i.size,
      })),
    };

    if (paymentMethod === "whatsapp") {
      // ── واتساب ─────────────────────────────────────────
      const res = await buildWhatsAppUrl(payload);
      setSubmitting(false);
      if (!res.success) {
        setErrors({ form: res.message });
        return;
      }
      window.open(res.url, "_blank");
    } else {
      // ── إنشاء طلب في DB ────────────────────────────────
      const res = await createOrder(payload);
      setSubmitting(false);
      if (!res.success) {
        setErrors({ form: res.message });
        return;
      }
      clearCart();
      router.push(`/checkout/success?orderId=${res.orderId}`);
    }
  };

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
                {/* الاسم */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((p) => ({ ...p, name: "" }));
                    }}
                    placeholder="مثال: محمد علي"
                    className={`w-full bg-[#F5F5F5] border-2 rounded-[20px] px-6 py-5 outline-none focus:bg-white transition-all duration-300 text-base font-bold placeholder:text-gray-400 ${errors.name ? "border-red-400 bg-red-50" : "border-transparent focus:border-black"}`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs font-bold px-2">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* الهاتف */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrors((p) => ({ ...p, phoneNumber: "" }));
                    }}
                    placeholder="07XXXXXXXX"
                    dir="ltr"
                    className={`w-full bg-[#F5F5F5] border-2 rounded-[20px] px-6 py-5 outline-none focus:bg-white transition-all duration-300 text-base font-bold placeholder:text-gray-400 text-right ${errors.phoneNumber ? "border-red-400 bg-red-50" : "border-transparent focus:border-black"}`}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-xs font-bold px-2">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* العنوان */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-black text-black px-1 uppercase tracking-wider">
                    العنوان بالتفصيل
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors((p) => ({ ...p, address: "" }));
                    }}
                    placeholder="المحافظة، المدينة، اسم الشارع، أقرب نقطة دالة"
                    rows="3"
                    className={`w-full bg-[#F5F5F5] border-2 rounded-[24px] px-6 py-5 outline-none focus:bg-white transition-all duration-300 resize-none text-base font-bold placeholder:text-gray-400 ${errors.address ? "border-red-400 bg-red-50" : "border-transparent focus:border-black"}`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-xs font-bold px-2">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-14 mb-10">
                <h3 className="text-sm font-black text-black px-1 mb-6 uppercase tracking-wider flex items-center gap-2">
     <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M8.826 2.699a1.13 1.13 0 1 0-.75 2.131c1.25.44 2.4-1.53.75-2.131" />
	<path fill="currentColor" d="M15.46 19.137a.28.28 0 0 0-.17.272a.3.3 0 0 0 .03.109a4.6 4.6 0 0 1-.071 2c-.11.45-.26.851-.55 1.001c-2.216.617-4.518.86-6.814.72a18.6 18.6 0 0 1-5.373-.8a2.7 2.7 0 0 1-.51-.26c-.05-.1-.17-.16-.17-.16v-7.494c0-2.781 0-5.503.07-7.504c0-.82-.13-2.14-.09-3.352a3.66 3.66 0 0 1 .42-1.88a1.28 1.28 0 0 1 .94-.47a19 19 0 0 1 2.182-.07l2.131-.24L9.486.947a18.6 18.6 0 0 1 4.292 0a2 2 0 0 1 1.701 1.57q.116.677.11 1.362c0 1.11-.13 2.26-.13 3.331a.34.34 0 0 0 .33.34a.33.33 0 0 0 .33-.33c0-1.07.17-2.23.19-3.341a9 9 0 0 0-.1-1.491a2.52 2.52 0 0 0-1.479-2c-1.531-.63-3.902-.3-5.283-.31H7.445l-2.181.15a12 12 0 0 0-2.712.13a2 2 0 0 0-1.21.8a4 4 0 0 0-.6 1.851a39 39 0 0 0 0 4.002a419 419 0 0 0-.04 9.005c0 2.251.07 4.412.14 6.003a1.28 1.28 0 0 0 .75 1c1.089.48 2.254.76 3.442.83c3.211.341 7.624.11 9.885-.77a1.91 1.91 0 0 0 .94-1.45a5.1 5.1 0 0 0 0-2.362a.3.3 0 0 0-.4-.13" />
	<path fill="currentColor" d="M23.073 6.751c-.3-.28-.54-.58-.84-.86a4.4 4.4 0 0 0-.63-.51a6.8 6.8 0 0 0-1.291-.581a.29.29 0 0 0-.4.1a.3.3 0 0 0 .1.4c.3.26.52.56.81.83l.18.16l-.25.19a3 3 0 0 0-.23.271q-.114.145-.2.31c-.06.1-.1.21-.15.31c-.17-.11-.32-.2-.43-.29a.331.331 0 1 0-.41.52c1.39 1.111 1.29 1.001 1.3 1.151l-1.33 1.861c-.741 1.06-2.212 3.052-3.503 4.773c-1.13 1.51-2.12 2.821-2.37 3.051q-.72.33-1.472.58a16 16 0 0 1-.14-1.72c.06-.27.27-.47.65-1.001c.48-.68 2.692-3.932 4.513-6.413q.97-1.383 2.08-2.653a.3.3 0 0 0 0-.41a.31.31 0 0 0-.42 0c-.47.47-1.29 1.45-2.201 2.581c-1.921 2.412-4.283 5.613-4.793 6.224a4.1 4.1 0 0 0-.85 1.39a4.5 4.5 0 0 0 .06 1.601c0 .08 0 .7.06.95a.7.7 0 0 0 .42.591c.155.03.315.03.47 0a6 6 0 0 0 .92-.32c.2-.07.601-.15.911-.26c.204-.063.391-.17.55-.31a26 26 0 0 0 1.851-2.442a194 194 0 0 0 3.943-5.733l1-1.46q.198-.238.34-.51a.9.9 0 0 0 .07-.42a1.2 1.2 0 0 0-.43-.751l.24-.21a1.6 1.6 0 0 0 .25-.27a1.5 1.5 0 0 0 .2-.31q.083-.155.14-.32q.483.281 1 .49a.32.32 0 0 0 .461-.09a.32.32 0 0 0-.18-.49M7.695 12.224c-.11.21-.22.42-.35.62l-.63.92a9.65 9.65 0 0 0-1.521 3.783a2.21 2.21 0 0 0 1.51 2.47q.246.087.5.141q.259.054.521.08h.62c.44 0 .87-.12 1.311-.15a.35.35 0 0 0 .32-.35a.33.33 0 0 0-.35-.31c-.44 0-.87.07-1.31.07q-.256.021-.51 0l-.801-.23a1.38 1.38 0 0 1-.82-1.611a8.85 8.85 0 0 1 1.46-3.282l.62-.94q.227-.372.4-.77q.18-.41.29-.841a2.26 2.26 0 0 0-.33-1.711a1.74 1.74 0 0 0-1.57-.79c-.404.04-.793.17-1.14.38a4.3 4.3 0 0 0-1.251 1.14a.3.3 0 0 0 .159.462a.28.28 0 0 0 .3-.102a3.5 3.5 0 0 1 .911-.78a2.2 2.2 0 0 1 1-.32a.9.9 0 0 1 .781.49a1.3 1.3 0 0 1 .12 1c-.06.2-.14.42-.24.63" />
</svg>



                  طريقة اتمام الطلب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("store")}
                    className={`relative p-6 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 ${paymentMethod === "store" ? "border-black bg-black text-white shadow-xl shadow-black/10" : "border-gray-100 bg-[#F9F9F9] hover:border-gray-200"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "store" ? "border-white" : "border-gray-300"}`}
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
                      <span className="text-[10px] font-bold text-gray-400">
                        اتمام الطلب بالطريقة التقليدية
                      </span>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod("whatsapp")}
                    className={`relative p-6 rounded-[28px] border-2 cursor-pointer transition-all duration-300 flex items-center gap-5 ${paymentMethod === "whatsapp" ? "border-green-500 bg-green-500 text-white shadow-xl shadow-green-200" : "border-gray-100 bg-[#F9F9F9] hover:border-gray-200"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === "whatsapp" ? "border-white" : "border-gray-300"}`}
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

              {/* Global error */}
              {errors.form && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[20px] text-red-600 font-bold text-sm text-center">
                  {errors.form}
                </div>
              )}
              {errors.cart && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-[20px] text-amber-700 font-bold text-sm text-center">
                  {errors.cart}
                </div>
              )}

            </div>


            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-10 opacity-30 px-4 mb-8">
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M18.288 11.683a7.7 7.7 0 0 0-1.306-3.747a6.7 6.7 0 0 0-7.286-2.721a6.87 6.87 0 0 0-5.262 5.651a5.6 5.6 0 0 0 0 1.585c.077.546.278 1.068.588 1.525c.548.777 1.395.996 1.824 1.604c.166.235.24.522.21.808a.27.27 0 0 0 .248.289h.28q1.071.296 2.172.448q.471.06.947.06h.947c.727 0 1.445-.14 2.183-.24a.31.31 0 1 0-.03-.617l-2.153-.12H7.603c0-.33-.1-.654-.289-.927c-.408-.588-1.236-.857-1.754-1.634a3 3 0 0 1-.409-1.256a4.8 4.8 0 0 1 .02-1.405a6.05 6.05 0 0 1 4.755-4.814a5.74 5.74 0 0 1 6.199 2.352a6.7 6.7 0 0 1 1.136 3.22a3.92 3.92 0 0 1-.997 3.069a6 6 0 0 1-.478.429c-.449.348-.897.627-1.336.996a1.4 1.4 0 0 0-.348.578q-.14.492-.22.997c-.01.23-.086.45-.219.638a3.2 3.2 0 0 1-2.233.767a10.2 10.2 0 0 1-3.627-.787c.09-.16 0-.648 0-.947a.32.32 0 0 0-.33-.299a.31.31 0 0 0-.288.329c0 .399-.07.907 0 1.126a.43.43 0 0 0 .249.31c1.279.59 2.66.928 4.066.996a3.93 3.93 0 0 0 2.79-.917c.16-.155.28-.347.35-.558q.156-.49.239-.997c-.005-.176.033-.35.11-.508c.438-.379.877-.628 1.315-.997q.31-.229.578-.508a4.84 4.84 0 0 0 1.406-3.778" />
	<path fill="currentColor" d="M9.696 13.976c.06-.578.1-1.166.15-1.744q.235.242.528.408c.318.202.69.302 1.067.29c.35-.01.692-.106.996-.28v.827q-.005.974.16 1.934c0 .21.498.339.598 0q-.09-.966 0-1.934q.208-1.315.588-2.59a.44.44 0 0 0-.2-.52a.45.45 0 0 0-.608.06a.7.7 0 0 0-.1.16l-.109.22l-.24.388a1.6 1.6 0 0 1-.507.458a1.14 1.14 0 0 1-.598.18a1 1 0 0 1-.628-.23a1.74 1.74 0 0 1-.519-.597l-.179-.449c0-.09-.07-.309-.09-.369a.5.5 0 0 0-.398-.199a.46.46 0 0 0-.449.13c-.319.338-.07 2.252-.21 4.475a3 3 0 0 1 0 .647c0 .42.47.539.579.1c.106-.447.163-.905.17-1.365M3.098 6.182a3 3 0 0 0-.408-.409l-.459-.339c-.369-.239-.757-.428-1.146-.648a.32.32 0 0 0-.439.07a.31.31 0 0 0 .07.429c.3.309.588.618.897.917c.13.13.26.259.389.368c.13.11.269.23.409.34q.518.351.996.757a.27.27 0 0 0 .379 0a.27.27 0 0 0 .05-.389a5.8 5.8 0 0 0-.738-1.096m3.967-4.445q.075.275.19.538c.07.17.139.339.229.508c.209.389.458.738.677 1.136a.28.28 0 0 0 .519-.189a12 12 0 0 0-.27-1.326a6 6 0 0 0-.189-.538a4 4 0 0 0-.21-.508C7.754.959 7.515.6 7.285.212a.31.31 0 0 0-.408-.19a.31.31 0 0 0-.17.399c.12.468.22.897.36 1.316m7.443 2.621a.27.27 0 0 0 .3-.24q.21-.543.368-1.106c.05-.219.07-.448.1-.667a6 6 0 0 1 .11-.997a.327.327 0 0 0-.12-.449a.33.33 0 0 0-.449.12a4.3 4.3 0 0 0-.508.997q-.075.225-.12.458q-.015.235 0 .469c0 .378.08.717.11 1.056a.29.29 0 0 0 .21.359m8.571 3.139c-.469 0-.907-.07-1.366-.07h-.588c-.19 0-.389.07-.578.12q-.668.226-1.286.568a.28.28 0 1 0 .18.519c.448-.07.867-.07 1.295-.1l.539-.06l.548-.1c.428-.09.847-.199 1.295-.289a.33.33 0 0 0 .29-.338a.31.31 0 0 0-.33-.25M12.916 21.002q-.499.031-.997 0c-.32 0-.638-.05-.997-.07l-.996-.05c-.658 0-1.306 0-1.994-.07a.28.28 0 0 0-.329.21a.28.28 0 0 0 .21.33a10.4 10.4 0 0 0 1.724.517q.386.07.777.08q.389.03.778 0q.966-.078 1.903-.329a.32.32 0 0 0 .26-.359a.31.31 0 0 0-.34-.259m-1.075 2.014a8 8 0 0 1-.997-.09a5 5 0 0 0-.658 0c-.399 0-.768.1-1.156.14a.27.27 0 0 0-.3.239a.3.3 0 0 0 .25.309q.504.193 1.026.328q.222.04.449.05q.229.015.458 0A4.2 4.2 0 0 0 12 23.624a.311.311 0 0 0-.13-.608z" />
</svg>

                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  توصيل آمن
                </span>
              </div>
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-red-50 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
		<path d="M19.262 4.047c-.08-1.824-1.884-1.565-2.462-1.206c-.28.195-.502.464-.638.777a1.42 1.42 0 0 0 .31 1.535a1.83 1.83 0 0 0 1.375.638a1.664 1.664 0 0 0 1.415-1.744m-1.495.498a.62.62 0 0 1-.418-.229a.6.6 0 0 1-.21-.269s-.06-.06-.05-.09a1 1 0 0 1 .22-.508a.538.538 0 0 1 .937.339c.05.349-.12.767-.479.757M10.999 5.96a.8.8 0 0 0 .22-.069c.896-.439.817-.548.817-.628c0-.409-.937-.538-.997-.548a1 1 0 0 0-.29 0a.9.9 0 0 0-.258.11c-.848.478-.828.647-.788.827c.03.389 1.236.309 1.296.309M7.161 7.167a.7.7 0 0 0 .16-.13c.638-.697.518-.807.488-.877c-.14-.349-1.076-.12-1.096-.12a.8.8 0 0 0-.25.12q-.11.084-.199.19c-.638.837-.388.996-.329 1.086c.21.2 1.206-.26 1.226-.27m-3.777 4.178c.229.08.338 0 .897-.718q.078-.105.14-.22a.8.8 0 0 0 .099-.249c.26-.997.06-1.076 0-1.126c-.28-.17-.997.488-.997.568q-.096.114-.16.25q-.07.136-.1.288c-.238 1.127.03 1.177.12 1.207m-.009 3.578q.015-.135 0-.27a1 1 0 0 0-.06-.248c-.35-.997-.529-.927-.618-.927c-.32 0-.529.837-.558.996a1 1 0 0 0 0 .31q.029.15.09.288c.428 1.057.687.928.777.908s.309-.04.369-1.057M4.23 18.4a.5.5 0 0 0-.099-.169c-.618-.737-.797-.568-.817-.568c-.32.1-.28.997-.28.997a.5.5 0 0 0 .07.24a.8.8 0 0 0 .14.208c.628.648.847.569.997.479s0-1.166-.01-1.186m2.342 3.189a1.8 1.8 0 0 0-.379-.309s-1.076-.548-1.295-.289c-.22.26.448 1.117.468 1.127q.105.135.24.239q.143.095.298.17c1.127.498 1.256.179 1.306.08c.05-.1.12-.26-.638-1.018m12.929-1.764a1.6 1.6 0 0 0-.17.19q-.073.11-.13.229c-.388.947-.219.997-.149 1.086c.27.25 1.087-.369 1.107-.379a.9.9 0 0 0 .189-.229q.087-.125.14-.269c.368-1.057.09-1.136 0-1.186s-.34-.07-.987.558m1.694-5.432c-.24 0-.329 0-.618 1.196c0 .11-.05.22-.07.339s0 .229 0 .339c0 1.255.21 1.216.32 1.246c.368.1.777-.838.857-1.067q.054-.19.08-.389a1.8 1.8 0 0 0 0-.399c-.16-1.325-.45-1.265-.569-1.265m.578-2.961a1.8 1.8 0 0 0-.14-.359c-.617-1.186-.896-.997-.996-.997s-.3.19-.11 1.336q.033.29.14.558s.548 1.207.917 1.097c.12 0 .359-.08.269-1.296a1.2 1.2 0 0 0-.08-.339" />
		<path d="M14.408 6.3q.243.673.578 1.306q.39.712.897 1.345a22 22 0 0 0 1.595 1.715a.329.329 0 1 0 .469-.459a17 17 0 0 1-1.436-1.734a7 7 0 0 1-.718-1.256a8.5 8.5 0 0 1-.458-1.176a9 9 0 0 1-.26-1.256a6 6 0 0 1 0-.868c.003-.254.046-.507.13-.747a2.64 2.64 0 0 1 3.02-1.814A2.5 2.5 0 0 1 20.4 4.047a9.8 9.8 0 0 1-.608 2.99a7.1 7.1 0 0 1-1.655 2.532a.37.37 0 1 0 .508.538a8 8 0 0 0 1.994-2.72c.442-1.028.724-2.117.837-3.23A3.6 3.6 0 0 0 18.485.08a3.79 3.79 0 0 0-4.396 2.601c-.096.3-.147.613-.15.927q-.042.651.05 1.296q.15.715.419 1.396" />
		<path d="M20.16 14.174c.046-.729.012-1.46-.1-2.183a5.8 5.8 0 0 0-.489-1.415a.36.36 0 0 0-.488-.18a.37.37 0 0 0-.18.489c.23.494.375 1.023.43 1.565a11 11 0 0 1 0 1.535c-.998.12-1.994.279-2.991.389h-.22a10 10 0 0 0-.08-1.097a10.5 10.5 0 0 0-.488-1.993a15 15 0 0 0-2.282-4.117a.36.36 0 0 0-.28-.13a.4.4 0 0 0 .1-.219a.32.32 0 0 0-.309-.339a6.98 6.98 0 0 0-4.226.997a9.9 9.9 0 0 0-2.99 3.12a7.97 7.97 0 0 0-1.087 5.193a6.12 6.12 0 0 0 2.83 4.595a9.5 9.5 0 0 0 8.324.489a7.3 7.3 0 0 0 4.525-6.699m-5.772-2.521q.247.906.399 1.834c0 .328.07.657.11.996c-.997.06-1.934 0-2.921 0c-.588 0-1.186 0-1.774-.07c0-.209 0-.428.07-.637q.161-1.01.438-1.994c.488-1.794 1.665-4.695 1.993-4.216a16 16 0 0 1 1.685 4.087m-5.383-3.42a6.2 6.2 0 0 1 2.841-.996a16.3 16.3 0 0 0-2.292 4.226a12.6 12.6 0 0 0-.549 2.143v.798a42 42 0 0 1-3.389-.42a6.5 6.5 0 0 1 .808-2.79a8.9 8.9 0 0 1 2.581-2.96M5.616 15.7a7 7 0 0 1-.07-.897q1.632.405 3.34.658v.379a18 18 0 0 0 .608 4.236a7.3 7.3 0 0 1-1.565-.688A4.98 4.98 0 0 1 5.636 15.7zm4.685 4.576a20 20 0 0 1-.299-4.406v-.25c.798.08 1.595.14 2.392.14c.798 0 1.695-.07 2.522-.15c.07 1.4-.027 2.802-.289 4.177a.38.38 0 0 0 0 .26a8.3 8.3 0 0 1-4.306.229zm5.134-.499c.423-1.418.657-2.886.697-4.366l.32-.06c.916-.199 1.814-.438 2.73-.637a6.31 6.31 0 0 1-3.727 5.063zm-5.323 3.04l-.32-.08q-.164-.015-.328 0c-1.216 0-1.206.2-1.236.299c-.1.359.897.817.997.867q.181.075.379.09q.199.018.398-.01c1.306-.11 1.256-.459 1.256-.578c-.02-.3-.14-.31-1.146-.588m3.598-.24h-.259q-.13.024-.25.08c-.996.399-.906.568-.906.658c0 .329.877.488 1.086.508q.155.023.31 0a1.3 1.3 0 0 0 .298-.11c.997-.508.887-.787.858-.877c-.09-.239-.23-.269-1.137-.259m3.43-.837a2.3 2.3 0 0 0-.45.12s-1.046.558-.996.897s1.166.289 1.186.289q.169-.013.329-.07q.164-.048.309-.14c.907-.558.897-.837.797-.996s-.12-.29-1.176-.1" />
	</g>
</svg>

                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  كل محافظات العراق
                </span>
              </div>
              <div className="flex items-center gap-2.5 grayscale hover:grayscale-0 transition-all cursor-default group">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-green-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
		<path d="m14.022 16.483l-3.568 2.649c-.21.16-.52.48-.85.71a.7.7 0 0 1-.4.19a1.8 1.8 0 0 1-1.06-.55a14.5 14.5 0 0 1-1.448-1.69c-.79-1-1.56-1.999-2.3-2.999s-1.419-2.049-2.069-3.118c-1.349-2.18-1.269-1.41-.75-1.97q.47-.53 1-.999t1.11-.87l1.999-1.589l.66-.51c.16 0 .33.18.51.34q.372.349.7.74l.999 1.2l3.278 4.387a.361.361 0 1 0 .58-.43L9.254 7.488l-.95-1.26a7 7 0 0 0-1.119-1.16a1.48 1.48 0 0 0-.94-.32a1.4 1.4 0 0 0-.509.2q-.348.222-.66.49l-1.999 1.48c-.43.29-.84.59-1.24.91q-.6.497-1.139 1.059a4.6 4.6 0 0 0-.64.78a.7.7 0 0 0 0 .56q.144.381.36.73c.28.469.65.929.91 1.349c.65 1.089 1.34 2.168 2.119 3.208s1.6 2 2.449 2.999a11.5 11.5 0 0 0 1.999 1.999c.384.28.844.44 1.32.46a1.4 1.4 0 0 0 .76-.27q.526-.41.999-.88c.68-.56 1.36-1.14 1.999-1.689q.68-.549 1.38-1.08a.32.32 0 0 0-.36-.52z" />
		<path d="M8.915 11.175a2.38 2.38 0 0 0-3-.27a2.45 2.45 0 0 0-.889 1.74a2.15 2.15 0 0 0 .74 1.809c.397.308.887.47 1.39.46c.468.007.929-.117 1.329-.36a.33.33 0 0 0 .12-.44a.35.35 0 0 0 .27-.1a1.83 1.83 0 0 0 .04-2.839m-.58 2.309a.35.35 0 0 0 0 .47h-.12a1.76 1.76 0 0 1-1 .12a1.27 1.27 0 0 1-.77-.39a1.14 1.14 0 0 1-.23-1a1.33 1.33 0 0 1 .46-.89a1.24 1.24 0 0 1 1.55.07a1 1 0 0 1 .11 1.62m9.015-7.077a14 14 0 0 0-.379-1.55a7 7 0 0 0-.54-1.229a1.77 1.77 0 0 0-.81-.75a1.6 1.6 0 0 0-.739-.08q-.646.12-1.27.33a.324.324 0 1 0 .15.63q.495-.099 1-.13a.86.86 0 0 1 .45.09c.14.08.2.26.28.43q.215.518.32 1.07c.19.56.32 1.13.46 1.699s.33 1.17.49 1.75c.16.579.25.819.25.829c.079.42.619.08.659-.53c-.2-1.03-.12-1.53-.32-2.559m6.617 10.116a7.7 7.7 0 0 0-.51-2.12a6.7 6.7 0 0 0-1.12-1.889a8.18 8.18 0 0 0-4.367-2.598c-.36-.17-.63.09-.62.52a5.7 5.7 0 0 1-.71 1.579a2.71 2.71 0 0 1-2.759.38a1.35 1.35 0 0 0-.83.09a1.54 1.54 0 0 0-1.079 1.529a2 2 0 0 0 .8 1.609c.13.07.4.2.74.34c.77.32 1.999.74 2.468 1c-.08.2.21.73.26.88a5.5 5.5 0 0 0 1.07 1.808a1.8 1.8 0 0 0 1.44.62a.36.36 0 1 0 0-.72a1.1 1.1 0 0 1-.82-.45a4.3 4.3 0 0 1-.76-1.559c-.05-.18-.07-.75-.15-1a.6.6 0 0 0-.24-.34a5.6 5.6 0 0 0-.74-.399c-.87-.4-2.288-1-2.618-1.2a.77.77 0 0 1-.21-.57a.41.41 0 0 1 .25-.42a1 1 0 0 1 .35 0q.732.074 1.469.06a3 3 0 0 0 2.209-1.289a3.26 3.26 0 0 0 .48-1.709a7.6 7.6 0 0 1 3.448 2.56a7 7 0 0 1 .9 1.618c.234.583.402 1.19.5 1.81c.23 1.504.161 3.04-.2 4.518a.37.37 0 0 0 .25.45a.36.36 0 0 0 .44-.25c.556-1.556.78-3.21.66-4.858" />
		<path d="M14.852 10.066c-.29-1-.55-2-.83-3c-.18-.669-.39-1.329-.58-1.998a7.7 7.7 0 0 0-.75-2a1.45 1.45 0 0 0-1.079-.71a.87.87 0 0 0-.46.1q-.383.23-.74.5l-2.438 1.55a.32.32 0 1 0 .27.57l2.639-1.26c.45-.23.58-.89 1 .3c.18.48.29 1 .37 1.29c.389 1.189.769 2.368 1.189 3.548s.69 1.61 1.14 2.669c.199.58.719.72.719.29c-.21-.7-.24-1.15-.45-1.85" />
	</g>
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
              handleSubmit={handleSubmit}
              submitting={submitting}
              paymentMethod={paymentMethod}
              customerData={{ name, phone: phoneNumber, address }}
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
                  handleSubmit={handleSubmit}
                  submitting={submitting}
                  paymentMethod={paymentMethod}
                  customerData={{ name, phone: phoneNumber, address }}
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
  handleSubmit,
  submitting,
  paymentMethod,
  customerData,
  isDrawer = false,
}) => (
  <div
    className={`${!isDrawer ? "bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-gray-100 lg:sticky lg:top-32" : ""}`}
  >
    <h2 className="text-2xl text-black font-black mb-8 pb-4 border-b border-gray-50 tracking-tight flex items-center gap-3">
    <svg xmlns="http://www.w3.org/2000/svg" width="1.8em" height="1.8em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
		<path d="M23.998 16.893c-.08-1.129-1.889-.999-3.108-1.139a2 2 0 0 0-.45-.08a10.7 10.7 0 0 0-1.568-2.508c-.74-1-1.42-.64-1.949.44l-.82 1.799c0 .09-.199.24-.239.37a2 2 0 0 0-.37 0a7.6 7.6 0 0 0-2.528.349c-.55.3-.51 1-.05 1.469c.461.388.964.723 1.5 1c.347.245.741.419 1.158.509a.33.33 0 0 0 0-.66l-.76-.41c-.629-.46-.998-.51-1.498-1.219c0 0 2.238-.13 2.678-.14c.68 0 .65-.57 1.999-3.057q.577.736 1.009 1.569q.3.729.72 1.399c.299.32.808.21.998.24a11 11 0 0 1 1.999.26c-.661.48-1.375.882-2.128 1.198a.66.66 0 0 0-.25.7c.266.83.44 1.689.52 2.558a7.8 7.8 0 0 1-2.469-1.849a.47.47 0 0 0-.66 0c-.639.49-1.818 2.538-2.757 2.488c.07-.15-.1-.21.16-.889s.839-1.429.38-1.599a.29.29 0 0 0-.37.17c-.19.48-.41.8-.58 1.2a3.1 3.1 0 0 0-.28 1.348c.15.59 1 .53 1.56.21a6.9 6.9 0 0 0 1.708-1.549q.294-.201.56-.44a9.5 9.5 0 0 0 2.118 1.73c.54.299 1.079.669 1.469.259s.17-.73.18-1a10.4 10.4 0 0 0-.4-2.597c.87-.39 2.588-1.19 2.518-2.129" />
		<path d="M11.437 17.763a23.6 23.6 0 0 1-7.054-.54c-1.549-.41-1.999-2.738-2.249-4.357c-.46-2.458-.32-1.698-.35-2.078c1.56.27 13.12.21 13.22.21a3 3 0 0 0-.309.79c-.07.359-.22 1.998-.21 1.898a.331.331 0 0 0 .66.05c.72-1.56.809-2.418.69-2.798q.445-.034.878-.15a1.51 1.51 0 0 0 .29-2.578a3.3 3.3 0 0 0-1.109-.27a4.93 4.93 0 0 0-1.809-4.716a2.4 2.4 0 0 0-1.289-.52c-.08-1.199-.999-1.599-2.188-1.559l-3.747.17a.33.33 0 0 0 0 .66c3.587.11 4.147.05 4.586.3a.54.54 0 0 1 .23.519v.34c-.29.67-2.088.4-2.888.48c-.53.07-2.338.42-2.618 0a1.31 1.31 0 0 1 0-1.29a.293.293 0 0 0-.42-.41a2 2 0 0 0-.17 2.09c.49.928 2.28.699 3.328.649c1.05-.05 3.488.5 3.887-1.28c.27.11.2-.06.74.53A7.86 7.86 0 0 1 15.265 7.9a.33.33 0 0 0 0 .66c.502.028.997.133 1.468.31c.27.15.21 1.069-.21 1.169a15.8 15.8 0 0 1-3.816 0c-12.351-.22-10.133-.25-11.562-.56c-.14-.15.08-.56.28-.65a3.6 3.6 0 0 1 1.499-.3c.45 0 7.084-.33 10.912-.17a.29.29 0 1 0 0-.579c-3.418-.28-11.212-.27-11.292-.27a11.3 11.3 0 0 1 1.919-3.367c.87-.66.8-.68.8-.8a.33.33 0 0 0-.33-.34c-.36 0-.79.33-1 .5A4.67 4.67 0 0 0 1.935 7.58A2 2 0 0 0 .116 8.81a1.29 1.29 0 0 0 .58 1.678q.195.1.41.15q.012.247.06.49c.259 2.888.18 6.415 2.927 7.164a20.6 20.6 0 0 0 3.347.38c1.36.033 2.721-.051 4.067-.25a.332.332 0 0 0-.07-.66" />
		<path d="M4.693 12.407c-.86-.34.17 4.177.999 3.827a.33.33 0 0 0 .25-.24c.17-.33-.79-3.797-1.25-3.587m7.585 0c-.46-.21-1.42 3.257-1.27 3.587a.33.33 0 0 0 .24.21c.86.38 1.89-4.137 1.03-3.797m-3.857-.3c-.06 0-.16 0-.2.14a7.46 7.46 0 0 0-.13 3.747a.39.39 0 0 0 .33.42c.76 0 .44-3.118.29-4.057c-.11-.22-.21-.28-.29-.25" />
	</g>
</svg>

      ملخص الطلب
    </h2>

    {/* Customer Info Review */}
    {customerData &&
      (customerData.name || customerData.phone || customerData.address) && (
        <div className="mb-8 p-6 bg-[#F9F9F9] border-2 border-dashed border-gray-200 rounded-[24px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black/[0.02] rounded-full -mr-10 -mt-10" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 relative z-10">
            معلومات التوصيل
          </h3>
          <div className="space-y-4 relative z-10">
            {customerData.name && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 text-black rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="text-sm font-black text-black">
                  {customerData.name}
                </span>
              </div>
            )}
            {customerData.phone && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full text-black bg-white flex items-center justify-center shadow-sm border border-black/5">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <span className="text-sm font-black text-black" dir="ltr">
                  {customerData.phone}
                </span>
              </div>
            )}
            {customerData.address && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 text-black rounded-full bg-white flex items-center justify-center shadow-sm border border-black/5 shrink-0">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-black leading-relaxed">
                  {customerData.address}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

    <div
      className={`flex flex-col gap-6 mb-10 ${!isDrawer ? "max-h-[350px]" : "max-h-[45vh]"} overflow-y-auto scrollbar-hide pr-1`}
    >
      {cartItems.length === 0 && (
        <div className="py-10 text-center text-gray-400 text-sm font-bold">
          سلتك فارغة
        </div>
      )}
      {cartItems.map((item) => (
        <div key={item.key ?? item.id} className="flex gap-5 group items-center">
          <div className="w-16 h-16 rounded-[18px] overflow-hidden bg-[#F9F9F9] shrink-0 border border-gray-100">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
                لا صورة
              </div>
            )}
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
            onClick={() => removeItem(item.key ?? item.id)}
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

    {/* Submit Button */}
    <div className="pt-8 mt-8 border-t border-gray-100">
      <button
        onClick={handleSubmit}
        disabled={submitting}
        className={`w-full py-6 rounded-[28px] font-black text-xl transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed ${
          paymentMethod === "store"
            ? "bg-black text-white hover:bg-black/90 shadow-black/20"
            : "bg-green-500 text-white hover:bg-green-600 shadow-green-500/20"
        }`}
      >
        {submitting ? (
          <svg
            className="animate-spin"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : paymentMethod === "store" ? (
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
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
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
);

export default CheckoutPage;

"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import Container from "@/components/container";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const orderId = params.get("orderId");

  return (
    <div
      className="w-full min-h-screen bg-[#FAFAFA] flex items-center justify-center py-24"
      dir="rtl"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="w-28 h-28 bg-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-black/20"
          >
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
            تم استلام طلبك! 🎉
          </h1>

          {orderId && (
            <p className="text-gray-400 font-bold mb-3">
              رقم الطلب:{" "}
              <span className="text-black font-black">#{orderId}</span>
            </p>
          )}

          <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10">
            شكراً لثقتك بنا. سنتواصل معك قريباً لتأكيد الطلب وترتيب التوصيل.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/products")}
              className="bg-black text-white px-10 py-4 rounded-[20px] font-black text-base hover:bg-black/90 transition-all shadow-xl shadow-black/10"
            >
              متابعة التسوق
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/")}
              className="bg-white text-black px-10 py-4 rounded-[20px] font-black text-base border-2 border-gray-100 hover:border-black transition-all"
            >
              الصفحة الرئيسية
            </motion.button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}

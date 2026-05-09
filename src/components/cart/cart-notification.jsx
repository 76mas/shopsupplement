"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";

const CartNotification = () => {
  const { notification, setNotification, setOpen } = useCart();

  const typeConfig = {
    success: {
      bg: "bg-black",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    },
    info: {
      bg: "bg-amber-500",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    update: {
      bg: "bg-blue-600",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      )
    }
  };

  const currentConfig = typeConfig[notification.type] || typeConfig.success;

  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%", scale: 0.9 }}
          animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
          exit={{ opacity: 0, y: 20, x: "-50%", scale: 0.95 }}
          className="fixed bottom-10 left-1/2 z-[9999] w-[90%] max-w-[400px]"
        >
          <div className="bg-white/90 backdrop-blur-xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[24px] p-4 flex items-center gap-4">
            {/* Icon Wrapper */}
            <div className={`w-12 h-12 ${currentConfig.bg} rounded-full flex items-center justify-center shrink-0 transition-colors duration-300`}>
              {currentConfig.icon}
            </div>

            {/* Content */}
            <div className="flex-grow text-right">
              <h4 className="text-black font-black text-sm md:text-base truncate max-w-[200px]">
                {notification.name}
              </h4>
              <p className="text-gray-500 text-xs md:text-sm">
                {notification.message || "تمت الإضافة بنجاح"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-1 shrink-0">
                <button 
                  onClick={() => {
                      setOpen(true);
                      setNotification({ show: false, name: "" });
                  }}
                  className="text-[10px] md:text-[11px] font-black bg-black text-white px-4 py-2 rounded-xl hover:opacity-80 active:scale-95 transition-all"
                >
                  سلة التسوق
                </button>
                <button 
                  onClick={() => setNotification({ show: false, name: "" })}
                  className="text-[10px] font-bold text-gray-400 hover:text-black transition-colors"
                >
                  إغلاق
                </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification;

"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import styles from "./cart.module.css";
import Container from "@/components/container";
import { useCart } from "@/context/cart-context";

export default function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      swipeDirection="up"
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Viewport className={styles.Viewport}>
          <Drawer.Popup className={styles.Popup} dir="rtl">

            <Container className="mx-auto">
              <div className="flex justify-between items-center text-black px-6 pt-8 mb-4">
                <div className="flex flex-col">
                  <Drawer.Title className="text-2xl font-black">سلة المشتريات</Drawer.Title>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {items.length} {items.length === 1 ? "منتج" : "منتجات"}
                  </p>
                </div>
                <Drawer.Close className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Drawer.Close>
              </div>
            </Container>

            <Drawer.Content className={styles.Scroll}>
              <Container className="mx-auto">
                <div className="flex flex-col gap-6 mt-4 pb-10">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        key={item.key}
                        className="flex gap-4 items-center border-b border-gray-50 pb-6 group"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs">لا صورة</div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col gap-1 pr-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-black text-sm line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="text-gray-300 hover:text-red-500 p-1 transition-colors"
                            >
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>

                          <p className="text-[10px] text-gray-400 font-bold">
                            {item.flavor && <span>{item.flavor}</span>}
                            {item.flavor && item.size && <span className="mx-1">/</span>}
                            {item.size && <span>{item.size}</span>}
                          </p>

                          <div className="flex justify-between items-end mt-2">
                            <span className="font-black text-black text-lg">
                              {(item.price * item.quantity).toLocaleString()} د.ع
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                              <button
                                onClick={() => updateQuantity(item.key, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black font-bold disabled:opacity-30"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                              <span className="w-8 text-center text-sm font-black text-black">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.key, 1)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black font-bold"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {items.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-20 text-center flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg>
                      </div>
                      <p className="text-gray-400 font-bold">سلتك فارغة حالياً</p>
                    </motion.div>
                  )}
                </div>
              </Container>
            </Drawer.Content>

            {/* Footer Actions */}
            <div className="bg-gray-50/50 border-t border-gray-100">
              <Container className="mx-auto p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <span className="font-bold text-gray-500">المجموع الكلي</span>
                  <span className="text-xl font-black text-black">{total.toLocaleString()} د.ع</span>
                </div>
                <button
                  disabled={items.length === 0}
                  onClick={() => {
                    router.push("/checkout");
                    setOpen(false);
                  }}
                  className="w-full cursor-pointer bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-black/90 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إتمام الطلب
                </button>
              </Container>
            </div>

            {/* Handle */}
            <div className={styles.DragArea}>
              <div className={styles.Handle} />
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

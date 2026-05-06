"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { motion } from "motion/react";
import styles from "@/app/products/drawer.module.css";
import ProductDetailsContent from "./product-details-content";
import Container from "@/components/container";

export default function ProductDrawer({ product, open, onOpenChange }) {
  const [quantity, setQuantity] = React.useState(1);
  const snapPoints = [0.8, 1];

  return (
    <Drawer.Root 
      open={open} 
      onOpenChange={onOpenChange} 
      snapPoints={snapPoints} 
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Viewport className={styles.Viewport}>
          <Drawer.Popup className={`${styles.Popup} flex flex-col`} dir="rtl">
            {/* Header / Drag Area */}
            <div className={styles.DragArea}>
              <div className={styles.Handle} />
            </div>

            {/* Scrollable Content */}
            <Drawer.Content className={styles.Scroll}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, cubicBezier: [0.32, 0.72, 0, 1] }}
                className={styles.Content}
              >
                <div className="w-full lg:max-w-6xl lg:mx-auto lg:px-5">
                  <ProductDetailsContent 
                    product={product} 
                    quantity={quantity} 
                    setQuantity={setQuantity} 
                  />
                  {/* Spacer for the fixed bottom buttons - Mobile Only */}
                  <div className="h-32 lg:hidden" />
                </div>
              </motion.div>
            </Drawer.Content>

            {/* Fixed Bottom Actions - Mobile Only */}
            <div 
              className="absolute left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-50 lg:hidden"
              style={{ 
                bottom: 'var(--drawer-snap-point-offset)',
                transform: 'translateY(var(--drawer-swipe-movement-y))'
              }}
            >
              <div className="w-full lg:max-w-6xl lg:mx-auto p-6 flex items-center gap-4 text-black">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-4 text-black w-full"
                >
                  <div className="flex items-center justify-between bg-[#F5F5F5] rounded-[20px] px-5 py-4 w-36 border border-gray-200/50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-2xl font-bold hover:scale-125  transition-transform cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-2xl font-bold hover:scale-125 transition-transform cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button className="flex-1 bg-black text-white rounded-[20px] py-4.5 font-black text-lg hover:bg-black/90 transition-all active:scale-[0.97] cursor-pointer shadow-xl shadow-black/20">
                    إضافة للسلة
                  </button>
                </motion.div>
              </div>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

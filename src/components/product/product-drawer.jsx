"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { motion } from "motion/react";
import styles from "@/app/(shop)/products/drawer.module.css";
import ProductDetailsContent from "./product-details-content";
import Container from "@/components/container";
import { useCart } from "@/context/cart-context";

export default function ProductDrawer({ product, open, onOpenChange }) {
  const [quantity, setQuantity] = React.useState(1);

  // ──── نختار النكهة/الحجم هنا لنمررها لزر الموبايل ────
  const [selectedFlavor, setSelectedFlavor] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState(0);
  const { addItem, count, setOpen: setCartOpen } = useCart();
  const [added, setAdded] = React.useState(false);

  const snapPoints = [0.6, 1];

  const flavors = Array.isArray(product?.flavors) ? product.flavors : [];
  const sizes = Array.isArray(product?.sizes) ? product.sizes : [];

  const handleAddToCart = () => {
    if (!product || !product.isAvailable) return;
    
    const isFirstItem = count === 0;

    addItem(product, {
      flavor: flavors[selectedFlavor] ?? null,
      size: sizes[selectedSize] ?? null,
      quantity,
    });
    setAdded(true);
    
    // 1. انتظر قليلاً ليرى المستخدم علامة الصح
    setTimeout(() => {
      // 2. أغلق نافذة المنتج أولاً
      onOpenChange(false);
      setAdded(false);
      
      // 3. إذا كان أول منتج، افتح السلة بعد أن تنغلق نافذة المنتج تماماً
      if (isFirstItem) {
        setTimeout(() => {
          setCartOpen(true);
        }, 500); // مهلة انتظار لغلق الدرور الأول
      }
    }, 600);
  };

  // Reset state when product changes
  React.useEffect(() => {
    setQuantity(1);
    setSelectedFlavor(0);
    setSelectedSize(0);
    setAdded(false);
  }, [product?.id]);

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
                transition={{ duration: 0.5 }}
                className={styles.Content}
              >
                <div className="w-full lg:max-w-6xl lg:mx-auto lg:px-5">

                  {/* ── شريط "غير متوفر" ─────────────────────── */}
                  {product && !product.isAvailable && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 rounded-[18px] px-5 py-4"
                      dir="rtl"
                    >
                      <span className="text-2xl">🚫</span>
                      <div>
                        <p className="font-black text-red-700 text-sm">هذا المنتج غير متوفر حالياً</p>
                        <p className="text-red-500 text-xs font-medium mt-0.5">عذراً، نفذت الكمية من المخزون</p>
                      </div>
                    </motion.div>
                  )}

                  <ProductDetailsContent
                    product={product}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    selectedFlavor={selectedFlavor}
                    setSelectedFlavor={setSelectedFlavor}
                    selectedSize={selectedSize}
                    setSelectedSize={setSelectedSize}
                  />
                  {/* Spacer for the fixed bottom buttons - Mobile Only */}
                  <div className="h-32 lg:hidden" />
                </div>
              </motion.div>
            </Drawer.Content>

            {/* Fixed Bottom Actions - Mobile Only */}
            <div className={`${styles.FixedActions} lg:hidden`}>
              <div className="w-full lg:max-w-6xl lg:mx-auto p-6 pb-8 flex items-center gap-4 text-black">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-4 text-black w-full"
                >
                  {product?.isAvailable ? (
                    <>
                      {/* Quantity */}
                      <div className="flex items-center justify-between bg-[#F5F5F5] rounded-[20px] px-5 py-4 w-36 border border-gray-200/50">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-2xl font-bold hover:scale-125 transition-transform cursor-pointer">-</button>
                        <span className="font-black text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="text-2xl font-bold hover:scale-125 transition-transform cursor-pointer">+</button>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={handleAddToCart}
                        className={`flex-1 rounded-[20px] py-4.5 font-black text-lg transition-all active:scale-[0.97] cursor-pointer shadow-xl ${
                          added
                            ? "bg-green-500 text-white shadow-green-500/20"
                            : "bg-black text-white hover:bg-black/90 shadow-black/20"
                        }`}
                      >
                        {added ? "✓ تمت الإضافة!" : "إضافة للسلة"}
                      </button>
                    </>
                  ) : (
                    /* Out of stock state */
                    <div className="flex-1 rounded-[20px] py-4.5 font-black text-lg text-center bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed select-none">
                      😔 غير متوفر حالياً
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "@/context/cart-context";

const ProductDetailsContent = ({
  product,
  quantity,
  setQuantity,
  // Controlled from parent (mobile drawer sync)
  selectedFlavor: controlledFlavor,
  setSelectedFlavor: controlledSetFlavor,
  selectedSize: controlledSize,
  setSelectedSize: controlledSetSize,
  onAddedToCart,
}) => {
  const [activeImage, setActiveImage] = useState(0);
  // Use controlled state if provided, else internal
  const [internalFlavor, setInternalFlavor] = useState(0);
  const [internalSize, setInternalSize] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const selectedFlavor =
    controlledFlavor !== undefined ? controlledFlavor : internalFlavor;
  const setSelectedFlavor = controlledSetFlavor ?? setInternalFlavor;
  const selectedSize =
    controlledSize !== undefined ? controlledSize : internalSize;
  const setSelectedSize = controlledSetSize ?? setInternalSize;

  if (!product) return null;

  const images = product.images?.length
    ? product.images
    : (product.productImages?.map((i) => i.image) ?? []);

  const flavors = Array.isArray(product?.flavors)
    ? product.flavors
    : typeof product?.flavors === "string"
      ? JSON.parse(product.flavors)
      : [];

  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : typeof product?.sizes === "string"
      ? JSON.parse(product.sizes)
      : [];

  const selectedSizePrice = Number(sizes[selectedSize]?.price || 0);

  const baseDisplayPrice = Number(product.endPrice ?? product.price ?? 0);

  const displayPrice = baseDisplayPrice + selectedSizePrice;

  const originalPrice =
    product.price && Number(product.price) !== baseDisplayPrice
      ? Number(product.price) + selectedSizePrice
      : null;

  const handleAddToCart = () => {
    if (!product.isAvailable) return; // حماية إضافية
    addItem(product, {
      flavor: flavors[selectedFlavor] ?? null,
      size: sizes[selectedSize] ?? null,
      quantity: quantity ?? 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    onAddedToCart?.();
  };

  return (
    <div
      className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full text-black px-1"
      dir="rtl"
    >
      {/* Gallery Section */}
      <div className="w-full lg:w-1/2 flex flex-col gap-4">
        {/* Main Image */}
        <div className="w-full aspect-square rounded-[28px] overflow-hidden bg-[#F3F3F3] relative group shadow-sm">
          <AnimatePresence mode="wait">
            {images.length > 0 ? (
              <motion.img
                key={activeImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-5-5L5 21" />
                </svg>
              </div>
            )}
          </AnimatePresence>
          {product.discount && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-600 px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              {product.discount}
            </div>
          )}
          {Number(product.price) > displayPrice && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-600 px-4 py-1.5 rounded-full text-sm font-black shadow-sm">
              -{Math.round((1 - displayPrice / Number(product.price)) * 100)}%
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="w-full flex gap-3 overflow-x-auto py-4 scrollbar-hide px-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-[18px] lg:rounded-[22px] overflow-hidden border-2 transition-all duration-300 ${
                  activeImage === idx
                    ? "border-black scale-105 shadow-md"
                    : "border-transparent bg-[#F5F5F5] opacity-50"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="flex flex-col flex-1 lg:py-4">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight uppercase">
            {product.name}
          </h1>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex flex-col">
            <span className="text-3xl lg:text-4xl font-black text-black">
              {displayPrice.toLocaleString()}{" "}
              <span className="text-lg">د.ع</span>
            </span>
            {originalPrice && (
              <span className="text-lg lg:text-xl text-[#999] line-through font-medium -mt-1">
                {originalPrice.toLocaleString()} د.ع
              </span>
            )}
          </div>
        </div>

        <div className="h-px bg-gray-100 w-full mb-10" />

        {product.description && (
          <p className="text-[#444] leading-relaxed mb-12 text-base lg:text-lg font-medium max-w-xl">
            {product.description}
          </p>
        )}

        {/* Flavor Selection */}
        {flavors.length > 0 && (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm lg:text-base font-black uppercase tracking-wider text-black/40">
                النكهة المتوفرة
              </p>
              <span className="text-sm lg:text-base font-black text-black">
                {flavors[selectedFlavor]?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {flavors.map((flavor, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedFlavor(idx)}
                  className={`px-5 py-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                    selectedFlavor === idx
                      ? "border-black bg-black text-white shadow-lg shadow-black/10 scale-[1.02]"
                      : "border-gray-100 bg-gray-50/50 text-[#555] hover:border-gray-300"
                  }`}
                >
                  {flavor.color && (
                    <div
                      className="w-3 h-3 rounded-full border border-white/20 shadow-inner"
                      style={{ backgroundColor: flavor.color }}
                    />
                  )}
                  <span className="font-bold text-sm lg:text-base">
                    {flavor.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Size Selection */}
        {sizes.length > 0 && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm lg:text-base font-black uppercase tracking-wider text-black/40">
                الحجم
              </p>
              <span className="text-sm lg:text-base font-black text-black">
                {sizes[selectedSize]?.name}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {sizes.map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSize(idx)}
                  className={`flex-1 min-w-[100px] px-4 py-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    selectedSize === idx
                      ? "border-black bg-black text-white shadow-lg shadow-black/10 scale-[1.02]"
                      : "border-gray-100 bg-gray-50/50 text-[#555] hover:border-gray-300"
                  }`}
                >
                  <span className="font-black text-base lg:text-lg">
                    {size.name}
                  </span>
                  {size.price &&
                    size.price !==
                      Number(product.endPrice ?? product.price) && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-tighter ${selectedSize === idx ? "text-white/60" : "text-black/40"}`}
                      >
                        +{Number(size.price).toLocaleString()} د.ع
                      </span>
                    )}
                  {size.price_suffix && (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter ${selectedSize === idx ? "text-white/60" : "text-black/40"}`}
                    >
                      {size.price_suffix}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6 mt-4">
          {product.isAvailable ? (
            <>
              <div className="flex items-center justify-between bg-[#F5F5F5] rounded-[20px] px-6 py-4 w-44 border border-gray-200/50">
                <button
                  onClick={() => setQuantity(Math.max(1, (quantity || 1) - 1))}
                  className="text-2xl font-bold hover:scale-125 transition-transform cursor-pointer"
                >
                  -
                </button>
                <span className="font-black text-xl">{quantity || 1}</span>
                <button
                  onClick={() => setQuantity((quantity || 1) + 1)}
                  className="text-2xl font-bold hover:scale-125 transition-transform cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 rounded-[20px] py-5 font-black text-xl transition-all active:scale-[0.98] cursor-pointer shadow-xl ${
                  added
                    ? "bg-green-500 text-white shadow-green-500/20"
                    : "bg-black text-white hover:bg-black/90 shadow-black/20"
                }`}
              >
                {added ? "✓ تمت الإضافة!" : "إضافة للسلة"}
              </button>
            </>
          ) : (
            <div className="flex-1 rounded-[20px] py-5 font-black text-xl text-center bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed select-none">
              😔 غير متوفر حالياً
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// نصدّر onAddToCart handler منفصلاً للـ mobile drawer
export { ProductDetailsContent };
export default ProductDetailsContent;

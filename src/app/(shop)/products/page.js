"use client";
import Container from "@/components/container";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "motion/react";

const Left = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Right = () => (
  <svg
    width="8"
    height="14"
    viewBox="0 0 8 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.75005 0.75C0.75005 0.75 6.75 5.1689 6.75 6.75C6.75 8.3312 0.75 12.75 0.75 12.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import FilterContent, { FilterIcon } from "./filter-content";
import MobileFilterDrawer from "./mobile-filter-drawer";
import ProductDrawer from "@/components/product/product-drawer";

const Allproducts = () => {
  const [minPrice, setMinPrice] = useState(25000);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const router = useRouter();

  const products = [
    {
      id: 1,
      name: "Whey Gold Standard",
      price: 95000,
      discountPrice: 85000,
      discount: "-10%",
      image:
        "https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/",
      flavors: [
        { name: "شوكولاتة", color: "#4B2C20" },
        { name: "فانيليا", color: "#F3E5AB" },
      ],
      sizes: [
        { name: "2.27 كجم", price_suffix: "" },
        { name: "1 كجم", price_suffix: "- 40,000 د.ع" },
      ],
    },
    {
      id: 2,
      name: "C4 Original Pre-Workout",
      price: 45000,
      image:
        "https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/",
      flavors: [{ name: "توت بري", color: "#8A2BE2" }],
      sizes: [{ name: "30 حصة", price_suffix: "" }],
    },
    {
      id: 3,
      name: "Creatine Monohydrate",
      price: 35000,
      discountPrice: 28000,
      discount: "-20%",
      image:
        "https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/",
      flavors: [{ name: "بدون نكهة", color: "#FFFFFF" }],
      sizes: [{ name: "300 جم", price_suffix: "" }],
    },
    {
      id: 4,
      name: "Hydro Whey Protein",
      price: 110000,
      image:
        "https://3km3cceozg.ucarecd.net/9f4cdacc-cb08-4d36-b675-841dbc65f346/-/preview/1000x1000/",
      flavors: [{ name: "شوكولاتة", color: "#4B2C20" }],
      sizes: [{ name: "1.6 كجم", price_suffix: "" }],
    },
    {
      id: 5,
      name: "BCAA Energy",
      price: 40000,
      discountPrice: 32000,
      discount: "-20%",
      image:
        "https://3km3cceozg.ucarecd.net/27771e0a-c726-4e0b-b0e1-e5aa9f66c443/-/preview/1000x1000/",
      flavors: [{ name: "بطيخ", color: "#FF4D4D" }],
      sizes: [{ name: "30 حصة", price_suffix: "" }],
    },
    {
      id: 6,
      name: "Mass Tech Extreme",
      price: 88000,
      discountPrice: 79000,
      discount: "-10%",
      image:
        "https://3km3cceozg.ucarecd.net/c976d250-17c1-4537-b9f0-26cc8ec78406/-/preview/1000x1000/",
      flavors: [{ name: "فانيليا", color: "#F3E5AB" }],
      sizes: [{ name: "5.4 كجم", price_suffix: "" }],
    },
    {
      id: 7,
      name: "Isolate Protein",
      price: 105000,
      image:
        "https://3km3cceozg.ucarecd.net/d9974449-c794-4e5f-b211-1836d52bebae/-/preview/1000x1000/",
      flavors: [{ name: "شوكولاتة", color: "#4B2C20" }],
      sizes: [{ name: "2.27 كجم", price_suffix: "" }],
    },
    {
      id: 9,
      name: "Serious Mass Gainer",
      price: 75000,
      discountPrice: 65000,
      discount: "-13%",
      image:
        "https://3km3cceozg.ucarecd.net/a0649360-e5bc-45ae-b5b1-5021b81fc366/-/preview/1000x1000/",
      flavors: [{ name: "موز", color: "#FFE135" }],
      sizes: [{ name: "5.4 كجم", price_suffix: "" }],
    },
    {
      id: 10,
      name: "Casein Night Protein",
      price: 90000,
      image:
        "https://3km3cceozg.ucarecd.net/014f0430-78f1-41ba-9213-9a8537660288/-/preview/1000x1000/",
      flavors: [{ name: "فانيليا", color: "#F3E5AB" }],
      sizes: [{ name: "1.8 كجم", price_suffix: "" }],
    },
  ];
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 1000);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 1000);
    setMaxPrice(value);
  };

  return (
    <div
      className="w-full text-black py-20 min-h-screen flex justify-center bg-white"
      dir="rtl"
    >
      <Container className="flex flex-col pt-3 px-4 md:px-0">
        <div className="flex items-center justify-start gap-2 mb-10">
          <p
            className="font-bold text-xl cursor-pointer hover:text-black/60 transition-colors"
            onClick={() => router.push("/")}
          >
            الرئيسية
          </p>
          <Left />
          <p className="font-black text-xl">المنتجات</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:flex flex-col sticky top-24 w-[28%] lg:w-[25%] h-fit border p-6 border-[#88888833] rounded-[24px] bg-white shadow-sm">
            <FilterContent
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleMinChange={handleMinChange}
              handleMaxChange={handleMaxChange}
            />
          </div>

          {/* products grid */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">الكل</h2>

              <div className="flex items-center gap-4">
                <p className="hidden md:block text-[#999] text-sm">
                  تم جلب 10 منتجات من اصل 100 منتج
                </p>
                <MobileFilterDrawer
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  handleMinChange={handleMinChange}
                  handleMaxChange={handleMaxChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group cursor-pointer active:scale-[0.98] transition-all duration-200"
                >
                  {/* حاوية الصورة */}
                  <div
                    onClick={() => {
                      // Instead of navigating, we open the drawer
                      setSelectedProduct({
                        ...product,
                        // Add mock details since the list has limited data
                        description: "وصف المنتج",
                        images: [product.image, product.image, product.image], // Mock gallery
                        flavors: [
                          { name: "شوكولاتة غنية", color: "#4B2C20" },
                          { name: "فانيليا ناعمة", color: "#F3E5AB" },
                          { name: "فراولة طازجة", color: "#FF4D4D" },
                          { name: "موز", color: "#FFE135" },
                        ],
                        sizes: [
                          { name: "1 كجم", price_suffix: "" },
                          { name: "2.27 كجم", price_suffix: "+ 40,000 د.ع" },
                          { name: "4.5 كجم", price_suffix: "+ 90,000 د.ع" },
                        ],
                      });
                      setIsProductDrawerOpen(true);
                    }}
                    className="relative aspect-square bg-[#F0EEED] rounded-[24px] overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                  >
                    {product.discount && (
                      <span className="absolute top-4 left-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                        {product.discount}
                      </span>
                    )}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <motion.div
                      style={{
                        maskImage: `url(${product.image})`,
                        maskSize: "contain",
                        maskRepeat: "no-repeat",
                        maskPosition: "center",
                        WebkitMaskImage: `url(${product.image})`,
                        WebkitMaskSize: "contain",
                        WebkitMaskRepeat: "no-repeat",
                        WebkitMaskPosition: "center",
                        background:
                          "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)",
                        backgroundSize: "200% 100%",
                      }}
                      animate={{
                        backgroundPosition: ["200% 0%", "-200% 0%"],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                      className="absolute inset-0 z-20 pointer-events-none  w-full h-auto"
                    />

                    {/* Overlay for Quick Add/View */}
                    <div className="absolute cursor-pointer inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                      <button className="w-full cursor-pointer active:scale-[0.98] bg-white/90 backdrop-blur-sm text-black py-2 rounded-xl text-xs font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        إضافة للسلة
                      </button>
                    </div>
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="text-right space-y-1.5 px-1">
                    <h3 className="text-base md:text-lg font-bold text-black truncate group-hover:text-black/70 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-start gap-2 font-black">
                      {product.discountPrice ? (
                        <>
                          <span className="text-lg text-black">
                            {product.discountPrice.toLocaleString()} د.ع
                          </span>
                          <span className="text-[#999] line-through text-xs font-medium">
                            {product.price.toLocaleString()} د.ع
                          </span>
                        </>
                      ) : (
                        <span className="text-lg text-black">
                          {product.price.toLocaleString()} د.ع
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 md:mt-16 flex items-center justify-between border-t border-[#88888822] pt-6 md:pt-8">
              <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl border border-[#88888833] text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all group cursor-pointer active:scale-95">
                <div className="group-hover:invert text-black group-hover:text-white transition-all ">
                  <Right />
                </div>
                <span className="hidden md:block">السابق</span>
              </button>

              <div className="flex items-center gap-1 sm:gap-2">
                {[1, 2, 3, "...", 10].map((page, index) => (
                  <button
                    key={index}
                    className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      page === 1
                        ? "bg-black text-white"
                        : page === "..."
                          ? "cursor-default text-[#999]"
                          : "hover:bg-[#f5f5f5] text-[#555]"
                    } ${page === 2 || page === 3 ? "hidden sm:flex" : "flex"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl border border-[#88888833] text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all group cursor-pointer active:scale-95">
                <span className="hidden md:block">التالي</span>
                <div className="rotate-180 group-hover:invert text-black group-hover:text-white transition-all">
                  <Right />
                </div>
              </button>
            </div>
          </div>
        </div>
      </Container>

      <ProductDrawer
        product={selectedProduct}
        open={isProductDrawerOpen}
        onOpenChange={setIsProductDrawerOpen}
      />
    </div>
  );
};

export default Allproducts;

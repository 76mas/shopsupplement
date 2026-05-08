"use client";
import React, { useState, useEffect } from "react";
import Container from "./container";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "motion/react";

const Header = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Sync search input with URL q param if on products page
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchInput(q);
  }, [searchParams]);

  // إذا CartProvider غير موجود (صفحات خارج shop layout) نتجاهل الخطأ
  let cartCount = 0;
  let openCart = () => {};
  try {
    const cart = useCart();
    cartCount = cart.count;
    openCart = () => cart.setOpen(true);
  } catch {}

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) {
      router.push("/products");
    } else {
      router.push(`/products?q=${encodeURIComponent(searchInput.trim())}`);
    }
    setIsMobileSearchOpen(false);
  };

  return (
    <header className="w-full text-black bg-white fixed top-0 z-50 font-sans shadow-sm">
      <div className="bg-white border-b border-black/5 w-full">
        <Container className="flex items-center justify-between h-[72px] gap-4 mx-auto w-full relative">

          {/* Right: Logo & Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer transition-all hover:opacity-80 shrink-0"
            >
              <span className="text-2xl font-black tracking-tighter">SUPP<span className="text-[#01caa8]">SHOP</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-6 text-base font-medium">
              <Link
                href="/#bestseller"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("bestseller")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cursor-pointer hover:text-[#01caa8] transition-colors whitespace-nowrap"
              >
                الأكثر مبيعاً
              </Link>
              <Link
                href="/#newadded"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById("newadded")?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cursor-pointer hover:text-[#01caa8] transition-colors whitespace-nowrap"
              >
                مضافة حديثاً
              </Link>
              <Link
                href="/products"
                className="cursor-pointer hover:text-[#01caa8] transition-colors whitespace-nowrap"
              >
                المنتجات
              </Link>
            </nav>
          </div>

          {/* Center/Left: Search & Cart */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-[700px]">
            {/* Desktop Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 relative">
              <div className="absolute start-4 top-1/2 -translate-y-1/2 text-[#00000066]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث عن مكملك الغذائي..."
                className="w-full bg-[#F0F0F0] border-none rounded-full py-2.5 ps-12 pe-4 focus:ring-1 focus:ring-[#01caa8]/30 outline-none text-sm placeholder:text-[#00000066] transition-all"
              />
            </form>

            <div className="flex items-center gap-1 md:gap-3">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="md:hidden cursor-pointer hover:opacity-70 transition-opacity p-2 text-black"
              >
                {isMobileSearchOpen ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                )}
              </button>

              {/* Cart Icon */}
              <button
                onClick={openCart}
                className="cursor-pointer hover:opacity-70 transition-opacity p-2 relative group"
              >
                {/* Animated badge */}
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="absolute top-0 right-0 bg-[#01caa8] text-white text-[10px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-bold border border-white"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>

                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-black/5 overflow-hidden"
            >
              <Container className="py-4">
                <form onSubmit={handleSearch} className="relative">
                  <div className="absolute start-4 top-1/2 -translate-y-1/2 text-[#00000066]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="ابحث عن مكملك الغذائي..."
                    className="w-full bg-[#F0F0F0] border-none rounded-xl py-3 ps-12 pe-4 outline-none text-sm placeholder:text-[#00000066]"
                  />
                </form>
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

"use client";
import React, { useState, useEffect } from "react";
import Container from "./container";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";


const Cart=()=>(
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="2em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M23.23 8.448c-.927-.439-2.544-.439-5.697-.588c0-.08-.34-2.535-.35-2.625c-.2-1.217-.718-3.692.49-3.902c.1 0 .179.05.259.12C19.668 2.86 19.339 7.6 20.387 7.69a.34.34 0 0 0 .379-.34c0-.09-.679-4.989-1.477-6.107C18.809.615 18.27.026 17.463.186a1.84 1.84 0 0 0-1.477 1.387c-.33 1.137.18 2.864.419 3.832c.09.359.41 1.996.569 2.435c-.918 0-6.876-.18-8.572-.21c.918-2.345 1.846-3.552 1.906-5.369A1.82 1.82 0 0 0 9.649.535a2.17 2.17 0 0 0-1.936.23C6.256 1.881 5.568 4.246 5.01 5.873a10 10 0 0 0-.68 1.697h-.26C2.804 7.44.719 7.77.16 9.197a1.557 1.557 0 0 0 .738 2.095l.35.13q.037.388.12.769c.488 4.21.468 9.71 4.34 10.857c1.662.465 3.375.726 5.1.778a34.5 34.5 0 0 0 7.983-.698c3.223-1.068 3.183-4.082 3.602-6.986a21 21 0 0 0 .47-3.253a.344.344 0 0 0-.69 0a22 22 0 0 1-.538 3.104c-.499 2.774-.479 5.318-3.133 6.107c-.886.2-1.788.318-2.695.349a28 28 0 0 1-9.8-.469c-3.612-.928-3.302-7.474-4.15-10.338q1.014.193 2.045.25c.27 0 15.158.139 16.486.109a10.8 10.8 0 0 0 2.335-.26a1.876 1.876 0 0 0 .509-3.293M5.728 6.173c.56-1.157 1.657-3.732 2.685-4.47C9.44.963 9.23 2.7 9 3.697C8.681 4.976 7.593 7.291 7.713 7.69L5.01 7.58c-.07-.2.499-.938.718-1.407m16.845 4.73c-1.776.4-4.61 0-7.195 0c-8.602-.2-11.087 0-13.302-.429c-.669-.13-1.078-.19-.838-.828c.32-.828 2.145-.998 2.754-.948c2.046.13 16.755-.629 18.96.459c.43.21.36 1.577-.379 1.746" />
	<path fill="currentColor" d="M7.094 13.368c-.479-.469-1.377.788-1.437 1.996a23 23 0 0 0-.1 2.485c.2 2.993 2.775 3.782 3.344 2.145a10.8 10.8 0 0 0-.58-4.74a5.3 5.3 0 0 0-1.227-1.886m.769 6.616c-.16.05-.3-.11-.44-.23a3.1 3.1 0 0 1-.837-1.766c-.769-5.089 1.337-4.33 1.357.799c0 .04.06 1.197-.08 1.197m9.47-6.416c-1.367 1.317-1.706 3.113-1.856 4.99c-.07.997-.16 1.995.798 2.334a1.996 1.996 0 0 0 2.116-1.147c.718-1.367.449-2.794.369-4.241c-.05-1.148-.948-2.395-1.427-1.936m.499 4.58a3 3 0 0 1-.848 1.836c-.13.12-.27.28-.43.23s-.09-1.188-.08-1.278c.03-5.119 2.136-5.877 1.358-.788m-5.169-4.59c-.23-.25-1.627-.659-1.727 1.437c-.16 3.063-.489 4.42.3 5.319c.788.898 2.604.399 2.425-2.994c-.05-.878-.41-3.094-.998-3.762m-.55 5.987c-.338.1-.298-2.944-.428-4.56c-.13-1.617.688-.28.738 0q.19.989.21 1.996c.01.588-.16 2.474-.52 2.574z" />
</svg>

)


const Search=()=>(
  <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="2em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="M16.195 8.05a5.74 5.74 0 0 0-1.248-2.655c-.19-.23-.39-.5-.62-.73a2.1 2.1 0 0 0-.578-.429a.34.34 0 0 0-.44.12h-.13a36 36 0 0 0-2.915 1.858c-.47.329-.94.659-1.398.998L7.527 8.341c-.689.609-1.418 1.228-2.087 1.897c-.31.31-.599.629-.878.998a4.2 4.2 0 0 1-.14-1.647a8.3 8.3 0 0 1 2.277-4.424a3.7 3.7 0 0 1 1.138-.759a5.4 5.4 0 0 1 1.867-.33a12.8 12.8 0 0 1 2.996.35a.3.3 0 0 0 .31-.22a.31.31 0 0 0-.22-.37a14.2 14.2 0 0 0-3.106-.478a6.1 6.1 0 0 0-2.147.31c-2.127.748-3.924 3.794-4.204 5.79a5.8 5.8 0 0 0 .49 3.107A6.36 6.36 0 0 0 5.78 14.98a4.8 4.8 0 0 0 1.588.75a7 7 0 0 0 1.647.249a7.44 7.44 0 0 0 4.364-1.308a6.47 6.47 0 0 0 2.627-3.685a7 7 0 0 0 .19-2.936M4.881 12.046a1 1 0 0 1-.07-.17q.57-.549 1.209-1.018c.729-.58 1.497-1.098 2.236-1.628s1.259-.998 1.868-1.488a78 78 0 0 0 1.827-1.527c.62-.53 1.059-.84 1.598-1.219q.127.096.24.21c.2.22.38.48.549.699c.48.582.82 1.265.999 1.997c-1.06.65-2.138 1.238-3.196 1.877q-1.177.696-2.277 1.508A21 21 0 0 0 6.7 14.282l-.22-.13a5.26 5.26 0 0 1-1.598-2.067zm10.266-1.348a5.48 5.48 0 0 1-2.327 3.086a6.4 6.4 0 0 1-3.745.998a5.5 5.5 0 0 1-1.398-.2c-.13 0-.25-.09-.37-.13c.45-.389.9-.748 1.369-1.098c.47-.35.998-.659 1.468-.998l1.478-.999q1.937-1.328 3.804-2.736a6.1 6.1 0 0 1-.28 2.117z" />
	<path fill="currentColor" d="M23.245 20.553a3.6 3.6 0 0 0-.18-.639a4.4 4.4 0 0 0-.539-.998a11.5 11.5 0 0 0-.998-1.249a17 17 0 0 0-1.698-1.607c-.829-.68-1.698-1.298-2.576-1.997q.395-.76.649-1.578q.373-1.228.559-2.497c.157-.812.23-1.639.22-2.466a5.6 5.6 0 0 0-.29-1.698a12 12 0 0 0-.57-1.448a5.2 5.2 0 0 0-.568-.939a6.7 6.7 0 0 0-1.318-1.288c-.736-.52-1.53-.953-2.367-1.288a13 13 0 0 0-1.797-.629a7.2 7.2 0 0 0-1.998-.23a8.6 8.6 0 0 0-2.426.49C6.58.77 5.84 1.122 5.14 1.54c-.6.34-1.166.738-1.688 1.188C1.216 4.696.757 8.99.727 9.458a8.4 8.4 0 0 0 .54 3.736q.18.452.419.878c.23.4.489.79.759 1.179a9 9 0 0 0 1.837 2.047a5.4 5.4 0 0 0 1.668.899q1.037.338 2.117.499c.491.082.99.112 1.488.09a9.2 9.2 0 0 0 2.276-.44a14 14 0 0 0 2.078-.918q.202.24.379.499c.43.66.769 1.368 1.168 1.997q.422.652.919 1.248q.47.586.999 1.119a6.53 6.53 0 0 0 3.505 1.678a2 2 0 0 0 2.326-1.658q.06-.262.09-.53q.015-.264 0-.529a4 4 0 0 0-.05-.699m-1.158 1.468a1 1 0 0 1-1.139.79a5.4 5.4 0 0 1-2.836-1.25a12 12 0 0 1-.998-.998a10 10 0 0 1-.919-1.088c-.44-.62-.839-1.308-1.298-1.937a6 6 0 0 0-.39-.46l.13-.09q.333-.238.63-.519a.36.36 0 0 0 0-.49a.34.34 0 0 0-.48 0a4 4 0 0 1-.549.43a6 6 0 0 1-.6.37a15 15 0 0 1-1.996.838a8.3 8.3 0 0 1-2.137.36a6.4 6.4 0 0 1-1.638-.17a11 11 0 0 1-1.638-.45a4.7 4.7 0 0 1-1.677-1.048a8.8 8.8 0 0 1-1.298-1.607c-.23-.36-.47-.72-.68-1.119q-.195-.37-.349-.759a7.4 7.4 0 0 1-.41-3.285c.46-5.293 3.146-6.55 3.915-6.99A11.3 11.3 0 0 1 7.727 1.6a7.2 7.2 0 0 1 2.107-.45a6.2 6.2 0 0 1 1.668.18a12 12 0 0 1 1.658.53q.962.371 1.847.898a5.5 5.5 0 0 1 1.498 1.239q.285.354.49.759q.33.643.568 1.328c.164.463.261.947.29 1.438c.024.778-.026 1.557-.15 2.326a18 18 0 0 1-.37 1.998a9 9 0 0 1-.698 1.907q-.242.523-.57.998a6.3 6.3 0 0 1-.719.85a.304.304 0 0 0 .42.439q.44-.428.809-.919c.11-.15.2-.31.3-.47c.808.68 1.617 1.319 2.386 1.998q.815.744 1.518 1.598q.47.562.869 1.178q.238.381.379.809q.075.245.12.499q.015.24 0 .48z" />
</svg>

)


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
    <header className="w-full  text-black rounded-b-2xl md:rounded-none bg-white fixed top-0 z-50 font-sans shadow-sm">
      <div className="bg-white rounded-b-2xl md:rounded-none border-b border-black/5 w-full">
        <Container className="flex items-center justify-between h-[72px] gap-4 mx-auto w-full relative">

          {/* Right: Logo & Nav */}
          <div className="flex items-center gap-4 md:gap-8">
            {/* Logo */}
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer transition-all hover:opacity-80 shrink-0"
            >
              <Image width={150} height={150} src="/Logo1.png" alt="Logo" width={100} height={100} />
              {/* <span className="text-2xl font-black tracking-tighter">SUPP<span className="text-[#01caa8]">SHOP</span></span> */}
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
                className="cursor-pointer hover:text-[#666] transition-colors whitespace-nowrap"
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
                className="cursor-pointer hover:text-[#666] transition-colors whitespace-nowrap"
              >
                مضافة حديثاً
              </Link>
              <Link
                href="/products"
                className="cursor-pointer hover:text-[#666] transition-colors whitespace-nowrap"
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
               <Search />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="ابحث عن مكملك الغذائي..."
                className="w-full bg-[#F0F0F0] border-none rounded-full py-2.5 ps-12 pe-4 focus:ring-1 focus:ring-[#555]/30 outline-none text-base placeholder:text-[#00000066] transition-all"
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
                      className="absolute top-0 right-0 bg-[#0f0f0f] text-white text-[10px] min-w-[16px] h-4 px-0.5 rounded-full flex items-center justify-center font-bold border border-white"
                    >
                      {cartCount > 99 ? "99+" : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                   <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg> */}

                <Cart/>
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
                    className="w-full bg-[#F0F0F0] border-none rounded-xl py-3 ps-12 pe-4 outline-none text-base placeholder:text-[#00000066]"
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

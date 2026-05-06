"use client";
import Image from "next/image";
import Container from "./container";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import CartDrawer from "./cart/cart-drawer";

const Header = () => {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className="w-full text-black bg-white fixed top-0 z-50 font-sans">
      <div className="bg-white border-b border-black/5 w-full">
        <Container className="flex items-center justify-between h-[72px] gap-4 mx-auto w-full ">
          {/* Right Part: Logo & Navigation (RTL) */}
          <div className="flex items-center gap-8">
            <div
              onClick={() => router.push("/")}
              className="flex items-center cursor-pointer transition-all hover:opacity-80 shrink-0"
            >
              {/* <Image
                width={120}
                height={40}
                src="/logo3.png"
                alt="logo"
                className="h-10 w-auto object-contain"
              /> */}

              <span className="text-2xl font-black">LOGO</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-base font-medium">
              <Link
                href="/#bestseller"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document
                      .getElementById("bestseller")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cursor-pointer hover:text-gray-400 transition-colors whitespace-nowrap"
              >
                الاكثر مبيعا
              </Link>
              <Link
                href="/#newadded"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    e.preventDefault();
                    document
                      .getElementById("newadded")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="cursor-pointer hover:text-gray-400 transition-colors whitespace-nowrap"
              >
                مضافة حديثا
              </Link>
              <Link
                href="/products"
                className="cursor-pointer hover:text-gray-400 transition-colors whitespace-nowrap"
              >
                المنتجات
              </Link>
            </nav>
          </div>

          {/* Left Part: Search & Actions (RTL) */}
          <div className="flex items-center gap-4 flex-1 justify-end max-w-[700px]">
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 relative">
              <div className="absolute start-4 top-1/2 -translate-y-1/2 text-[#00000066]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ابحث ..."
                className="w-full bg-[#F0F0F0] border-none rounded-full py-2.5 ps-12 pe-4 focus:ring-1 focus:ring-gray-300 outline-none text-sm placeholder:text-[#00000066]"
              />
            </div>

            {/* Cart Icon */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCartOpen(true)}
                className="cursor-pointer hover:opacity-70 transition-opacity p-2 relative group"
              >
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white group-hover:scale-110 transition-transform">
                  3
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
};

export default Header;

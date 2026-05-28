"use client";
import Container from "@/components/container";
import { useState, useEffect, useCallback, useTransition, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import FilterContent, { FilterIcon } from "./filter-content";
import MobileFilterDrawer from "./mobile-filter-drawer";
import ProductDrawer from "@/components/product/product-drawer";
import { getShopProducts } from "./action";
import { useCart } from "@/context/cart-context";

const Left = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Right = () => (
  <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.75005 0.75C0.75005 0.75 6.75 5.1689 6.75 6.75C6.75 8.3312 0.75 12.75 0.75 12.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Skeleton card ──────────────────────────────────────────
const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="aspect-square bg-gray-100 rounded-[24px] mb-4" />
    <div className="h-4 bg-gray-100 rounded-full w-3/4 mb-2" />
    <div className="h-4 bg-gray-100 rounded-full w-1/2" />
  </div>
);

const ProductsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const searchQuery = searchParams.get("q") || "";

  // ── Filter state (controlled) ──────────────────────────
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedCategory, setSelectedCategory] = useState(null); // id or null
  const [page, setPage] = useState(1);

  // ── Products state ──────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // ── Drawer state ────────────────────────────────────────
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { addItem } = useCart();

  // ── Fetch products ───────────────────────────────────────
  const fetchProducts = useCallback(async (opts = {}) => {
    setLoading(true);
    // نستخدم 'categoryId' in opts للتمييز بين null المقصود وغياب القيمة
    const categoryId = 'categoryId' in opts ? opts.categoryId : selectedCategory;
    const res = await getShopProducts({
      categoryId,
      minPrice: opts.minPrice ?? (minPrice > 0 ? minPrice : undefined),
      maxPrice: opts.maxPrice ?? (maxPrice < 200000 ? maxPrice : undefined),
      page: opts.page ?? page,
      search: searchQuery || undefined,
    });
    if (res.success) {
      setProducts(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }, [selectedCategory, minPrice, maxPrice, page, searchQuery]);

  useEffect(() => { fetchProducts(); }, [searchQuery, fetchProducts]);

  // ── Apply filter ─────────────────────────────────────────
  const applyFilter = () => {
    setPage(1);
    startTransition(() => {
      fetchProducts({ page: 1 });
    });
  };

  // ── Category click ───────────────────────────────────────
  const handleCategoryChange = (id) => {
    // id=null يعني "الكل" — إذا ضغط نفس الفئة مرتين يرجع للكل
    const next = (id !== null && id === selectedCategory) ? null : id;
    setSelectedCategory(next);
    setPage(1);
    startTransition(() => {
      fetchProducts({ categoryId: next, page: 1 });
    });
  };

  // ── Page change ──────────────────────────────────────────
  const handlePageChange = (p) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
    startTransition(() => {
      fetchProducts({ page: p });
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Quick add (from card hover button) ───────────────────
  const handleQuickAdd = (e, product) => {
    e.stopPropagation();
    const flavors = Array.isArray(product.flavors) ? product.flavors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    addItem(product, {
      flavor: flavors[0] ?? null,
      size: sizes[0] ?? null,
      quantity: 1,
    });
  };

  // ── Open product drawer ───────────────────────────────────
  const openProductDrawer = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  // ── Pagination pages array ────────────────────────────────
  const getPagesArray = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="w-full text-black py-20 min-h-screen flex justify-center bg-white" dir="rtl">
      <Container className="flex flex-col pt-3 px-4 md:px-0">

        {/* Breadcrumb */}
        <div className="flex items-center justify-start gap-2 mb-10">
          <p className="font-bold text-xl cursor-pointer hover:text-black/60 transition-colors" onClick={() => router.push("/")}>
            الرئيسية
          </p>
          <Left />
          <p className="font-black text-xl">المنتجات</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 w-full">

          {/* ── Desktop Filter Sidebar ─────────────────────── */}
          <div className="hidden lg:flex flex-col sticky top-24 w-[28%] lg:w-[25%] h-fit border p-6 border-[#88888833] rounded-[24px] bg-white shadow-sm">
            <FilterContent
              minPrice={minPrice}
              maxPrice={maxPrice}
              handleMinChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))}
              handleMaxChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onApply={applyFilter}
            />
          </div>

          {/* ── Products grid ──────────────────────────────── */}
          <div className="flex flex-col flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black">
                {searchQuery 
                  ? `نتائج البحث عن: "${searchQuery}"` 
                  : (selectedCategory ? "الفئة المختارة" : "الكل")}
              </h2>
              <div className="flex items-center gap-4">
                <p className="hidden md:block text-[#999] text-sm">
                  {loading ? "جاري التحميل..." : `${total} منتج`}
                </p>
                <MobileFilterDrawer
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  handleMinChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))}
                  handleMaxChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  onApply={applyFilter}
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-10">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                : products.map((product) => {
                  const image = product.productImages?.[0]?.image;
                  const endPrice = Number(product.endPrice);
                  const price = Number(product.price);
                  const hasDiscount = price > endPrice;
                  const discountPct = hasDiscount ? Math.round((1 - endPrice / price) * 100) : 0;
                  const isAvailable = product.isAvailable;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer active:scale-[0.98] transition-all duration-200"
                    >
                      {/* Image container */}
                      <div
                        onClick={() => openProductDrawer(product)}
                        className={`relative aspect-square bg-[#F0EEED] rounded-[24px] overflow-hidden mb-4 shadow-sm transition-shadow duration-300 ${isAvailable ? 'group-hover:shadow-md' : 'opacity-80'}`}
                      >
                        {/* Discount badge */}
                        {hasDiscount && isAvailable && (
                          <span className="absolute top-4 left-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                            -{discountPct}%
                          </span>
                        )}

                        {/* Out of stock overlay */}
                        {!isAvailable && (
                          <>
                            {/* Diagonal stripes */}
                            <div
                              className="absolute inset-0 z-20 pointer-events-none"
                              style={{
                                background: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 2px, transparent 2px, transparent 12px)',
                              }}
                            />
                            {/* Badge */}
                            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
                              <span className="bg-black/80 text-white text-xs font-black px-4 py-2 rounded-full tracking-wider backdrop-blur-sm">
                                غير متوفر
                              </span>
                            </div>
                          </>
                        )}

                        {image ? (
                          <img
                            src={image}
                            alt={product.name}
                            className={`object-cover w-full h-full transition-transform duration-500 ${isAvailable ? 'group-hover:scale-105' : 'grayscale-[30%]'}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-5-5L5 21" /></svg>
                          </div>
                        )}

                        {/* Shimmer (available only) */}
                        {isAvailable && (
                          <motion.div
                            style={{
                              background: "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)",
                              backgroundSize: "200% 100%",
                            }}
                            animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                            className="absolute inset-0 z-20 pointer-events-none"
                          />
                        )}

                        {/* Quick Add hover button */}
                        <div className="absolute inset-0 bg-black/5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-end justify-center p-4 z-30">
                          {isAvailable ? (
                            <button
                              onClick={(e) => handleQuickAdd(e, product)}
                              className="w-full cursor-pointer active:scale-[0.98] bg-white/90 backdrop-blur-sm text-black py-2 rounded-xl text-xs font-bold transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300"
                            >
                              إضافة للسلة
                            </button>
                          ) : (
                            <div className="w-full bg-black/60 backdrop-blur-sm text-white/70 py-2 rounded-xl text-xs font-bold text-center transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300 cursor-not-allowed">
                              نفذ من المخزون
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="text-right space-y-1.5 px-1" onClick={() => openProductDrawer(product)}>
                        <h3 className="text-base md:text-lg font-bold text-black truncate group-hover:text-black/70 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-start gap-2 font-black">
                          {hasDiscount ? (
                            <>
                              <span className="text-lg text-black">{endPrice.toLocaleString()} د.ع</span>
                              <span className="text-[#999] line-through text-xs font-medium">{price.toLocaleString()} د.ع</span>
                            </>
                          ) : (
                            <span className="text-lg text-black">{endPrice.toLocaleString()} د.ع</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* Empty state */}
            {!loading && products.length === 0 && (
              <div className="py-24 text-center flex flex-col items-center gap-4 text-gray-400">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <p className="font-bold text-lg">
                  {searchQuery 
                    ? `لا توجد منتجات تطابق البحث: "${searchQuery}"` 
                    : "لا توجد منتجات تطابق الفلتر"}
                </p>
                <button onClick={() => { setSelectedCategory(null); setMinPrice(0); setMaxPrice(200000); fetchProducts({ categoryId: null, minPrice: undefined, maxPrice: undefined, page: 1 }); }} className="text-black underline font-bold text-sm">
                  إعادة تعيين الفلتر
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10 md:mt-16 flex items-center justify-between border-t border-[#88888822] pt-6 md:pt-8">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl border border-[#88888833] text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all group cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="group-hover:invert transition-all text-black"><Right /></div>
                  <span className="hidden md:block">السابق</span>
                </button>

                <div className="flex items-center gap-1 sm:gap-2">
                  {getPagesArray().map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => p !== "..." && handlePageChange(p)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                        p === page
                          ? "bg-black text-white"
                          : p === "..."
                            ? "cursor-default text-[#999]"
                            : "hover:bg-[#f5f5f5] text-[#555]"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-2 rounded-xl border border-[#88888833] text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all group cursor-pointer active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="hidden md:block">التالي</span>
                  <div className="rotate-180 group-hover:invert transition-all text-black"><Right /></div>
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      {/* Product Drawer */}
      <ProductDrawer
        product={selectedProduct}
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
      />
    </div>
  );
};

export default function Allproducts() {
  return (
    <Suspense fallback={<div className="w-full text-black py-20 min-h-screen flex justify-center bg-white" dir="rtl"><Container className="flex justify-center pt-24"><div className="animate-pulse flex items-center gap-2 font-bold text-xl">جاري التحميل...</div></Container></div>}>
      <ProductsContent />
    </Suspense>
  );
}

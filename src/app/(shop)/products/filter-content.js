"use client";
import React, { useState, useEffect, useRef } from "react";
import { getShopCategories } from "./action";

export const FilterIcon = ({color="currentColor"}) => (
<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill={color} d="M3.63 7.09V5.662c0-.442 0-.983-.059-1.425c-.089-1.151-.236-2.243-.364-3.344a.344.344 0 1 0-.688.02c-.06 1.11-.148 2.242-.187 3.324v1.416c0 .432.069.983.069 1.416c0 2.173.983 2.203 1.16 1.622A9 9 0 0 0 3.63 7.09m7.789.265c-.08.413-.07 3.933-.148 5.989a124 124 0 0 0-.108 4.69c-.01 1.564 0 3.384.137 5.075a.394.394 0 0 0 .394.383a.404.404 0 0 0 .383-.403c0-1.967.207-4.012.325-6.018c.088-1.338.157-2.695.157-4.042c-.03-1.926-.16-3.85-.393-5.763c-.069-.334-.688-.265-.747.089m-8.055 10.66a.344.344 0 0 0-.334-.344a.344.344 0 0 0-.344.344c-.098.649-.226 1.269-.295 1.918v1.652c.059.639.157 1.268.226 1.966a.393.393 0 0 0 .777 0c.069-.649.177-1.278.226-1.966v-.826q.03-.413 0-.826c-.03-.65-.157-1.27-.256-1.918M20.692 6.608V5.19c0-.432 0-.983-.06-1.425c-.097-1.112-.245-2.203-.373-3.305a.344.344 0 0 0-.688 0c-.06 1.112-.158 2.203-.187 3.314V5.2c0 .443.069.984.069 1.416c0 2.174.983 2.203 1.15 1.623c.087-.54.116-1.087.089-1.632m-17.2 3.098a2.5 2.5 0 0 0-.855.05C.542 10.157-.235 11.72.06 13.097c.787 3.678 8.005 3.461 6.727-.915a3.6 3.6 0 0 0-3.295-2.478m-2.31 3.216c-.128-.983.481-1.878 1.966-1.967a2.45 2.45 0 0 1 2.626 1.574c1.12 3.137-4.248 3.284-4.593.393M11.3.619C8.892.884 8.046 2.585 8.35 4.07a3.11 3.11 0 0 0 2.95 2.42c2.026.157 4.632-.236 3.728-3.334A3.65 3.65 0 0 0 11.3.619M12 5.84a2.31 2.31 0 0 1-2.51-1.966c-.128-.984.482-1.879 1.967-1.967a2.47 2.47 0 0 1 2.626 1.583c.914 2.616-2.085 2.34-2.085 2.35m8.556 3.423a2.8 2.8 0 0 0-.855.059c-2.095.403-2.872 1.967-2.577 3.343c.787 3.678 8.005 3.462 6.727-.914a3.61 3.61 0 0 0-3.295-2.488m-2.35 3.215c-.128-.983.482-1.878 1.967-1.966a2.47 2.47 0 0 1 2.645 1.583c1.14 3.137-4.229 3.284-4.612.383m2.222 5.104a.343.343 0 0 0-.334-.344a.344.344 0 0 0-.344.344c-.098.64-.226 1.269-.295 1.918v1.642c.059.65.157 1.278.226 1.967a.393.393 0 0 0 .777 0c.069-.65.177-1.279.226-1.967v-.816a6 6 0 0 0 0-.826c-.03-.61-.157-1.269-.256-1.918" />
</svg>

);

const FilterContent = ({
  minPrice,
  maxPrice,
  handleMinChange,
  handleMaxChange,
  selectedCategory,
  onCategoryChange,
  onApply,
}) => {
  const [categories, setCategories] = useState([]);
  const [showTopGradient, setShowTopGradient] = useState(false);
  const [showBottomGradient, setShowBottomGradient] = useState(false);
  const scrollRef = useRef(null);
  const MAX = 200000;

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      setShowTopGradient(scrollTop > 2);
      setShowBottomGradient(scrollHeight > clientHeight && scrollTop + clientHeight < scrollHeight - 5);
    }
  };

  useEffect(() => {
    getShopCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    return () => clearTimeout(timer);
  }, [categories]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      checkScroll();
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [categories]);

  const handleScroll = () => {
    checkScroll();
  };

  const allCount = categories.reduce((s, c) => s + (c._count?.products ?? 0), 0);

  return (
    <>
      {/* Header */}
      <div className="flex justify-between border-b border-[#88888833] pb-4 mb-4">
        <p className="font-bold text-black text-lg">تصنيف حسب</p>
        <FilterIcon color="#000000" />
      </div>

      {/* Categories */}
      <div className="relative">
        {/* Top gradient overlay */}
        <div 
          className={`absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            showTopGradient ? "opacity-100" : "opacity-0"
          }`} 
        />

        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex flex-col max-h-[300px] overflow-y-auto scrollbar-hide gap-3 pb-6"
        >
          {/* "الكل" option */}
          <div
            onClick={() => onCategoryChange?.(null)}
            className="flex justify-between items-center group cursor-pointer py-1"
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 border rounded-[6px] transition-all flex items-center justify-center ${selectedCategory === null ? "border-black" : "border-[#88888855] group-hover:border-black"}`}>
                <div className={`w-2.5 h-2.5 bg-black rounded-[2px] transition-opacity ${selectedCategory === null ? "opacity-100" : "opacity-0 group-hover:opacity-20"}`} />
              </div>
              <span className="text-black font-medium">الكل</span>
            </div>
            <span className="text-xs text-black bg-[#f5f5f5] px-4 py-2 rounded-full font-bold">{allCount}</span>
          </div>

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onCategoryChange?.(cat.id)}
              className="flex justify-between items-center group cursor-pointer py-1"
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 border rounded-[6px] transition-all flex items-center justify-center ${selectedCategory === cat.id ? "border-black" : "border-[#88888855] group-hover:border-black"}`}>
                  <div className={`w-2.5 h-2.5 bg-black rounded-[2px] transition-opacity ${selectedCategory === cat.id ? "opacity-100" : "opacity-0 group-hover:opacity-20"}`} />
                </div>
                <span className="text-black group-hover:text-black transition-colors font-medium">{cat.name}</span>
              </div>
              <span className="text-xs text-black bg-[#f5f5f5] px-4 py-2 rounded-full font-bold">
                {cat._count?.products ?? 0}
              </span>
            </div>
          ))}

          {/* Skeleton if loading */}
          {categories.length === 0 && (
            <div className="flex flex-col gap-3 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-gray-100 rounded-[6px]" />
                    <div className="h-4 w-24 bg-gray-100 rounded-full" />
                  </div>
                  <div className="h-6 w-10 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom gradient overlay */}
        <div 
          className={`absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            showBottomGradient ? "opacity-100" : "opacity-0"
          }`} 
        />
      </div>

      {/* Price Range */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <p className="font-bold text-lg text-black">حسب السعر</p>
        </div>

        <div className="relative w-full h-2 bg-[#F1F1F1] rounded-full mb-8">
          <div
            className="absolute h-full bg-black rounded-full"
            style={{
              left: `${((MAX - maxPrice) / MAX) * 100}%`,
              right: `${(minPrice / MAX) * 100}%`,
            }}
          />
          <input
            type="range" min="0" max={MAX} step="1000"
            value={minPrice} onChange={handleMinChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
          />
          <input
            type="range" min="0" max={MAX} step="1000"
            value={maxPrice} onChange={handleMaxChange}
            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer z-20 pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <div className="flex flex-col">
              <span className="text-black text-[10px] mb-1">من</span>
              <span className="bg-[#f9f9f9] border border-[#eee] px-3 py-2 rounded-xl text-black">
                {minPrice.toLocaleString()} د.ع
              </span>
            </div>
            <div className="w-4 h-[1px] bg-[#ddd] mt-4" />
            <div className="flex flex-col items-end">
              <span className="text-black text-[10px] mb-1">إلى</span>
              <span className="bg-[#f9f9f9] border border-[#eee] px-3 py-2 rounded-xl text-black">
                {maxPrice.toLocaleString()} د.ع
              </span>
            </div>
          </div>

          <button
            onClick={onApply}
            className="w-full mt-4 cursor-pointer bg-black text-white py-4 rounded-[20px] font-bold text-sm hover:bg-black/80 transition-all active:scale-[0.98]"
          >
            تطبيق الفلتر
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterContent;
export { FilterIcon as default_FilterIcon };

"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import styles from "./drawer.module.css";
import FilterContent, { FilterIcon } from "./filter-content";

const snapPoints = [0.45, 0.85, 1];

export default function MobileFilterDrawer({
  minPrice,
  maxPrice,
  handleMinChange,
  handleMaxChange,
  selectedCategory,
  onCategoryChange,
  onApply,
}) {
  return (
    <Drawer.Root snapPoints={snapPoints} dismissible={true}>
      <Drawer.Trigger className="flex lg:hidden items-center gap-2 bg-[#F0F0F0] px-5 py-2.5 rounded-full font-bold text-sm hover:bg-[#e5e5e5] transition-all cursor-pointer">
        فلترة <FilterIcon  color="#000000"/>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Viewport className={styles.Viewport}>
          <Drawer.Popup className={styles.Popup} dir="rtl">
            <div className={styles.DragArea}>
              <div className={styles.Handle} />
              <Drawer.Title className={styles.Title}>الفلاتر</Drawer.Title>
            </div>
            <Drawer.Content className={styles.Scroll}>
              <div className={styles.Content}>
                <FilterContent
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  handleMinChange={handleMinChange}
                  handleMaxChange={handleMaxChange}
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                  onApply={onApply}
                />
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

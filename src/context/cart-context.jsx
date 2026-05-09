"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [notification, setNotification] = useState({ show: false, name: "", message: "" });

  // إضافة منتج للسلة
  const addItem = useCallback((product, { flavor, size, quantity = 1, isUpdate = false } = {}) => {
    // مفتاح فريد: id + flavor + size
    const key = `${product.id}__${flavor?.name ?? ""}__${size?.name ?? ""}`;
    let alreadyExists = false;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        alreadyExists = true;
        if (isUpdate) {
            // تحديث للكمية المحددة بالضبط (للدروّر)
            return prev.map((i) =>
              i.key === key ? { ...i, quantity: quantity } : i
            );
        }
        // للمختصر (Quick Add) - لا نفعل شيئاً إذا كان موجوداً
        return prev;
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: Number(product.endPrice ?? product.price) + (Number(size?.price) || 0),
          image: product.productImages?.[0]?.image ?? product.image ?? "",
          flavor: flavor?.name ?? null,
          size: size?.name ?? null,
          quantity,
        },
      ];
    });

    // إظهار التنبيه
    if (alreadyExists && !isUpdate) {
        setNotification({ show: true, name: product.name, message: "هذا المنتج موجود بالفعل في السلة" });
    } else {
        setNotification({ 
            show: true, 
            name: product.name, 
            message: isUpdate ? "تم تحديث الكمية في السلة" : "تمت الإضافة بنجاح للسلة" 
        });
    }
    
    setTimeout(() => setNotification({ show: false, name: "", message: "" }), 3000);
  }, []);

  // دالة لمعرفة الكمية الحالية لمنتج معين
  const getItemQuantity = useCallback((productId, flavorName, sizeName) => {
    const key = `${productId}__${flavorName ?? ""}__${sizeName ?? ""}`;
    const item = items.find(i => i.key === key);
    return item ? item.quantity : 1;
  }, [items]);

  // تحديث الكمية
  const updateQuantity = useCallback((key, delta) => {
    setItems((prev) =>
      prev.map((i) =>
        i.key === key ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
      )
    );
  }, []);

  // حذف عنصر
  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  // مسح السلة
  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const count = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ 
        items, 
        open, 
        setOpen, 
        addItem, 
        updateQuantity, 
        removeItem, 
        clearCart, 
        total, 
        count,
        notification,
        setNotification,
        getItemQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

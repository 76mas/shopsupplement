"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [notification, setNotification] = useState({ show: false, name: "" });

  // إضافة منتج للسلة
  const addItem = useCallback((product, { flavor, size, quantity = 1 } = {}) => {
    // مفتاح فريد: id + flavor + size
    const key = `${product.id}__${flavor?.name ?? ""}__${size?.name ?? ""}`;

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: i.quantity + quantity } : i
        );
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
    setNotification({ show: true, name: product.name });
    setTimeout(() => setNotification({ show: false, name: "" }), 3000);
  }, []);

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
        setNotification
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

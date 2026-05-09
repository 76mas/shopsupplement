import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/context/cart-context";
import CartDrawer from "@/components/cart/cart-drawer";
import CartNotification from "@/components/cart/cart-notification";
import { Suspense } from "react";

export default function ShopLayout({ children }) {
  return (
    <CartProvider>
      <div className="min-h-full flex flex-col">
        <Suspense fallback={<div className="h-20 bg-white" />}>
          <Header />
        </Suspense>
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <CartNotification />
      </div>
    </CartProvider>
  );
}

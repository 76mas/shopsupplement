import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ShopLayout({ children }) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

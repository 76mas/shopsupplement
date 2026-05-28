import Container from "@/components/container";
import MainSection from "@/components/sections/home/main";
import BestSeller from "@/components/sections/home/bestseller";  
import NewAdded from "@/components/sections/home/newadded";
import Categories from "@/components/sections/home/categories"; 
import CustomerComments from "@/components/sections/home/custmorcomints";

import prisma from "@/lib/prisma";




export default async function Home() {
  const banners = await prisma.banner.findMany();
  const firstBanner = banners.find(b => b.type === "FIRST");
  const secondBanner = banners.find(b => b.type === "SECOND");

  const serializeProduct = (p) => ({
    ...p,
    price: Number(p.price),
    endPrice: Number(p.endPrice),
    createdAt: p.createdAt?.toISOString?.() ?? String(p.createdAt),
    updatedAt: p.updatedAt?.toISOString?.() ?? String(p.updatedAt),
    deleteAt: p.deleteAt ? (p.deleteAt?.toISOString?.() ?? String(p.deleteAt)) : null,
    image: p.productImages?.[0]?.image || "",
    images: p.productImages?.map(i => i.image) || [],
    discountPrice: p.endPrice < p.price ? Number(p.endPrice) : null,
    discount: p.endPrice < p.price ? `-${Math.round(((Number(p.price) - Number(p.endPrice)) / Number(p.price)) * 100)}%` : null
  });

  let newAddedProducts = [];
  if (firstBanner?.items?.length) {
    const prods = await prisma.product.findMany({
      where: { id: { in: firstBanner.items }, deleteAt: null },
      include: { productImages: true, category: true }
    });
    newAddedProducts = firstBanner.items.map(id => prods.find(p => p.id === id)).filter(Boolean).map(serializeProduct);
  }

  let bestSellerProducts = [];
  if (secondBanner?.items?.length) {
    const prods = await prisma.product.findMany({
      where: { id: { in: secondBanner.items }, deleteAt: null },
      include: { productImages: true, category: true }
    });
    bestSellerProducts = secondBanner.items.map(id => prods.find(p => p.id === id)).filter(Boolean).map(serializeProduct);
  }

  return (
    <div className="flex flex-col justify-center bg-white ">
      <MainSection />
      <BestSeller fetchedProducts={bestSellerProducts} />
      <NewAdded fetchedProducts={newAddedProducts} />
      {/* <Categories /> */}
      <CustomerComments />
    </div>
  );
}

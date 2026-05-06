"use client";
import Image from "next/image";
import Container from "@/components/container";
import { useRouter } from "next/navigation";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useState } from "react";
import ProductDrawer from "@/components/product/product-drawer";
import { motion } from "motion/react";
// مصفوفة المنتجات (المضافة حديثاً)
const products = [

  {
    id: 5,
    name: "BCAA Energy",
    price: 40000,
    discountPrice: 32000,
    discount: "-20%",
    image: "https://3km3cceozg.ucarecd.net/27771e0a-c726-4e0b-b0e1-e5aa9f66c443/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/27771e0a-c726-4e0b-b0e1-e5aa9f66c443/-/preview/1000x1000/",
    ],
    description: "الأحماض الأمينية المتشعبة مع طاقة مضافة. يساعد في الحفاظ على العضلات أثناء التمرين ويوفر نشاطاً مستمراً.",
    flavors: [
      { name: "ليمون", color: "#CCFF00" },
      { name: "توت بري", color: "#8A2BE2" }
    ],
    sizes: [
      { name: "30 حصة", price_suffix: "" }
    ]
  },

    {
    id: 1,
    name: "Whey Gold Standard",
    price: 95000,
    discountPrice: 80000,
    discount: "-15%",
    image: "https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/",
    ],
    description: "البروتين الأشهر عالمياً، يحتوي على عزل بروتين مصل اللبن النقي لدعم الاستشفاء العضلي وبناء الكتلة العضلية الصافية.",
    flavors: [
      { name: "شوكولاتة غنية", color: "#4B2C20" },
      { name: "فانيليا", color: "#F3E5AB" }
    ],
    sizes: [
      { name: "2.27 كجم (5 باوند)", price_suffix: "" },
      { name: "900 غرام", price_suffix: "- 40,000 د.ع" }
    ]
  },
  {
    id: 2,
    name: "C4 Original Pre-Workout",
    price: 45000,
    image: "https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/",
    ],
    description: "انفجار من الطاقة والتركيز قبل التمرين. يحتوي على الكافيين وبيتا ألانين لزيادة قوة التحمل والأداء البدني العالي.",
    flavors: [
      { name: "فواكه مشكلة", color: "#FF4D4D" },
      { name: "توت أزرق", color: "#1E90FF" }
    ],
    sizes: [
      { name: "30 حصة", price_suffix: "" }
    ]
  },
  {
    id: 3,
    name: "Creatine Monohydrate",
    price: 35000,
    discountPrice: 28000,
    discount: "-20%",
    image: "https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/a744ef8d-4021-4d9e-aeeb-4b848423427a/-/preview/1000x1000/",
    ],
    description: "الكرياتين النقي لزيادة القوة العضلية وحجم الخلايا. مكمل أساسي لكل رياضي يسعى لزيادة أوزانه وتحسين أدائه الانفجاري.",
    flavors: [
      { name: "بدون نكهة", color: "#FFFFFF" }
    ],
    sizes: [
      { name: "300 غرام", price_suffix: "" },
      { name: "500 غرام", price_suffix: "+ 15,000 د.ع" }
    ]
  },
  {
    id: 4,
    name: "Hydro Whey Protein",
    price: 110000,
    image: "https://3km3cceozg.ucarecd.net/9f4cdacc-cb08-4d36-b675-841dbc65f346/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/9f4cdacc-cb08-4d36-b675-841dbc65f346/-/preview/1000x1000/",
    ],
    description: "أسرع أنواع البروتين امتصاصاً على الإطلاق. مثالي للاستخدام المباشر بعد التمرين لتغذية العضلات ومنع الهدم العضلي.",
    flavors: [
      { name: "شوكولاتة", color: "#4B2C20" }
    ],
    sizes: [
      { name: "1.6 كجم", price_suffix: "" }
    ]
  },
  {
    id: 6,
    name: "Mass Tech Extreme 2000",
    price: 85000,
    image: "https://3km3cceozg.ucarecd.net/c976d250-17c1-4537-b9f0-26cc8ec78406/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/c976d250-17c1-4537-b9f0-26cc8ec78406/-/preview/1000x1000/",
    ],
    description: "الخيار الأول للضخامة وزيادة الوزن. يحتوي على كمية هائلة من الكربوهيدرات والبروتين والسعرات الحرارية لكسر ثبات الوزن.",
    flavors: [
      { name: "شوكولاتة غنية", color: "#4B2C20" }
    ],
    sizes: [
      { name: "5.44 كجم (12 باوند)", price_suffix: "" }
    ]
  },
  {
    id: 7,
    name: "Nitro Tech Isolate",
    price: 98000,
    image: "https://3km3cceozg.ucarecd.net/d9974449-c794-4e5f-b211-1836d52bebae/-/preview/1000x1000/",
    images: [
      "https://3km3cceozg.ucarecd.net/d9974449-c794-4e5f-b211-1836d52bebae/-/preview/1000x1000/"
    ],
    description: "بروتين معزول عالي الجودة يحتوي على نسبة عالية من الأحماض الأمينية، مصمم لدعم القوة وبناء العضلات الصافية بدون دهون.",
    flavors: [
      { name: "فانيليا", color: "#F3E5AB" }
    ],
    sizes: [
      { name: "1.8 كجم", price_suffix: "" }
    ]
  }
];

const NewAdded = () => {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  return (
    <section
      id="newadded"
      className=" bg-white pb-20 flex justify-center w-full "
    >
      <Container className="border-t border-black/10 pt-20">
        {/* العنوان الرئيسي مع أزرار التحكم */}
        <div className="flex items-end justify-between mb-16">
          <div className="text-right">
            <h2 className="text-3xl md:text-5xl text-black font-black mb-4 uppercase tracking-tighter">
              المضاف حديثاً
            </h2>
            <div className="w-32 md:w-44 h-1 bg-black rounded-2xl"></div>
          </div>

          <div className="flex gap-4 mb-2">
            <button
              onClick={scrollPrev}
              className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer group"
            >
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all cursor-pointer group rotate-180"
            >
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
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          </div>
        </div>

        {/* الكاروسيل */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing px-2"
          ref={emblaRef}
        >
          <div className="flex gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className="flex-[0_0_85%] active:scale-[0.97] transition-all duration-500 sm:flex-[0_0_45%] lg:flex-[0_0_23%] min-w-0 group cursor-pointer"
              >
                {/* حاوية الصورة */}
                <div className="relative aspect-square bg-[#F0EEED] rounded-[24px] overflow-hidden mb-5">
                  {product.discount && (
                    <span className="absolute top-4 right-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold z-10">
                      {product.discount}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                  />

                    <motion.div
                    style={{
                      maskImage: `url(${product.image})`,
                      maskSize: "contain",
                      maskRepeat: "no-repeat",
                      maskPosition: "center",
                      WebkitMaskImage: `url(${product.image})`,
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      background:
                        "linear-gradient(110deg, transparent 0%, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%, transparent 100%)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={{
                      backgroundPosition: ["200% 0%", "-200% 0%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                    className="absolute inset-0 p-0 z-20 pointer-events-none  w-full h-auto"
                  />
                </div>

                {/* تفاصيل المنتج */}
                <div className="text-right space-y-2">
                  <h3 className="text-lg md:text-xl font-bold text-black truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-start gap-3 font-bold">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xl md:text-2xl text-black">
                          {product.discountPrice.toLocaleString()} د.ع
                        </span>
                        <span className="text-gray-400 line-through text-base font-normal">
                          {product.price.toLocaleString()} د.ع
                        </span>
                      </>
                    ) : (
                      <span className="text-xl md:text-2xl text-black">
                        {product.price.toLocaleString()} د.ع
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* زر مشاهدة الكل */}
        <div className="mt-16 text-center">
          <button
            onClick={() => {
              router.push(`/products`);
            }}
            className="border active:scale-95 active:border-black active:bg-black active:text-white  border-black/10 px-12 py-2 text-black/70 cursor-pointer uppercase rounded-full text-lg font-medium transition-all duration-300"
          >
            مشاهدة الكل
          </button>
        </div>

        {/* Product Details Drawer */}
        <ProductDrawer 
          product={selectedProduct} 
          open={isDrawerOpen} 
          onOpenChange={setIsDrawerOpen} 
        />
      </Container>
    </section>
  );
};

export default NewAdded;

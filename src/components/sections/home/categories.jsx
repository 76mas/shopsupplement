import Container from "@/components/container";
import Image from "next/image";

const categories = [
  {
    name: "بروتينات وضخامة",
        image: "https://3km3cceozg.ucarecd.net/59156cd8-6e11-41ee-89d3-407a86abe03b/-/preview/1000x1000/",

    className: "md:col-span-1",
    position: "-left-8 -bottom-10 w-[110%] -rotate-12" 
  },
  {
    name: "حوارق دهون",
    image: "https://3km3cceozg.ucarecd.net/c976d250-17c1-4537-b9f0-26cc8ec78406/-/preview/1000x1000/",
    className: "md:col-span-2",
    position: "-left-10 -bottom-16 w-[60%] -rotate-6"
  },
  {
    name: "طاقة وباور",
    image: "https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/",
    className: "md:col-span-2",
    position: "-left-10 -bottom-20 w-[65%] -rotate-12"
  },
  {
    name: "فيتامينات",
    image: "https://3km3cceozg.ucarecd.net/d9974449-c794-4e5f-b211-1836d52bebae/-/preview/1000x1000/",
    className: "md:col-span-1",
    position: "-left-6 -bottom-10 w-[100%] -rotate-12"
  },
];

const Categories = () => {
  return (
    <section className="py-20 bg-white flex justify-center w-full">
      <Container>
        {/* الحاوية الرئيسية الرمادية */}
        <div className="flex flex-col gap-10 w-full bg-[#F0F0F0] rounded-[40px] p-8 md:p-16">
          
          <h1 className="text-4xl md:text-5xl text-black font-black mb-4 uppercase tracking-tighter text-center">
            تصفح حسب الفئة
          </h1>

          {/* شبكة التصنيفات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 h-auto md:h-[600px]">
            {categories.map((cat, index) => (
              <div
                key={index}
                className={`relative group overflow-hidden rounded-2xl shadow bg-white cursor-pointer h-[200px] md:h-full ${cat.className}`}
              >
                {/* اسم التصنيف */}
                <h3 className="absolute top-6 right-8 text-2xl md:text-3xl font-bold text-black z-10 group-hover:scale-110 transition-transform origin-right">
                  {cat.name}
                </h3>

                {/* الصورة */}
                <div className={`absolute ${cat.position} transition-transform duration-700 group-hover:scale-110 group-hover:-translate-y-2`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </Container>
    </section>
  );
};

export default Categories;

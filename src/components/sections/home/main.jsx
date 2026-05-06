"use client";
import Container from "@/components/container";
import CountUp from "@/components/countUp";
import Image from "next/image";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";

const Star = () => (
  <svg
    width="106"
    height="106"
    viewBox="0 0 56 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28 0C28.9506 15.0527 40.9472 27.0495 56 28C40.9472 28.9506 28.9506 40.9472 28 56C27.0495 40.9472 15.0527 28.9506 0 28C15.0527 27.0495 27.0495 15.0527 28 0Z"
      fill="black"
    />
  </svg>
);

const stats = [
  { value: 200, label: "ماركة عالمية" },
  { value: 2000, label: "منتج أصلي" },
  { value: 3000, label: "زبون ممنون" },
];

const MainSection = () => {
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col w-full min-h-screen pb-0 mb-0 pt-28 md:pt-32 lg:pt-26 items-center justify-center bg-[#F2F0F1] overflow-hidden">
        <Container>
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-10 lg:gap-16">
            {/* Content Side with Minimal Animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col w-full lg:w-1/2 gap-8 md:gap-10 items-center lg:items-start text-center lg:text-right text-black"
            >
              <div className="w-full space-y-4 md:space-y-6">
                <span className="text-black/40 text-xs md:text-base font-medium tracking-[0.2em] block uppercase">
                 افضل المكملات الغذائية الرياضية 
                </span>

                <h1 className="text-[40px] md:text-[75px] lg:text-[85px] font-black leading-[1.1] tracking-tight">
                  مكملاتي <br />
                </h1>

                <p className="text-gray-500 text-base md:text-xl max-w-[550px] mx-auto lg:mx-0 leading-relaxed">
                  نقدم تشكلة واسعة من المكملات الغذائية الرياضية من افضل
                  الماركات العالمية
                </p>
              </div>

              <button
                onClick={() => {
                  router.push("/products");
                }}
                className="border rounded-full w-full sm:w-[200px] py-4 cursor-pointer hover:opacity-80 active:scale-95 transition-all duration-300 px-8 text-white bg-black font-black text-lg"
              >
                تسوق الان
              </button>

              <div className="flex flex-wrap gap-x-8 gap-y-6 md:gap-10 mt-4 md:mt-8 w-full justify-center lg:justify-start">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 md:gap-10"
                  >
                    <div className="flex min-w-[80px] md:min-w-[100px] flex-col text-center">
                      <span className="text-xl md:text-3xl font-black text-black">
                        <CountUp to={stat.value} separator="," />+
                      </span>
                      <span className="text-gray-500 text-xs md:text-sm">
                        {stat.label}
                      </span>
                    </div>

                    {index !== stats.length - 1 && (
                      <div className="h-10 md:h-12 w-[1px] bg-black/10"></div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Image Side with Minimal Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full lg:w-1/2 relative flex justify-center mt-10 lg:mt-0"
            >
              <div className="relative w-[380px] sm:w-[450px] md:w-[550px] lg:w-[95%] xl:w-[90%]">
                <img
                  src="https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/"
                  alt="watch"
                  // width={1200}
                  // height={1200}
                  className="w-full h-auto -rotate-20 object-contain z-10 relative"
                />

                {/* Shine Animation Effect Masked to the PNG */}
                <motion.div
                  style={{
                    maskImage:
                      'url("https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/")',
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskImage:
                      'url("https://3km3cceozg.ucarecd.net/b0f4146b-cb83-443a-81aa-0d050ad95cf2/-/preview/1000x1000/")',
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
                  className="absolute inset-0 z-20 pointer-events-none -rotate-20 w-full h-auto"
                />

                {/* Stars with gentle pulse animation */}
                <motion.div
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute bottom-[10%] -left-[10%] md:bottom-20 md:left-0 z-0 scale-50 md:scale-100"
                >
                  <Star />
                </motion.div>

                <motion.div
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.6, 1, 0.6] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                  className="absolute top-[10%] -right-[10%] md:top-[10px] md:-right-[79x] z-0 scale-50 md:scale-100"
                >
                  <Star />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Container>

        <div className="w-full mb-0 mt-30 bg-black py-1 overflow-hidden border-y border-white/10 flex items-center">
          <div className="flex whitespace-nowrap animate-marquee">
            {[
              "Optimum Nutrition",
              "MuscleTech",
              "Cellucor",
              "Dymatize",
              "Rule 1",
              "Kevin Levrone",
              "BPI Sports",
              "Redcon1",
              "Insane Labz",
              "JNX Sports",
              "Animal",
              "Universal",
              "GAT Sport",
              "Evogen",
              "Scitec Nutrition",
              "MyProtein",
              "Pre-Workout",
              "Isolate",
              "ON",
              "MuscleTech",
              "Cellucor",
              "Dymatize",
              "Rule 1",
              "Kevin Levrone",
              "BPI Sports",
              "Redcon1",
              "Insane Labz",
              "JNX Sports",
              "Animal",
              "Universal",
              "GAT Sport",
              "Evogen",
              "Scitec Nutrition",
              "MyProtein",
            ].map((brand, i) => (
              <div key={i} className="flex items-center mx-4 gap-8">
                {i % 2 === 0 ? (
                  <h2 className="text-white text-2xl md:text-3xl font-bold tracking-widest uppercase">
                    {brand}
                  </h2>
                ) : (
                  <h2
                    className="text-transparent stroke-white stroke-1 text-2xl md:text-3xl font-bold tracking-widest uppercase"
                    style={{ WebkitTextStroke: "1px rgba(255,255,255,0.6)" }}
                  >
                    {brand}
                  </h2>
                )}
                <Star className="w-4 h-4 fill-white opacity-30" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MainSection;

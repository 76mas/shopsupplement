"use client";
import Container from "@/components/container";

const reviews = [
  {
    name: "كابتن أحمد الجبوري",
    comment:
      "بصراحة المكملات أصلية والباور مالتها كلش عالي. التوصيل جان سريع وبنفس اليوم وصلني للجم. شغل مرتب.",
    stars: 5,
  },
  {
    name: "سارة محمود",
    comment:
      "أخذت منهم حوارق دهون وفيتامينات، والنتائج بدت تبين خلال أول أسبوعين. التغليف يجنن وتعاملهم راقي.",
    stars: 5,
  },
  {
    name: "محمد علي",
    comment:
      "عدهم تشكيلة بروتينات عالمية وأسعارهم مقارنة بالسوق كلش مناسبة. أهم شي بالمكمل هو المصدر وهذول شغلهم مضمون.",
    stars: 5,
  },
  {
    name: "ليلى القيسي",
    comment:
      "أخذت (ايسوليت) و (كرياتين) كهدية لأخويا وكلش فرح بيهم. العلب واصلة نظيفة وتاريخها جديد (Long Expiry).",
    stars: 5,
  },
  {
    name: "عمر الخفاجي",
    comment:
      "تجربة شراء ممتازة، الرد جان سريع ونصحوني بالمكمل المناسب لجسمي. المحل فعلاً ثقة لكل واحد يهتم بجسمه.",
    stars: 5,
  },
];

const CustomerComments = () => {
  return (
    <section className="py-20 bg-white flex flex-col justify-center items-center overflow-hidden">
      <Container>
        <h2 className="text-4xl text-black md:text-5xl font-black mb-16 uppercase tracking-tighter text-right">
          آراء عملائنا
        </h2>
      </Container>
      {/* الحاوية الخارجية التي تمنع ظهور شريط التمرير */}
      <div className="relative flex overflow-hidden group pb-5">
        {/* الحاوية المتحركة - أضفنا w-max و hover:[animation-play-state:paused] */}
        <div className="flex flex-nowrap gap-6 animate-marquee w-max group-hover:[animation-play-state:paused]">
          {[...reviews, ...reviews].map((review, index) => (
            <div
              key={index}
              className="w-[350px] md:w-[400px] p-8 border border-black/5 rounded-[20px] bg-white shadow-sm flex-shrink-0 whitespace-normal"
            >
              {/* النجوم */}
              <div className="flex gap-1 mb-4">
                {[...Array(review.stars)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              {/* الاسم والتحقق */}
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg md:text-xl text-black">{review.name}</span>
                <div className="bg-green-500 rounded-full p-0.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-base md:text-lg leading-relaxed text-right">
                "{review.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerComments;

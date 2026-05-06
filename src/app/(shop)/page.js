import Container from "@/components/container";
import MainSection from "@/components/sections/home/main";
import BestSeller from "@/components/sections/home/bestseller";  
import NewAdded from "@/components/sections/home/newadded";
import Categories from "@/components/sections/home/categories"; 
import CustomerComments from "@/components/sections/home/custmorcomints";

export default function Home() {
  return (
    <div className="flex flex-col justify-center bg-white ">
      <MainSection />
      <BestSeller />
      <NewAdded />
      <Categories />
      <CustomerComments />
    </div>
  );
}

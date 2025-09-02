import React from "react";
import FlowBiteHeader from "../components/global/FlowBiteHeader";
import Hero from "../components/Landing/Hero";
import PromotionBanner from "../components/Landing/PromotionBanner";
import DealsCarousel from "../components/products/DealsCarousel";

export default function Landing({}) {
  const categories = [
    {
      label: "Beauty",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/beauty.jpg",
    },
    {
      label: "Books",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/books.jpg",
    },
    {
      label: "Electronics",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/electroins.jpg",
    },
    {
      label: "Fashion",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/fashion.jpg",
    },
    {
      label: "Home",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/home.jpg",
    },
    {
      label: "Toys",
      pic: "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/xoo/toys.jpg",
    },
  ];
  return (
    <>
      
      <Hero />
      <div className="p-4">
        <h1 className='px-8 py-4 text-2xl font-semibold'>Browse by Category</h1>
        <div className=" grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 p-4">
          {categories.map((category) => (
            <div className="flex flex-col">
              <h2 className='text-center font-medium p-3'>{category.label}</h2>
              <img src={category.pic} alt="..." className="border-2 w-32 h-32 self-center rounded-full"/>
            </div>
          ))}
        </div>
      </div>
      <PromotionBanner />
      {/** Latest Deal carousel */}
      <DealsCarousel />
 
    </>
  );
}

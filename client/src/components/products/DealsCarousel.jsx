import { Carousel } from "flowbite-react";
import { CarouselProductCard, CaruoselMobileCard } from "./ProductCards";
import React from "react";
import { ArrowRightIcon } from "lucide-react";
import useProducts from "../../hooks/useProducts";

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function DealsCarousel(props) {
  const { products, loading } = useProducts(12);
  const imagePairs = chunkArray(products, 2);

  return (
    <>
      <div className="flex flex-col mt-2 p-4">
        <div className="flex justify-between ">
          <h2 className="font-medium text-sm  md:text-xl md:px-8">Latest Deals</h2>
          <a href="#" className="flex gap-3 text-xs md:text-md text-blue-700 md:px-6 md:p-2 mb-12">
            View more <ArrowRightIcon className="w-4 md:w-5" />
          </a>
        </div>
        <Carousel pauseOnHover className="hidden lg:block h-72 md:h-64 lg:h-72 rounded-xl">
          {loading ? ( <p>loading...</p> ) : (imagePairs.map((pair, index) => (
            <div key={index} className="flex justify-evenly md:gap-3 ">
              {pair.map((product, idx) => (
                <CarouselProductCard key={idx} product={product}/>
              ))}
            </div>
          )))}
        </Carousel>
        <Carousel pauseOnHover className="flex h-[450px] lg:hidden items-center md:h-64 lg:h-72 rounded-xl">
          {loading ? ( <p>loading...</p> ) : (
              products.map((product) => (
                <CaruoselMobileCard product={product}/>
              )))}
        </Carousel>
      </div>
    </>
  );
}

import { Carousel } from "flowbite-react";
import { CarouselProductCard } from "./ProductCards";
import React from "react";
import { ArrowRightIcon } from "lucide-react";
import useProducts from "../hooks/useProducts";

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
      <div className="flex flex-col mt-32 p-4">
        <div className="flex justify-between ">
          <h2 className="font-medium text-xl px-8">Latest Deals</h2>
          <a href="#" className="flex gap-3 text-blue-700 px-6 p-2 mb-12">
            View more <ArrowRightIcon className="w-5" />
          </a>
        </div>
        <Carousel pauseOnHover className="h-72 md:h-72 lg:h-72 rounded-xl">
          {loading ? ( <p>loading...</p> ) : (imagePairs.map((pair, index) => (
            <div key={index} className="flex justify-evenly ">
              {pair.map((product, idx) => (
                <CarouselProductCard key={idx} product={product}/>
              ))}
            </div>
          )))}
        </Carousel>
      </div>
    </>
  );
}

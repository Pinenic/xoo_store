import { Heart, ShoppingCart } from "lucide-react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";
import React from "react";
import QuantitySelector from "./QunatitySelector";

export function CarouselProductCard({ product }) {
  const imgUrl =
    "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/public/11/public-uploaded-image-1755693475579.jpg";

  return (
    <>
      <Card
        className="flex gap-4 justify-between max-w-lg max-h-72 p-4"
        renderImage={() => (
          <img src={product.thumbnail} alt="image 1" className="w-48" />
        )}
        horizontal
      >
        <div className="flex flex-col w-64">
          <h2 className="text-lg font-medium p-1">{product.title}</h2>
          <div className="flex p-1 justify-between">
            <h2 className="text-xl font-semibold">K{product.price}</h2>
            <p className="text-sm text-gray-700 mt-1">(34)reviews</p>
          </div>
          <hr />
          <div className="flex flex-col p-2 py-3">
            <p>Qty:</p>
            <QuantitySelector />
          </div>
          <hr />
          <div className="flex mt-3 justify-between px-2">
            <Heart />
            <Link
              to={`/products/${product.id}`}
              className="flex justify-evenly items-center text-center px-3 bg-blue-700 text-white w-2/3 p-1 rounded-lg text-sm"
            >
              {" "}
              <ShoppingCart className="w-5" /> Add to cart{" "}
            </Link>
          </div>
        </div>
      </Card>
    </>
  );
}

export function GridProductCard({ product }) {

  const captitaliseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
  <Card imgSrc={product.thumbnail}>
    <div className="flex flex-col justify-between h-56 w-full" >
      <h2 className="text-xl font-medium py-2 md:p-2">{product.title}</h2>
      <h2 className="text-sm font-sm py-2 md:p-1 line-clamp-2 ">
        {product.title}
        {", "}
        {product.tags.map((tag) => captitaliseFirst(tag) + ", ")}
        {product.brand}
      </h2>
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold py-2 md:p-2">K{product.price}</h2>
        {product.color ? (
          <div className="flex gap-2">
            <p>Colors</p>
            <div className="w-12 h-12 rounded-full bg-gray-900"></div>
            <div className="w-12 h-12 rounded-full bg-green-700"></div>
            <div className="w-12 h-12 rounded-full bg-blue-700"></div>
          </div>
        ) : (
          <p>No colors</p>
        )}
      </div>

      <div className="flex w-full md:flex-row mt-3 justify-between lg:justify-start px-2 gap-2">
        <button className="flex justify-center gap-3  items-center text-center px-3 bg-gray-700/10 text-blue-700 w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm md:text-xs">
          {" "}
          <Heart className="w-5" /> Wishlist{" "}
        </button>
        <Link
              to={`/products/${product.id}`} className="flex justify-center gap-3 items-center text-center px-3 bg-blue-700 text-white w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm">
          {" "}
          <ShoppingCart className="w-5" /> Buy {" "}
        </Link>
      </div>
    </div>
  </Card>);
}

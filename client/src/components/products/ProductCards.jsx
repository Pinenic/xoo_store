import { Heart, ShoppingCart } from "lucide-react";
import { Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import QuantitySelector from "../global/QunatitySelector";
import { useCartStore } from "../../context/useCart";

export function CarouselProductCard({ product, user }) {
  const {addToCart} = useCartStore();
  const [qty, setQty] = useState(1);
  const navigate = useNavigate()
  const imgUrl =
    "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/public/11/public-uploaded-image-1755693475579.jpg";

  return (
    <>
      <Card
        className="lg:flex gap-4 justify-between md:w-1/2 lg:max-w-lg  max-h-48 p-4"
        renderImage={() => (
          <img src={product.thumbnail} alt="image 1" className="w-32" />
        )}
        horizontal
      >
        <div className="flex flex-col md:w-72 lg:w-64">
          <h2 className=" font-medium p-1">{product.title}</h2>
          <div className="flex p-1 justify-between">
            <h2 className="text font-semibold">K{product.price}</h2>
            <p className="text-sm text-gray-700 mt-1">(34)reviews</p>
          </div>
          <hr />
          <div className="flex flex-col p-2 py-2">
            <p>Qty:</p>
            <QuantitySelector  quantity={qty} setQuantity={setQty} />
          </div>
          <hr />
          <div className="flex mt-3 gap-2 px-2">
            <Heart className="my-auto"/>
            <button
              className="flex justify-evenly items-center text-center px-3 bg-blue-700 text-white w-2/3 p-1 rounded-lg text-sm" onClick={() => (user ? addToCart(product, qty): navigate("/auth"))}
            >
              {" "}
              <ShoppingCart className="w-5" /> Add to cart{" "}
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}
export function CaruoselMobileCard({product, user}){
    const {addToCart} = useCartStore();
  const [qty, setQty] = useState(1);
  const navigate = useNavigate()
  const imgUrl =
    "https://xbyfrxtfdvmsbvgzpcyw.supabase.co/storage/v1/object/public/imageUpload/public/11/public-uploaded-image-1755693475579.jpg";

  return (
    <>
      <Card
        className="lg:flex gap-4 justify-between md:w-3/4 lg:max-w-lg  max-h-full md:max-h-64 self-center m-auto my-auto p-4"
        renderImage={() => (
          <img src={product.thumbnail} alt="image 1" className="w-40" />
        )}
        horizontal
      >
        <div className="flex flex-col h-40 md:w-72 lg:w-64">
          <h2 className=" font-medium p-1">{product.title}</h2>
          <div className="flex p-1 justify-between">
            <h2 className="text font-semibold">K{product.price}</h2>
            <p className="text-sm text-gray-700 mt-1">(34)reviews</p>
          </div>
          <hr />
          <div className="flex flex-col p-2 py-2">
            <p>Qty:</p>
            <QuantitySelector  quantity={qty} setQuantity={setQty} />
          </div>
          <hr />
          <div className="flex mt-3 gap-2 px-2">
            <Heart className="my-auto"/>
            <button
              className="flex justify-evenly items-center text-center px-3 bg-blue-700 text-white w-2/3 p-1 rounded-lg text-sm" onClick={() => (user ? addToCart(product, qty): navigate("/auth"))}
            >
              {" "}
              <ShoppingCart className="w-5" /> Add to cart{" "}
            </button>
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
      <h2 className="text-sm md:text-xl font-medium md:py-1 md:p-2 line-clamp-2">{product.title}</h2>
      <h2 className="text-xs md:text-sm font-sm md:py-1 md:p-1 line-clamp-2 ">
        {product.title}
        {", "}
        {product.tags.map((tag) => captitaliseFirst(tag) + ", ")}
        {product.brand}
      </h2>
      <div className="flex justify-between">
        <h2 className="text-sm font-semibold py-2 md:p-2">K{product.price}</h2>
        {product.color ? (
          <div className="flex gap-2">
            <p>Colors</p>
            <div className="w-12 h-12 rounded-full bg-gray-900"></div>
            <div className="w-12 h-12 rounded-full bg-green-700"></div>
            <div className="w-12 h-12 rounded-full bg-blue-700"></div>
          </div>
        ) : (
          <p className="hidden text-xs">No colors</p>
        )}
      </div>

      <div className="flex flex-col w-full md:flex-row mt-3 justify-between lg:justify-start md:px-2 gap-2">
        <button className="flex justify-center gap-3  items-center text-center px-3 bg-gray-700/10 text-blue-700 w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm md:text-xs">
          {" "}
          <Heart className="w-5" /> Wishlist{" "}
        </button>
        <Link
              to={`/products/${product.id}`} className="flex justify-center gap-3 items-center text-center px-3 bg-blue-700 text-white w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm">
          {" "}
          <ShoppingCart className="w-4" /> Buy {" "}
        </Link>
      </div>
    </div>
  </Card>);
}

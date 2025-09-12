import { Heart, Eye, ShoppingCart, Star } from "lucide-react";
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

export function GridProductCard({ product, user }) {
  const navigate = useNavigate()
    const {addToCart} = useCartStore();
    const qty = 1;
  return (
    <Card className="rounded shadow-none ">
      {/* Image Section */}
      <div className="relative w-full h-32 md:h-48 flex items-center justify-center bg-gray-100 rounded-t">
        {/* Discount Badge */}
        {product.discount && (
          <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
            Up to {product.discount}% off
          </span>
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          className="max-h-full max-w-full object-contain"
        />
        {/* Icons (view + wishlist) */}
        <div className="absolute top-2 right-2 flex gap-2">
          <Link to={`/products/${product.id}`} className="p-1.5 rounded-full bg-white shadow hover:bg-gray-100">
            <Eye className="w-4 h-4 text-gray-700" />
          </Link>
          <button className="p-1.5 rounded-full bg-white shadow hover:bg-gray-100">
            <Heart className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2">
        {/* Title */}
        <h2 className="text-sm sm:text-base md:text-lg line-clamp-1">
          {product.title}
        </h2>
        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">
          {product.brand && `${product.title}, ${product.brand}`}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(product.rating || 0)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-xs md:text-sm font-medium text-gray-800">
            {product.rating?.toFixed(1) || "0.0"}
          </span>
          <span className="text-xs text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-2 text-xs text-gray-600">
          {product.bestSeller && (
            <span className="flex items-center gap-1">
              ⭐ Best Seller
            </span>
          )}
          {product.bestPrice && (
            <span className="flex items-center gap-1">
              💰 Best Price
            </span>
          )}
        </div>

        {/* Price */}
        <h3 className="text-sm sm:text-sm md:text-lg font-bold text-gray-900">
          K{product.price?.toFixed(2)}
        </h3>

        {/* Actions */}
        <div className="flex w-full mt-2">
         
            <button
            className="flex justify-center gap-2 items-center px-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[0.7rem] md:text-xs sm:text-base w-full" onClick={() => (user ? addToCart(product, qty): navigate("/auth"))}
            >
              {" "}
              <ShoppingCart className="w-4 h-4" /> Add to cart{" "}
            </button>
        </div>
      </div>
    </Card>
  );
}

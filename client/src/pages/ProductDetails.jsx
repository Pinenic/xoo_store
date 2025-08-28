import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useProducts from "../hooks/useProductById";
import ImageGallery from "../components/ImageGallery";
import StarDisplay from "../components/StarDisplay";
import { Heart, ShoppingCart } from "lucide-react";
import QuantitySelector from "../components/QunatitySelector";
import RadioButtonGroup from "../components/RadioButtonGroup";
import FlowBiteHeader from "../components/FlowBiteHeader";
import { useCartStore } from "../context/useCart";

export default function ProductDetails({}) {
  const { productId } = useParams();
  const { product, loading } = useProducts(productId);
  const [inStock, setInStock] = useState(true);
  const [qty, setQty] = useState(1);
  const {addToCart} = useCartStore();

  useEffect(() => {
    if (loading) {
      setInStock(true);
    } else if (product.stock <= 0) {
      setInStock(false);
    }
  }, []);
  const captitaliseFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
   
      {loading ? (
        <p>Loading</p>
      ) : (
        <>
          <div className="flex flex-col items-center md:items-start md:flex-row md:justify-evenly md:gap-8 w-screen md:p-6">
            <div className="w-3/4 md:w-96">
              <ImageGallery product={product} />
            </div>
            <div className="flex flex-col w-full px-3 md:w-2/3 lg:w-1/2">
              <div className="flex flex-col">
                <div
                  className={
                    inStock
                      ? "flex bg-green-500 text-white/80 w-16 text-center rounded-md justify-center text-xs font-medium mt-8 ml-2"
                      : ""
                  }
                >
                  {inStock ? "in stock" : "out of stock"}
                </div>
                <h2 className="text-2xl font-medium py-2 md:p-2 ">
                  {product.title}
                  {", "}
                  {product.tags.map((tag) => captitaliseFirst(tag) + ", ")}
                  {product.brand}
                </h2>
                <div className="flex gap-4">
                  <StarDisplay rating={product.rating} />
                  <p className="pt-1">{product.rating.toFixed(1)}</p>
                  <a href="#" className="underline pt-1">
                    {"(" + product.reviews.length + ")"} reviews
                  </a>
                </div>
                <h2 className="text-2xl font-semibold py-2 md:p-2">K{product.price}</h2>
                <div className="flex flex-col md:flex-row mt-3 justify-between lg:justify-start px-2 gap-2">
                  <button className="flex justify-center gap-3 py-2 items-center text-center px-3 bg-gray-700/10 text-blue-700 w-full md:w-1/2 lg:w-1/3 p-1 rounded-lg text-sm md:text-xs">
                    {" "}
                    <Heart className="w-5" /> Add to Wishlist{" "}
                  </button>
                  <button className="flex justify-center gap-3 items-center text-center px-3 bg-blue-700 text-white w-full md:w-1/2 lg:w-1/3 py-2 p-1 rounded-lg text-sm" onClick={() => (addToCart(product, qty))}>
                    {" "}
                    <ShoppingCart className="w-5" /> Add to cart{" "}
                  </button>
                  <div className="flex md:hidden lg:flex gap-3 items-center">
                    Qty: <QuantitySelector quantity={qty} setQuantity={setQty}/>{" "}
                  </div>
                </div>
                <div className="hidden md:flex lg:hidden gap-3 items-center p-3">
                    Qty: <QuantitySelector  quantity={qty} setQuantity={setQty}/>{" "}
                  </div>
              </div>
              <hr className="w-[97%] self-center mt-6 mb-3"/>
              <div className="flex flex-col p-2">
                <p className="text-md font-medium pb-2">Pickup</p>
                <RadioButtonGroup />
              </div>
              <p className="text-md font-medium p-2 pb-2">Description</p>
              <p  className="text-xs lg:text-sm text-gray-700 px-8">{product.description}</p>
            </div>
          </div>
        </>
      )}
    </>
  );
}

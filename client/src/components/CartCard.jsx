import { Heart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import QuantitySelector from "./QunatitySelector";
import useProduct from "../hooks/useProductById";

export default function CartCard({ item }) {
  const { product, loading } = useProduct(item.productId);
    const [qty, setQty] = useState(item.quantity);

    const totalPrice = item.price * qty
  return (
    <>
      <div className="flex justify-between p-4 border-2 rounded-lg h-32">
        {loading ? (
          <p>loading...</p>
        ) : (
          <>
            <img src={product.thumbnail} alt="" />
            <div className="flex flex-col w-1/2">
              <h2>{product.title}</h2>
              <div className="flex">
                <div className="flex w-full md:flex-row mt-3 justify-between lg:justify-start px-2 gap-2">
                  <button className="flex justify-center gap-3  items-center text-center px-3 border-2 border-gray-700/10 text-blue-700 w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm md:text-xs">
                    {" "}
                    <Heart className="w-5" />
                    Add to Wishlist{" "}
                  </button>
                  <Link
                    to={`#`}
                    className="flex justify-center gap-3 items-center text-center px-3 text-red-400 w-full md:w-1/2 lg:w-1/2 p-1 rounded-lg text-sm"
                  >
                    {" "}
                    Remove X
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex h-8 my-auto">
              <QuantitySelector  quantity={qty} setQuantity={setQty}/>
            </div>
            <h2 className="h-8 my-auto">K{totalPrice.toFixed(2)}</h2>
          </>
        )}
      </div>
    </>
  );
}

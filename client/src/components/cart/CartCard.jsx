import { Heart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import QuantitySelector from "../global/QunatitySelector";
import useProduct from "../../hooks/useProductById";

export default function CartCard({ item, update,remove }) {
  const { product, loading } = useProduct(item.productId);
  const [qty, setQty] = useState(item.quantity);

  const totalPrice = item.price * qty;
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between bg-gray-100/50 p-2 mb-5 md:p-4  rounded-lg h-fit md:h-32">
        {loading ? (
          <p>loading...</p>
        ) : (
          <>
            <img src={product.thumbnail} alt="" className="w-24 md:w-auto"/>
            <div className="flex  justify-between md:hidden">
              <div className="flex h-8 my-auto">
                <QuantitySelector quantity={qty} setQuantity={setQty} update={update} id={item.productId}/>
              </div>
              <h2 className="h-8 my-auto text-sm">K{totalPrice.toFixed(2)}</h2>
            </div>
            <div className="flex flex-col md:w-1/2">
              <h2 className="pt-3 px-2 text-sm">{product.title}</h2>
                <div className="flex w-full md:flex-row mt-3 justify-start lg:justify-start  gap-2">
                  <button className="flex gap-1  items-center text-center px-3 md:px-0  text-blue-700 w-fit md:w-fit lg:w-fit p-1 rounded-lg text-xs md:text-xs">
                    {" "}
                    <Heart className="w-5" />
                    Add to Wishlist{" "}
                  </button>
                  <button
                    className="flex justify-center gap-3 items-center text-center px-3 text-red-400  w-fit md:w-fit lg:w-fit p-1 rounded-lg text-xs"
                    onClick={() => remove(item.productId)}
                  >
                    {" "}
                   X Remove
                  </button>
                </div>
            </div>
            <div className="hidden md:flex md:justify-between md:w-1/3">
              <div className="flex h-8 my-auto">
                <QuantitySelector quantity={qty} setQuantity={setQty} update={update} id={item.productId} />
              </div>
              <h2 className="my-auto text-xs text-center h-fit font-medium">K{totalPrice.toFixed(2)}</h2>
            </div>
          </>
        )}
      </div>
    </>
  );
}

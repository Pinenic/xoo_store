import React, { useEffect, useState } from "react";
import { useCartStore } from "../context/useCart";
import { Link } from "react-router-dom";
import CartCard from "../components/cart/CartCard";

export default function Cart({user}) {
    const { items, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, loading } = useCartStore();
    const getTotal = useCartStore((state) => state.getTotal)
    const total = getTotal()
    const savings = 19
    const delivery = 29

   useEffect(() => {
    if (user) fetchCart(user.id);
 }, [user]);

  if (loading) return <p>Loading cart...</p>;

  

  return (
    <>
      <h1 className="text-xl p-2 font-medium">Shopping Cart</h1>
      <div className="flex flex-col md:flex-row md:justify-evenly md:min-h-[50vh] md:p-4">
        <div className="flex flex-col w-full rounded-lg p-4">
          {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
        <ul>
          {items.map((item) => (
            <li key={item.productId}>
              <CartCard item={item} update={updateQuantity} remove={removeFromCart}/>
            </li>
          ))}
        </ul></>
      )}
            
        </div>

        {/** The order summary */}
        <div className="flex flex-col border-2 md:w-96 lg:w-1/2 h-72 justify-between p-4  rounded-lg">
          <h2>Order summary</h2>
          <div className="flex justify-between">
            <p>Original Price</p>
            <p>{total.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Savings</p>
            <p className="text-green-500">- K{savings}</p>
          </div>
          <div className="flex justify-between">
            <p>Delivery</p>
            <p>K{delivery}</p>
          </div>
          <hr />

          <div className="flex justify-between">
            <p className="font-semibold">Total</p>
            <p>K{((total+delivery) - savings).toFixed(2)}</p>
          </div>

          <div className="flex flex-col w-full  mt-3 justify-between lg:justify-start px-2 gap-2">
            <Link
              to={`/`}
              className="flex justify-center gap-3 items-center text-center p-2 bg-blue-700 text-white rounded-lg text-sm"
            >
              {" "}
              Proceed to checkout{" "}
            </Link>
            <p  className="flex justify-center gap-3 items-center text-center px-3text-white w-full p-1 rounded-lg text-sm">or <Link to={"/marketplace"}
           >Continue Shopping</Link></p>
          </div>
        </div>
      </div>
    </>
  );
}

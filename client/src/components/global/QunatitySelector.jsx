import React, { useState } from 'react';

export default function QuantitySelector({quantity, setQuantity, update, id}) {

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      update(id,quantity)
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
      update(id,quantity)
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    // Ensure the value is a number and is not empty before updating the state
    if (!isNaN(value) && value !== '') {
      const newQuantity = parseInt(value, 10);
      setQuantity(Math.max(1, newQuantity)); // Ensure quantity doesn't go below 1
      update(id,quantity)
    }
  };

  return (
    <div className='flex items-center border-2 rounded-lg w-fit '>
      <button onClick={handleDecrease} className='w-5'>-</button>
      <input 
        type="number"
        value={quantity}
        onChange={handleInputChange} // Add the onChange handler
        className='mx-1 w-8 border-2 text-center border-t-transparent border-b-transparent'
      />
      <button onClick={handleIncrease} className='w-5'>+</button>
    </div>
  );
};


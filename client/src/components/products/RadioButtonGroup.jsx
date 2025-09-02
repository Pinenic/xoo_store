import React, { useState } from 'react';

function RadioButtonGroup() {
  const [selectedChoice, setSelectedChoice] = useState(''); // Your state variable

  const handleRadioChange = (event) => {
    setSelectedChoice(event.target.value);
  };

  return (
    <>
    <form className='flex flex-col md:flex-row text-xs lg:text-md gap-4'>
        <div className="flex gap-3">
      <input
        type="radio"
        id="choice1"
        name="myChoice"
        value="Option A"
        checked={selectedChoice === 'Option A'}
        onChange={handleRadioChange}
      className='bg-blue-700'/>
      <label htmlFor="choice1">Seller Shipping</label><br /></div>
        <div className="flex gap-3"><input
        type="radio"
        id="choice2"
        name="myChoice"
        value="Option B"
        checked={selectedChoice === 'Option B'}
        onChange={handleRadioChange}
      />
      <label htmlFor="choice2">Platinum Courier</label><br /></div>
        <div className="flex gap-3"><input
        type="radio"
        id="choice3"
        name="myChoice"
        value="Option C"
        checked={selectedChoice === 'Option C'}
        onChange={handleRadioChange}
      />
      <label htmlFor="choice3">Xoo store pickup</label></div>
      

      

      
    </form>
    {/**<p>Your selected choice is: <strong>{selectedChoice}</strong></p>
     * 
     * for testing purposes
    */}
    </>
  );
}

export default RadioButtonGroup;
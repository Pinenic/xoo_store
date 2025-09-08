// src/components/ProductImageGallery.js
import React, { useState } from 'react';

const ImageGallery = ({product}) => {
  const [activeImage, setActiveImage] = useState(product.thumbnail); // Default to the first image
  const imgArr = [product.thumbnail, ...product.images]

  return (
    <div className="flex flex-col items-center">
      {/* Main Image Display */}
      <div className="w-full max-w-md mb-4 rounded-lg overflow-hidden border-2">
        <img
          src={activeImage}
          alt={product.name}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Image Tabs (Thumbnails) */}
      <div className="flex justify-center space-x-2">
        {imgArr.map((image) => (
          <button
            key={image.id}
            onClick={() => setActiveImage(image)}
            className={`
              w-24 h-24 p-1 rounded-md overflow-hidden
              border-2 transition-all duration-300
              ${activeImage.id === image.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}
            `}
          >
            <img
              src={image}
              alt={`${product.name} thumbnail ${image.id}`}
              className="w-full h-full object-cover rounded-sm"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
// src/pages/ProductsPage.jsx
import { useState } from "react";
import ProductCard from "./ProductCard";

const sampleProducts = [
  {
    id: 1,
    name: "Apple Watch SE - Gen 3",
    price: 299,
    image: "https://via.placeholder.com/150",
    options: [
      { label: "Display size", values: ["40mm", "44mm"] },
      { label: "Color", values: ["Black", "White", "Pink"] },
    ],
  },
  {
    id: 2,
    name: "PlayStation®5 Console – 1TB",
    price: 599,
    image: "https://via.placeholder.com/150",
    options: [
      { label: "Storage", values: ["512GB", "1TB"] },
      { label: "Color", values: ["Gray", "White"] },
    ],
  },
];

export default function ProductsGrid({products}) {

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

// src/components/ProductCard.jsx
import { Card, Button, Select } from "flowbite-react";

export default function ProductCard({ product }) {
  return (
    <Card className="max-w-sm">
      {/* Image */}
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-40 w-full object-contain"
      />

      {/* Info */}
      <div>
        <h5 className="text-lg font-semibold">{product.title}</h5>
        <p className="text-xl font-bold text-gray-900">${product.price}</p>

        {/* Variants */}
        {product.options?.map((opt) => (
          <div key={opt.label} className="mt-2">
            <label className="block text-sm font-medium text-gray-700">
              {opt.label}
            </label>
            <Select>
              <option value="">Choose {opt.label.toLowerCase()}</option>
              {opt.values.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </Select>
          </div>
        ))}

        {/* CTA */}
        <Button className="mt-4 w-full">Add to cart</Button>
      </div>
    </Card>
  );
}

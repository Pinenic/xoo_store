import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import { Star } from "lucide-react";
import { useState } from "react";

export default function SideFilterBar({ categories, brands, onFilterChange }) {
  const defaultFilters = {
    categories: [],
    brands: [],
    minPrice: 0.1,
    maxPrice: 100000000,
    rating: 0,
    sort: "newest",
  };

  const [filters, setFilters] = useState(defaultFilters);

  const sortOptions = [
    { key: "newest", label: "Newest" },
    { key: "price_low_high", label: "Price ↑" },
    { key: "price_high_low", label: "Price ↓" },
    { key: "rating_high_low", label: "Top Rated" },
  ];

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const exists = prev[key].includes(value);
      return {
        ...prev,
        [key]: exists
          ? prev[key].filter((v) => v !== value)
          : [...prev[key], value],
      };
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  const handleApply = () => {
    if (onFilterChange) onFilterChange(filters);
  };

  return (
    <aside className="w-64 p-1 py-4 bg-white">
      <Accordion collapseAll className="border-none">
        {/* Categories */}
        <AccordionPanel className=" border-none">
          <AccordionTitle className="text-sm p-2 focus:outline-none focus:ring-0">Categories</AccordionTitle>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((c) => (
                <label
                  key={c}
                  className="flex items-center text-xs gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(c) || false}
                    onChange={() => toggleArrayFilter("categories", c)}
                    className="rounded"
                  />
                  {c}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionPanel>

        {/* Brands */}
        <AccordionPanel>
          <AccordionTitle className="text-sm p-2 focus:outline-none focus:ring-0">Brands</AccordionTitle>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brands.map((b) => (
                <label
                  key={b}
                  className="flex items-center text-xs gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(b) || false}
                    onChange={() => toggleArrayFilter("brands", b)}
                    className="rounded"
                  />
                  {b}
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionPanel>

        {/* Price */}
        <AccordionPanel className="h-6 p-2">
          <AccordionTitle className="text-sm p-2 focus:outline-none focus:ring-0">Price Range</AccordionTitle>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium">
                  Min: K{filters.minPrice}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">
                  Max: K{filters.maxPrice}
                </label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>

        {/* Rating */}
        <AccordionPanel>
          <AccordionTitle className="text-sm p-2 focus:outline-none focus:ring-0">Rating</AccordionTitle>
          <AccordionContent>
            {[5, 4, 3, 2, 1].map((r) => (
              <label
                key={r}
                className="flex items-center gap-2 mb-1 cursor-pointer"
              >
                <input
                  type="radio"
                  checked={filters.rating === r}
                  onChange={() => setFilters({ ...filters, rating: r })}
                />

                {/* Render r stars */}
                <span className="flex text-yellow-300">
                  {Array.from({ length: r }).map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" stroke="none" />
                  ))}
                </span>
              </label>
            ))}
          </AccordionContent>
        </AccordionPanel>

        {/* Sort By */}
        <AccordionPanel>
          <AccordionTitle className="text-sm p-2 focus:outline-none focus:ring-0">Sort By</AccordionTitle>
          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilters({ ...filters, sort: key })}
                  className={`px-3 py-1 rounded text-xs ${
                    filters.sort === key
                      ? "bg-blue-500 text-white"
                      : "border border-gray-300"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleApply}
          className="w-full bg-blue-500 text-white text-sm py-2 rounded"
        >
          Apply
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-gray-200 text-gray-700 text-sm py-2 rounded"
        >
          Reset
        </button>
      </div>
    </aside>
  );
}

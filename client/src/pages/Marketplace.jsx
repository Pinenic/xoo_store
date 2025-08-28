import { Dropdown, DropdownItem } from "flowbite-react";
import React, { useMemo, useState } from "react";
import useProductFilters from "../hooks/useProductFilters";
import useProducts from "../hooks/useProducts";

import { GridProductCard } from "../components/ProductCards";
import FilterBar from "../components/FilterBar";
import Loader from "../components/Loader";
import FlowBiteHeader from "../components/FlowBiteHeader";

export default function Marketplace({}) {
  const { categories, brands, ratings } = useProductFilters();
  const {products, loading} = useProducts(300)

    const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: "",
    rating: "",
    sort: "newest",
  });

  // Filter products whenever filters change
  const isFilterActive = () =>
    filters.category ||
    filters.brand ||
    filters.price ||
    filters.rating ||
    filters.sort !== "newest";

  const filteredProducts = useMemo(() => {
    // If no filters are active, return full array
    if (!isFilterActive()) return products;

    return products
      .filter((product) => {
        // Category Filter
        if (filters.category && product.category !== filters.category) return false;

        // Brand Filter
        if (filters.brand && product.brand !== filters.brand) return false;

        // Price Filter
        if (filters.price) {
          if (filters.price === "Under $50" && product.price >= 50) return false;
          if (filters.price === "$50 - $100" && (product.price < 50 || product.price > 100)) return false;
          if (filters.price === "$100 - $500" && (product.price < 100 || product.price > 500)) return false;
          if (filters.price === "Above $500" && product.price <= 500) return false;
        }

        // Rating Filter
        if (filters.rating) {
          const minRating = parseInt(filters.rating);
          if (product.rating < minRating) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sort === "price_low_high") return a.price - b.price;
        if (filters.sort === "price_high_low") return b.price - a.price;
        if (filters.sort === "rating_high_low") return b.rating - a.rating;
        return b.id - a.id; // Default "newest" — assuming higher ID = newer
      });
  }, [filters]);

    const handleFilterChange = (filters) => {
    console.log("Active Filters:", filters);
    setFilters(filters)
    // Trigger API call or filter logic here
  };

  return (
    <>
      
      <div className="flex flex-col border-2">
        <h1 className="text-2xl p-2 font-medium text-gray-800">Marketplace | Featured Products</h1>
        <hr />
        <FilterBar categories={categories} brands={brands} ratings={ratings} onFilterChange={handleFilterChange}/>
      </div>

      {/** Product Grid */}
          {loading ? ( 
            <div className="h-[30em]">
            <Loader />
            </div> ): (
            <div className=" grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
              {isFilterActive() ? filteredProducts.map((product) => (
            <GridProductCard product={product} />
          )) : ( products.map((product) => (
            <GridProductCard product={product} />
          )) )}
            </div>
            
        )}
    </>
  );
}

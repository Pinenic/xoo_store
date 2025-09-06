import { Dropdown, DropdownItem, Pagination } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import useProductFilters from "../hooks/useProductFilters";
import { GridProductCard } from "../components/products/ProductCards";
import FilterBar from "../components/marketplace/FilterBar";
import Loader from "../components/global/Loader";
import DealsCarousel from "../components/products/DealsCarousel";
import useMarketplace from "../hooks/uesMarketplace";

export default function Marketplace({ user }) {
  const { categories, brands, ratings } = useProductFilters();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { error, getAllProducts } = useMarketplace();
  //const {products, loading} = useProducts(300)
  const PerPage = 12;
  const indexOfLast = currentPage * PerPage;
  const indexOfFirst = indexOfLast - PerPage;

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: "",
    rating: "",
    sort: "newest",
  });

  //pagination
  const onPageChange = (page) => {setCurrentPage(page); 
      window.scrollTo({ top: 0, behavior: "smooth" });}

  //db products load
  const load = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      console.log(data);
      error ? console.log(error) : setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
        if (filters.category && product.category !== filters.category)
          return false;

        // Brand Filter
        if (filters.brand && product.brand !== filters.brand) return false;

        // Price Filter
        if (filters.price) {
          if (filters.price === "Under $50" && product.price >= 50)
            return false;
          if (
            filters.price === "$50 - $100" &&
            (product.price < 50 || product.price > 100)
          )
            return false;
          if (
            filters.price === "$100 - $500" &&
            (product.price < 100 || product.price > 500)
          )
            return false;
          if (filters.price === "Above $500" && product.price <= 500)
            return false;
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
    setFilters(filters);
    // Trigger API call or filter logic here
  };
  const totalPages = isFilterActive
  ? Math.max(1, Math.ceil(filteredProducts.length / PerPage))
  : Math.max(1, Math.ceil(products.length / PerPage));


  return (
    <>
      <div className="flex flex-col border-2">
        <h1 className="text-2xl p-2 font-medium text-gray-800">
          Marketplace | Featured Products
        </h1>
        <hr />
        {/** Latest Deal carousel */}
        <DealsCarousel user={user} />
        <hr />
        <FilterBar
          categories={categories}
          brands={brands}
          ratings={ratings}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/** Product Grid */}
      {loading ? (
        <div className="h-[30em]">
          <Loader />
        </div>
      ) : (
        <div className=" flex flex-col items-center mb-8">
          <div className=" grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
            {isFilterActive()
              ? filteredProducts.slice(indexOfFirst, indexOfLast).map((product) => (
                  <GridProductCard product={product} />
                ))
              : products.slice(indexOfFirst, indexOfLast).map((product) => (
                  <GridProductCard product={product} />
                ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mx-auto"
          />
        </div>
      )}
    </>
  );
}

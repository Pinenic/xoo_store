import { Drawer, Button, DrawerHeader, Pagination } from "flowbite-react";
import React, { useEffect, useMemo, useState } from "react";
import useProductFilters from "../hooks/useProductFilters";
import { GridProductCard } from "../components/products/ProductCards";
import { SlidersHorizontal } from "lucide-react";
import Loader from "../components/global/Loader";
import DealsCarousel from "../components/products/DealsCarousel";
import useMarketplace from "../hooks/uesMarketplace";
import SearchBar from "../components/global/SearchBar";
import SideFilterBar from "../components/marketplace/SideFilterBar";

export default function Marketplace({ user }) {
  const { categories, brands, ratings } = useProductFilters();
  const [searchResults, setSearchResults] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const { error, getAllProducts } = useMarketplace();
  const [totalPages, setTotalPages] = useState(1);
  const [filterQ, setFilterQ] = useState("")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //const {products, loading} = useProducts(300)

  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    price: "",
    rating: "",
    sort: "newest",
  });

  // load products
  const load = async (page, filterQuery) => {
    setLoading(true);
    try {
      const data = filterQuery !== "" ? await getAllProducts(page, filterQuery) : await getAllProducts(page);
      console.log(data);
      error ? console.log(error) : setProducts(data.Products);
      setTotalPages(data.TotalPages == 0 ? 1 : data.TotalPages);
    } finally {
      setLoading(false);
    }
  };

  // pagination
  const onPageChange = (page) => {
    setCurrentPage(page);
    const el = document.querySelector("#product-grid");
    el.scrollIntoView({ behavior: "smooth" });
  };

  // fetch when currentPage changes
  useEffect(() => {
    load(currentPage, filterQ);
  }, [currentPage, filterQ]);
// Build search query
  const buildQuery = (filters) => {
  const params = new URLSearchParams();
  if (filters.categories.length) params.append("category", filters.categories.join(","));
  if (filters.brands.length) params.append("brands", filters.brands.join(","));
  if (filters.minPrice >= 0) params.append("minprice", filters.minPrice);
  if (filters.maxPrice < Infinity) params.append("maxprice", filters.maxPrice);
  if (filters.rating > 0) params.append("rating", filters.rating);
  return params.toString();
};

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
      // .filter((product) => {
      //   // Category Filter
      //   if (
      //     filters.category?.length &&
      //     !filters.category.includes(product.category)
      //   ) {
      //     return false;
      //   }

      //   // Brand Filter
      //   if (filters.brand?.length && !filters.brand.includes(product.brand)) {
      //     return false;
      //   }

      //   // Price Filter
      //   if (filters.price) {
      //     if (filters.price === "Under $50" && product.price >= 50)
      //       return false;
      //     if (
      //       filters.price === "$50 - $100" &&
      //       (product.price < 50 || product.price > 100)
      //     )
      //       return false;
      //     if (
      //       filters.price === "$100 - $500" &&
      //       (product.price < 100 || product.price > 500)
      //     )
      //       return false;
      //     if (filters.price === "Above $500" && product.price <= 500)
      //       return false;
      //   }

      //   // Rating Filter
      //   if (filters.rating) {
      //     const minRating = parseInt(filters.rating);
      //     if (product.rating < minRating) return false;
      //   }

      //   return true;
      // })
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
  const query = buildQuery(filters);
  console.log(query)
  setFilterQ(query);
    // Trigger API call or filter logic here
  };
  // Determine the products to render
  const displayedProducts =
    searchResults.length > 0
      ? searchResults
      : products || [];

  return (
    <>
      <div className="">
        <h1 className="text-2xl p-2 font-medium text-gray-800">
          Marketplace | Featured Products
        </h1>
        <hr />
        {/** Latest Deal carousel */}
        <DealsCarousel user={user} />
      </div>
      <div className="flex flex-col">
        {/* Sticky Search Bar */}
        <div className="sticky top-[60px] z-40 p-4 bg-white border border-transparent border-t-gray-200 border-b-gray-200 flex justify-between items-center">
          <div className="flex items-center lg:mx-1 gap-2 w-full max-w-2xl mx-auto">
            {/* Search bar takes available space */}
            <SearchBar
              placeholder="Search products..."
              onResults={setSearchResults}
            />

            {/* Filters button stays fixed size */}
            <button
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center gap-1 shrink-0 lg:hidden "
              onClick={() => setIsDrawerOpen(true)}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">Filters</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div
          className="flex flex-col items-center mb-8 scroll-m-[300px] md:scroll-m-[200px]"
          id="product-grid"
        >
          <div className="flex flex-col md:flex-row w-full max-w-7xl">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 p-4 border-r bg-white space-y-6 sticky top-32 h-full">
              <SideFilterBar
                categories={categories}
                brands={brands}
                ratings={ratings}
                onFilterChange={handleFilterChange}
              />
            </aside>

            {/* Drawer for Mobile / Tablet */}
            <Drawer
              placement="left"
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              className="z-50"
            >
              <DrawerHeader>Filters</DrawerHeader>
              <h2 className="p-1 px-3">Filters</h2>
              <div className="w-64 bg-white h-full">
                <SideFilterBar
                  categories={categories}
                  brands={brands}
                  ratings={ratings}
                  onFilterChange={(filter) => {
                    handleFilterChange(filter);
                    setIsDrawerOpen(false); // close drawer after selecting a filter
                  }}
                />
              </div>
            </Drawer>

            {/* Product Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="h-[30em] flex items-center justify-center">
                  <Loader />
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
                  {displayedProducts.length > 0 ? (
                    displayedProducts.map((product) => (
                      <GridProductCard key={product.id} product={product} user={user}/>
                    ))
                  ) : (
                    <div className="col-span-full text-center text-gray-500">
                      No products found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            className="mx-auto mt-4"
          />
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import { Dropdown, DropdownItem, Button } from "flowbite-react";

export default function FilterBar({categories, brands, ratings, onFilterChange }) {
    const defaultFilters = {
    category: "",
    brand: "",
    price: "",
    rating: "",
    sort: "newest",
  };

   const [filters, setFilters] = useState(defaultFilters);


  const priceRanges = ["Under $50", "$50 - $100", "$100 - $500", "Above $500"];
  const sortOptions = [
    { key: "newest", label: "New" },
    { key: "price_low_high", label: "Price ↑" },
    { key: "price_high_low", label: "Price ↓" },
    { key: "rating_high_low", label: "Rating" },
  ];

  const handleChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    if (onFilterChange) onFilterChange(defaultFilters);
  };

  // Check if any filter (except default sort) is active
  const isFilterActive = () => {
    return (
      filters.category !== "" ||
      filters.brand !== "" ||
      filters.price !== "" ||
      filters.rating !== "" ||
      filters.sort !== defaultFilters.sort
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white shadow rounded-lg">
      {/* Category Dropdown */}
      <Dropdown label={filters.category || "Category"} >
        {categories.map((cat) => (
          <DropdownItem key={cat.toString()} onClick={() => handleChange("category", cat.toString())}>
            {cat.toString()}
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Brand Dropdown */}
      <Dropdown label={filters.brand || "Brand"}>
        {brands.map((brand) => (
          <DropdownItem key={brand} onClick={() => handleChange("brand", brand)}>
            {brand}
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Price Dropdown */}
      <Dropdown label={filters.price || "Price"}>
        {priceRanges.map((price) => (
          <DropdownItem key={price.toString()} onClick={() => handleChange("price", price.toString())}>
            {price}
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Rating Dropdown */}
      <Dropdown label={filters.rating || "Rating"}>
        {ratings.map((rating) => (
          <DropdownItem key={rating.toString()} onClick={() => handleChange("rating", rating)}>
            {rating.toString()}
          </DropdownItem>
        ))}
      </Dropdown>

      {/* Sort Toggle Buttons */}
      <div className="flex items-center gap-2">
        <span className="font-medium text-xs">Sort by:</span>
        <div className="flex gap-2">
          {sortOptions.map(({ key, label }) => (
            <Button
              key={key}
              size="xs"
              color={filters.sort === key ? "blue" : "light"}
              onClick={() => handleChange("sort", key)}
              className="rounded-full px-3"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
      {/* Reset Button - Only Show When Filters Are Active */}
      {isFilterActive() && (
        <Button
          size="sm"
          color="failure"
          onClick={handleReset}
          className="ml-auto rounded-full px-4"
        >
          Reset
        </Button>
      )}
    </div>
  );
}

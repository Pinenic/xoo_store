import useProductFilters from "../hooks/useProductFilters.js";

export default function FilterBar({ filters, onFilterChange }) {
  const { categories, brands, ratings } = useProductFilters();

  const handleCheckboxChange = (key, value) => {
    const isActive = filters[key].includes(value);
    const updated = isActive
      ? filters[key].filter((item) => item !== value)
      : [...filters[key], value];
    onFilterChange(key, updated);
  };

  const renderCheckboxes = (label, items, key) => (
    <div style={{ marginRight: "2rem" }}>
      <strong>{label}</strong>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "0.5rem", height: "180px", overflow: "scroll"}}>
        {items.map((item) => (
          <label key={`${key}-${encodeURIComponent(item)}`} style={{ marginBottom: "0.25rem", border: "solid 1px #ddd", padding: "0.25rem", borderRadius: "5px", display: "flex" }}>
            <input
              type="checkbox"
              value={item}
              checked={filters[key].includes(item)}
              onChange={() => handleCheckboxChange(key, item)}
            />
            {" "}{item}
          </label>
        ))}
      </div>
    </div>
  );
  

  return (
    <div style={{ display: "flex",flexDirection: "column", gap: "2rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
      {renderCheckboxes("Categories", categories.map((r) => r.toString()), "category")}
      {renderCheckboxes("Brands", brands.map(String), "brand")}
      {renderCheckboxes("Ratings", ratings.map((r) => r.toString()), "rating")}
    </div>
  );
}

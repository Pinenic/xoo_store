import React, {useState, useEffect} from 'react'
//styles for the component
import '../styles/components.modules.css'
import { Icons } from '../assets/IconLibrary' 
import useProducts from "../hooks/useProducts";
import FilterBar from './filterBar.jsx'

export default function ProductListing() {
  const { products, loading, error } = useProducts(150); // fetch 8 products
  const [filters, setFilters] = useState({
    category: [],
    brand: [],
    rating: [],
  });
  const [filtered, setFiltered] = useState([]);

  const handleFilterChange = (key, values) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  };

  useEffect(() => {
    let result = [...products];

    if (filters.category.length > 0) {
      result = result.filter((p) => filters.category.includes(p.category));
    }

    if (filters.brand.length > 0) {
      result = result.filter((p) => filters.brand.includes(p.brand));
    }

    if (filters.rating.length > 0) {
      result = result.filter((p) =>
        filters.rating.some((r) => Math.floor(p.rating) >= parseInt(r))
      );
    }

    setFiltered(result);
  }, [filters, products]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <FilterBar filters={filters} onFilterChange={handleFilterChange} />
    <div style={{
        display: "flex",
        flexDirection: "column",
        width: "80%"
    }}>
        <div style={{
            height: "30px",
            border: "solid",
            display: "flex"
        }}>
            {filters.category ? filters.category.map((f) => (<div style={{
                border: "solid"
            }}> {f} </div>)) : <p> No active filters</p> }
        </div>
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "1.5rem",
      }}
    >
      {filtered.map((product) => (
        <div
          key={product.id}
          style={{
            height: "320px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "6px" }}
          />
          <h3 style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>{product.title}</h3>
          <p style={{ fontWeight: "bold", margin: "0.5rem 0" }}>${product.price}</p>
          <p style={{ fontSize: "0.9rem", color: "#555" }}>
            {product.description.length > 80
              ? product.description.slice(0, 80) + "..."
              : product.description}
          </p>
        </div>
      ))}
    </div>
    </div>
    </>
  );
}

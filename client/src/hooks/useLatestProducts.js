import { useEffect, useState } from "react";

export default function useLatestProducts(limit = 10) {
  const [latestProducts, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`https://xoo-store.onrender.com/api/v1/products/latest/first?limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data.products);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [limit]);

  return { latestProducts, loading, error };
}

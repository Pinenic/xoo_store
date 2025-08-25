import { useState, useEffect } from 'react';

// A custom hook to fetch a single product by its ID
const useProduct = (productId) => {
  // State variables for the product data, loading status, and any errors
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if a valid product ID is provided
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      // Start the loading state
      setLoading(true);
      setError(null);
      try {
        // Construct the API URL with the provided product ID
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (e) {
        // Set the error state if the fetch fails
        setError(e.message);
      } finally {
        // End the loading state, regardless of success or failure
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // The effect re-runs whenever the productId changes

  // Return the state variables for the component to use
  return { product, loading, error };
};

export default useProduct
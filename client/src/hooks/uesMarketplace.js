import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useMarketplace = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Utility function for API calls
  const apiCall = useCallback(async (method, url, data = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


// product endpoints
  const getAllProducts = useCallback(( limit) => apiCall("get", `/products?limit=${limit}`), [apiCall]);
  const getProductById = useCallback(( id) => apiCall("get", `/products/${id}`), [apiCall]);
  const getLatestProducts = useCallback(( limit) => apiCall("get", `/products?limit=${limit}`), [apiCall]);

  return {
    loading,
    error,
    getAllProducts,
    getProductById,
    getLatestProducts
  };
}
export default useMarketplace;
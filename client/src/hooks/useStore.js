import { useState, useCallback } from "react";
import axiosInstance from "../api/axiosInstance";

const useStoreApi = () => {
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
      setError(err.response?.data?.error || "Something went wrong");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Store endpoints
  const createStore = useCallback((storeData) => apiCall("post", "/stores", storeData), [apiCall]);
  const updateStoreInfo = useCallback((storeId, info) => apiCall("put", `/stores/${storeId}`, info), [apiCall]);
  const getStoreDetails = useCallback((storeId) => apiCall("get", `/stores/${storeId}`), [apiCall]);

  // Inventory endpoints
  const addInventoryItem = useCallback(( productData) => apiCall("post", `/products`, productData), [apiCall]);
  const updateInventoryItem = useCallback(( productId, productData) => apiCall("put", `/products/${productId}`, productData), [apiCall]);
  const deleteInventoryItem = useCallback(( productId) => apiCall("delete", `/products/${productId}`), [apiCall]);
  const getInventory = useCallback((storeId) => apiCall("get", `/products/store/${storeId}`), [apiCall]);

  return {
    loading,
    error,
    createStore,
    updateStoreInfo,
    getStoreDetails,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getInventory,
  };
};

export default useStoreApi;

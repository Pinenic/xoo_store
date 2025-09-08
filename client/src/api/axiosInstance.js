import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://xoo-store.onrender.com/api/v1", // Replace with your base URL
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Optional: Interceptor for adding tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

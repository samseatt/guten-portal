import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000", // Base API URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (For Adding Auth Token in Future)
api.interceptors.request.use(
  (config) => {
    // Example: Add JWT token if we implement authentication later
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (For Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

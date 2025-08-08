import axios from "axios";

// Create an Axios instance with base settings
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Flask backend URL
});

// Request interceptor to attach token
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

// Optional: Response interceptor to catch 401 errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized - maybe redirect to login");
      // Example: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

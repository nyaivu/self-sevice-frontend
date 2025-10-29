import axios from "axios";
import { useSessionStore } from "@/stores/sessionStore";

export const axiosInstance = axios.create({
  // Use environment variable for base URL, with a fallback
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    Accept: "application/json",
  },
  // Set timeout for requests
  timeout: 10000,
});

// --- Request Interceptor ---
// This runs BEFORE each request is sent
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the current state directly from the store
    const { isLoggedIn, accessToken } = useSessionStore.getState();

    // If the user is logged in and has a token, add it to the header
    if (isLoggedIn && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Special handling for FormData (e.g., image uploads)
    // Axios will automatically set the 'Content-Type' to 'multipart/form-data'
    // if the data is an instance of FormData, so we remove our default 'application/json'
    // if it's present and we're sending FormData.
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

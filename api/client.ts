import { getAccessToken } from "@/utils/storage";
import axios from "axios";

const API_BASE_URL = "http://192.168.101.2:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach access token to each request
api.interceptors.request.use(
  async (config) => {
    if (
      config.url?.includes("/accounts/v1/login/") ||
      config.url?.includes("/accounts/v1/token/refresh/")
    ) {
      config.headers["X-Client"] = "react-native";
      return config;
    }
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["X-Client"] = "react-native";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

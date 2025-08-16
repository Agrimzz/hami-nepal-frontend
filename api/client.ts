import { getAccessToken } from "@/utils/storage";
import axios from "axios";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL + "/api";

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
    if (config.url?.includes("/filehandler/v1/upload/")) {
      config.headers["Content-Type"] = "multipart/form-data";
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

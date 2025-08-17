import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/utils/storage";
import { router } from "expo-router";
import { Alert } from "react-native";
import { api } from "./client";

export const apiHandler = async (requestFn: () => Promise<any>) => {
  try {
    const response = await requestFn();
    return response;
  } catch (error: any) {
    if (
      error.response?.status === 401 &&
      !error.config?.url?.includes("/accounts/v1/login/")
    ) {
      console.log("Session expired. Refreshing token...");
      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        // Call refresh endpoint, adjust payload/response as needed
        const refreshRes = await api.post("/accounts/v1/token/refresh/", {
          refresh: refreshToken,
        });
        const { access, refresh } = refreshRes.data;
        await saveTokens(access, refresh);

        // Retry original request with new access token
        const newAccessToken = await getAccessToken();
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return await api.request(error.config);
      } catch (refreshError: any) {
        await clearTokens();
        Alert.alert("Error", "Session expired. Please log in again.");
        router.replace("/");
        throw new Error("Session expired. Please log in again.");
      }
    }
    throw error;
  }
};

import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "access_token";

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem("access_token");
  } catch (err) {
    return null;
  }
};
export const clearToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

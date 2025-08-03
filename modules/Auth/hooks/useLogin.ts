import { login, LoginPayload } from "@/api/auth";
import { saveToken } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";
// import { saveToken } from "@/utils/storage";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      await saveToken(data.access);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      throw new Error(message);
    },
  });
};

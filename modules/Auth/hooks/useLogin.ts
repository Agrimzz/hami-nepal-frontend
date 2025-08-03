import { login, LoginPayload } from "@/api/auth";
import { saveTokens } from "@/utils/storage";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: async (data) => {
      // Assuming backend returns { access, refresh }
      await saveTokens(data.access, data.refresh);
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Login failed";
      throw new Error(message);
    },
  });
};

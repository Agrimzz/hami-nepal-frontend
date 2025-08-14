// modules/causes/hooks/useCreateCause.ts
import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { UserSchema } from "../form/userSchema";

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: UserSchema) => {
      const response = await api.post("/accounts/v1/users/", data);
      return response.data;
    },
  });
};

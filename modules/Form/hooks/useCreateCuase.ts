// modules/causes/hooks/useCreateCause.ts
import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { CauseSchema } from "../Cause/causeSchema";

export const useCreateCause = () => {
  return useMutation({
    mutationFn: async (data: CauseSchema) => {
      const response = await api.post("/api/causes/v1/causes/", data);
      return response.data;
    },
  });
};

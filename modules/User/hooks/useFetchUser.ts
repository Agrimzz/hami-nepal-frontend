import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await api.get("/accounts/v1/users/");
      return response.data?.results ?? response.data;
    },
  });
};

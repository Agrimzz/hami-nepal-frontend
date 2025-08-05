import { api } from "@/api/client";
import { useQuery } from "@tanstack/react-query";

export const useFetchCauses = () => {
  return useQuery({
    queryKey: ["causes"],
    queryFn: async () => {
      const response = await api.get("/causes/v1/causes/");
      return response.data?.results ?? response.data;
    },
  });
};

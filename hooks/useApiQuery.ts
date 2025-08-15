import { apiHandler } from "@/api/apiHandler";
import { api } from "@/api/client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export function useApiQuery<T = unknown>(
  key: string | any[],
  endpoint: string,
  options?: UseQueryOptions<T>
) {
  return useQuery<T>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: async () => {
      const response = await apiHandler(() => api.get(endpoint));
      return response.data?.results ?? response.data;
    },
    ...options,
  });
}

import { apiHandler } from "@/api/apiHandler";
import { api } from "@/api/client";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

type Method = "post" | "put" | "patch" | "delete";

export function useApiMutation<T = unknown, D = any>(
  method: Method,
  endpoint: string,
  options?: UseMutationOptions<T, any, D>
) {
  return useMutation<T, any, D>({
    mutationFn: async (data: D) => {
      const response = await apiHandler(() =>
        api[method](endpoint, data as any)
      );
      return response.data;
    },
    ...options,
  });
}

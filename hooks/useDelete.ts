import { apiHandler } from "@/api/apiHandler";
import { api } from "@/api/client";
import { useQueryClient } from "@tanstack/react-query";
import { useApiMutation } from "./useApiMutation";

export function useDelete(baseEndpoint: string, queryKey?: string[]) {
  const queryClient = useQueryClient();

  return useApiMutation<void, number>("delete", baseEndpoint, {
    mutationFn: async (id: number) => {
      const response = await apiHandler(() =>
        api.delete(`${baseEndpoint}${id}/`)
      );
      return response.data;
    },
    onSuccess: () => {
      if (queryKey) queryClient.invalidateQueries({ queryKey });
    },
  });
}

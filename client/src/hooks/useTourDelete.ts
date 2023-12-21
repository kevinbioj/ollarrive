import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteTourById } from "~/api/tours";

export function useTourDelete(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTourById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDelivererById } from "~/api/deliverers";

export function useDelivererDelete(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDelivererById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverers"] });
    },
  });
}

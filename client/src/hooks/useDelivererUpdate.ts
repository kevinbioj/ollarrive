import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateDelivererRequest, updateDelivererById } from "~/api/deliverers";

export function useDelivererUpdate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDelivererRequest) => updateDelivererById(id, body),
    onSuccess: (deliverer) => {
      queryClient.setQueryData(["deliverers", id], deliverer);
    },
  });
}

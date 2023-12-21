import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateDelivererRequest, createDeliverer } from "~/api/deliverers";

export function useDelivererCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDelivererRequest) => createDeliverer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverers"] });
    },
  });
}

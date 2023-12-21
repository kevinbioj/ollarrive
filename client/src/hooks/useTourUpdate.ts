import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UpdateTourRequest, updateTourById } from "~/api/tours";

export function useTourUpdate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateTourRequest) => updateTourById(id, body),
    onSuccess: (tour) => {
      queryClient.setQueryData(["tours", id], tour);
    },
  });
}

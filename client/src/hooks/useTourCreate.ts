import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CreateTourRequest, createTour } from "~/api/tours";

export function useTourCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTourRequest) => createTour(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

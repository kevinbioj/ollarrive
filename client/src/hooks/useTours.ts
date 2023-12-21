import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CreateTourRequest,
  FindToursRequest,
  UpdateTourRequest,
  createTour,
  deleteTourById,
  findTourById,
  findTours,
  updateTourById,
} from "~/api/tours";

export function useSearchTours(searchParams: FindToursRequest) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["tours", searchParams],
    queryFn: () => findTours(searchParams),
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateTourRequest) => createTour(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

export function useTourById(id: string) {
  return useQuery({
    queryKey: ["tours", id],
    queryFn: () => findTourById(id),
  });
}

export function useUpdateTourById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateTourRequest) => updateTourById(id, body),
    onSuccess: (tour) => {
      queryClient.setQueryData(["tours", id], tour);
    },
  });
}

export function useDeleteTourById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteTourById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tours"] });
    },
  });
}

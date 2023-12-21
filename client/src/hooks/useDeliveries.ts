import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CreateDeliveryRequest,
  FindDeliveriesRequest,
  UpdateDeliveryRequest,
  createDelivery,
  deleteDeliveryById,
  findDeliveryById,
  findDeliveries,
  updateDeliveryById,
} from "~/api/deliveries";

export function useSearchDeliveries(searchParams: FindDeliveriesRequest) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["deliveries", searchParams],
    queryFn: () => findDeliveries(searchParams),
  });
}

export function useCreateDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDeliveryRequest) => createDelivery(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

export function useDeliveryById(id: string) {
  return useQuery({
    queryKey: ["deliveries", id],
    queryFn: () => findDeliveryById(id),
  });
}

export function useUpdateDeliveryById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDeliveryRequest) => updateDeliveryById(id, body),
    onSuccess: (tour) => {
      queryClient.setQueryData(["deliveries", id], tour);
    },
  });
}

export function useDeleteDeliveryById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDeliveryById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliveries"] });
    },
  });
}

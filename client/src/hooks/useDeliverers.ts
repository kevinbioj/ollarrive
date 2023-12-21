import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CreateDelivererRequest,
  FindDeliverersRequest,
  UpdateDelivererRequest,
  createDeliverer,
  deleteDelivererById,
  findDelivererById,
  findDeliverers,
  updateDelivererById,
} from "~/api/deliverers";

export function useSearchDeliverers(searchParams: FindDeliverersRequest) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["deliverers", searchParams],
    queryFn: () => findDeliverers(searchParams),
  });
}

export function useCreateDeliverer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDelivererRequest) => createDeliverer(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverers"] });
    },
  });
}

export function useDelivererById(id: string) {
  return useQuery({
    queryKey: ["deliverers", id],
    queryFn: () => findDelivererById(id),
  });
}

export function useUpdateDelivererById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateDelivererRequest) => updateDelivererById(id, body),
    onSuccess: (deliverer) => {
      queryClient.setQueryData(["deliverers", id], deliverer);
    },
  });
}

export function useDeleteDelivererById(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteDelivererById(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deliverers"] });
    },
  });
}

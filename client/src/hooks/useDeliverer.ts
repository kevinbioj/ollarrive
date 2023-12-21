import { useQuery } from "@tanstack/react-query";
import { findDelivererById } from "~/api/deliverers";

export function useDeliverer(id: string) {
  return useQuery({
    queryKey: ["deliverers", id],
    queryFn: () => findDelivererById(id),
  });
}

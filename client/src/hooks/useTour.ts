import { useQuery } from "@tanstack/react-query";

import { findTourById } from "~/api/tours";

export function useTour(id: string) {
  return useQuery({
    queryKey: ["tours", id],
    queryFn: () => findTourById(id),
  });
}

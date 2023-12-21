import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { FindToursRequest, findTours } from "~/api/tours";

export function useTourSearch(searchParams: FindToursRequest) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["tours", searchParams],
    queryFn: () => findTours(searchParams),
  });
}

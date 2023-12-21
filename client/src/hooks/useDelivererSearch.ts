import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { FindDeliverersRequest, findDeliverers } from "~/api/deliverers";

export function useDelivererSearch(searchParams: FindDeliverersRequest) {
  return useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["deliverers", searchParams],
    queryFn: () => findDeliverers(searchParams),
  });
}

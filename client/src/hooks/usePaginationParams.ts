import {
  QueryParamConfig,
  createEnumParam,
  decodeNumber,
  encodeNumber,
  useQueryParams,
  withDefault,
} from "use-query-params";

const RangeNumberParam = (min: number, max: number) => ({
  encode: (input: number | null | undefined) => encodeNumber(input),
  decode: (input: string | (string | null)[] | null | undefined) => {
    const parsed = decodeNumber(input);
    if (typeof parsed === "undefined") return undefined;
    if (parsed === null) return null;
    if (parsed < min || parsed > max) return null;
    return parsed;
  },
});

type UsePaginationParamsProps<SC extends string[] = string[]> = {
  initialItemsPerPage?: number;
  sortableColumns: SC;
};

export function usePaginationParams<SC extends string[]>({
  initialItemsPerPage = 5,
  sortableColumns,
}: UsePaginationParamsProps<SC>) {
  return useQueryParams(
    {
      sortBy: withDefault(
        createEnumParam(sortableColumns),
        sortableColumns[0],
        true
      ) as QueryParamConfig<string | null | undefined, SC[number]>,
      sortOrder: withDefault(
        createEnumParam(["asc", "desc"] as const),
        "asc",
        true
      ) as QueryParamConfig<string | null | undefined, "asc" | "desc">,
      page: withDefault(RangeNumberParam(0, Infinity), 0),
      itemsPerPage: withDefault(RangeNumberParam(1, 50), initialItemsPerPage),
    },
    {
      removeDefaultsFromUrl: true,
    }
  );
}

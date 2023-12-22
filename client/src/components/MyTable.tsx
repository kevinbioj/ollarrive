import { ArrowDownward, ArrowUpward, ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  Option,
  Select,
  Sheet,
  SheetProps,
  Table,
  TableProps,
  Typography,
  useTheme,
} from "@mui/joy";
import { useEffect, useState } from "react";

export type SortOrder = "asc" | "desc";

export type PaginationState = { page: number; itemsPerPage: number };

export type SortingState<SC> = { sortBy: SC; sortOrder: "asc" | "desc" };

export type MyTableData<T> = {
  items: T[];
  totalItems: number;
};

export type MyTableColumn<T> = {
  key: string;
  label: string;
  renderHead?: (column: MyTableColumn<T>, sort: SortOrder | null) => React.ReactNode;
  renderData: (row: T) => React.ReactNode;
};

export type MyTableProps<T, SC extends string> = Omit<SheetProps, "onClick"> & {
  columns: MyTableColumn<T>[];
  data?: MyTableData<T>;
  getRowKey: (row: T) => React.Key;
  header?: React.ReactNode;
  itemsPerPageOptions?: number[];
  initialPagination?: PaginationState;
  initialSort?: SortingState<SC>;
  loading?: boolean;
  onClick?: (row: T) => unknown;
  onPaginationUpdate: (pagination: PaginationState) => unknown;
  onSortUpdate: (sort: SortingState<SC>) => unknown;
  sortableColumns?: SC[];
  tableProps?: TableProps;
};

export function MyTable<T, SC extends string>({
  columns,
  sortableColumns = [],
  data,
  getRowKey,
  header,
  itemsPerPageOptions = [5, 10, 25, 50],
  initialPagination = { page: 0, itemsPerPage: itemsPerPageOptions[0] },
  initialSort = { sortBy: sortableColumns[0], sortOrder: "asc" },
  loading,
  onClick,
  onPaginationUpdate,
  onSortUpdate,
  tableProps,
  ...props
}: MyTableProps<T, SC>) {
  const theme = useTheme();
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);
  const [sorting, setSorting] = useState<SortingState<SC>>(initialSort);

  useEffect(() => void onPaginationUpdate(pagination), [onPaginationUpdate, pagination]);
  useEffect(() => void onSortUpdate(sorting), [onSortUpdate, sorting]);

  const itemOffset = pagination.page * pagination.itemsPerPage;
  const pageCount = data ? Math.ceil(data.totalItems / pagination.itemsPerPage) : 1;

  const updateSort = (column: (typeof columns)[number]) => {
    if (sortableColumns.includes(column.key)) {
      const key = column.key;
      setSorting((oldSort) => {
        if (key !== oldSort.sortBy) return { sortBy: key, sortOrder: "asc" };
        return {
          sortBy: key,
          sortOrder: oldSort.sortOrder === "asc" ? "desc" : "asc",
        };
      });
    }
  };

  const defaultRenderHead = (column: (typeof columns)[number], sort: SortOrder | null) => {
    const sortIcon = sort ? (
      sort === "asc" ? (
        <ArrowDownward fontSize="small" sx={{ marginRight: 0.5 }} />
      ) : (
        <ArrowUpward fontSize="small" sx={{ marginRight: 0.5 }} />
      )
    ) : null;
    return sortableColumns.includes(column.key) ? (
      <Button color="neutral" onClick={() => updateSort(column)} size="sm" variant="outlined">
        {sortIcon} {column.label}
      </Button>
    ) : (
      <Typography color="neutral">{column.label}</Typography>
    );
  };

  const middleRowIdx = Math.floor(pagination.itemsPerPage / 2);

  return (
    <Sheet
      {...props}
      sx={{ border: 1, borderColor: "lightgray", borderRadius: 7, overflowX: "auto", ...props.sx }}
    >
      {header}
      <Table hoverRow={!loading} sx={{ tableLayout: "auto" }} {...tableProps}>
        <thead>
          <tr>
            {columns.map((c) => {
              const renderHead = c.renderHead ?? defaultRenderHead;
              return (
                <th key={c.key}>
                  {renderHead(c, c.key === sorting.sortBy ? sorting.sortOrder : null)}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            [...Array(pagination.itemsPerPage)].map((_, idx) => (
              <tr
                key={idx}
                style={{ borderBottom: 0, visibility: idx === middleRowIdx ? "visible" : "hidden" }}
              >
                <td
                  colSpan={columns.length}
                  style={
                    idx === middleRowIdx
                      ? { borderBottomColor: theme.colorSchemes.light.palette.neutral[50] }
                      : {}
                  }
                >
                  {idx === middleRowIdx && (
                    <LinearProgress size="lg" sx={{ maxWidth: "40%", mx: "auto" }} />
                  )}
                </td>
              </tr>
            ))
          ) : (
            <>
              {data?.items.map((row) => {
                return (
                  <Box
                    component="tr"
                    key={getRowKey(row)}
                    onClick={() => onClick?.(row)}
                    sx={{ "&:hover": { cursor: onClick ? "pointer" : "auto" } }}
                  >
                    {columns.map((c) => (
                      <td key={c.key}>{c.renderData(row)}</td>
                    ))}
                  </Box>
                );
              })}
              {(data?.items.length ?? 0) < pagination.itemsPerPage &&
                [...Array(pagination.itemsPerPage - (data?.items.length ?? 0))].map((_, idx) => (
                  <tr key={idx} style={{ visibility: "hidden" }}>
                    <td colSpan={columns.length}></td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </Table>
      <Box display="flex" gap={3} justifyContent="flex-end">
        <Box alignItems="center" display="flex" gap={1}>
          <Select
            onChange={(_, itemsPerPage) => setPagination({ page: 0, itemsPerPage: itemsPerPage! })}
            size="sm"
            value={pagination.itemsPerPage}
            variant="outlined"
          >
            {itemsPerPageOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Select>
          <Typography color="neutral">éléments par page</Typography>
        </Box>
        <Box alignItems="center" display="flex" columnGap={1} justifyContent="center" padding={1}>
          <IconButton
            aria-disabled={pagination.page === 0 ? "true" : "false"}
            onClick={() =>
              setPagination(({ page, itemsPerPage }) => ({
                page: Math.max(0, page - 1),
                itemsPerPage,
              }))
            }
            size="sm"
            variant="outlined"
          >
            <ChevronLeft />
          </IconButton>
          <Typography color="neutral">
            {data ? itemOffset + 1 : 0}-
            {data ? Math.min(data.totalItems, itemOffset + data.items.length) : 0} sur{" "}
            {data?.totalItems ?? 0}
          </Typography>
          <IconButton
            aria-disabled={pagination.page === pageCount - 1 ? "true" : "false"}
            onClick={() =>
              setPagination(({ page, itemsPerPage }) => ({
                page: Math.min(pageCount - 1, page + 1),
                itemsPerPage,
              }))
            }
            size="sm"
            variant="outlined"
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
}

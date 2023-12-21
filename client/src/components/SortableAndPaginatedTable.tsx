import {
  ArrowDownward,
  ArrowUpward,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Option,
  Select,
  Stack,
  Table,
  TableProps,
  Typography,
} from "@mui/joy";

type SortableAndPaginatedTableColumn<T> = {
  key: string;
  label: React.ReactNode;
  render: (row: T) => React.ReactNode;
};

type SortableAndPaginatedTableProps<T extends { id: string }> = Omit<
  TableProps,
  "onClick"
> & {
  columns: SortableAndPaginatedTableColumn<T>[];
  data: T[];
  itemsPerPageOptions?: number[];
  onClick?: (value: T) => unknown;
  onPageChange: (page: number, pageSize: number) => unknown;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => unknown;
  pagination: { page: number; totalPages: number; pageSize: number };
  sort: { by: string; order: "asc" | "desc" };
  totalItems: number;
};

export default function SortableAndPaginatedTable<T extends { id: string }>({
  columns,
  data,
  itemsPerPageOptions = [5, 10, 25, 50],
  onClick,
  onPageChange,
  onSortChange,
  pagination,
  sort,
  totalItems,
  ...props
}: SortableAndPaginatedTableProps<T>) {
  const changeSort = (key: string) => {
    if (key === sort.by) {
      onSortChange(sort.by, sort.order === "asc" ? "desc" : "asc");
    } else {
      onSortChange(key, "asc");
    }
  };
  return (
    <>
      <Table noWrap {...props}>
        <thead>
          <tr>
            {columns.map((c) => (
              <Box
                component="th"
                onClick={() => changeSort(c.key)}
                key={c.key}
                sx={{ "&:hover": { cursor: "pointer" } }}
              >
                {c.label}
                {sort.by === c.key &&
                  (sort.order === "asc" ? (
                    <ArrowDownward fontSize="small" />
                  ) : (
                    <ArrowUpward fontSize="small" />
                  ))}
              </Box>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Box
              component="tr"
              key={row.id}
              onClick={() => onClick?.(row)}
              sx={{ ...(onClick ? { "&:hover": { cursor: "pointer" } } : {}) }}
            >
              {columns.map((col) => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </Box>
          ))}
        </tbody>
      </Table>
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="flex-end"
        gap={2}
        marginTop={2}
      >
        <Typography level="body-sm">{totalItems} éléments au total</Typography>
        <Stack alignItems="center" direction="row" gap={0.5}>
          <Select
            onChange={(_, pageSize) =>
              onPageChange(0, pageSize ?? itemsPerPageOptions[0])
            }
            value={pagination.pageSize}
            variant="plain"
            size="sm"
          >
            {itemsPerPageOptions.map((opt) => (
              <Option key={opt} value={opt}>
                {opt}
              </Option>
            ))}
          </Select>
          <Typography level="body-sm">éléments par page</Typography>
        </Stack>
        <Stack alignItems="center" direction="row" gap={1}>
          <IconButton
            disabled={pagination.page === 0}
            onClick={() =>
              onPageChange(pagination.page - 1, pagination.pageSize)
            }
            size="sm"
          >
            <ChevronLeft />
          </IconButton>
          <Typography level="body-sm">
            {pagination.page + 1} / {pagination.totalPages}
          </Typography>
          <IconButton
            disabled={pagination.page === pagination.totalPages - 1}
            onClick={() =>
              onPageChange(pagination.page + 1, pagination.pageSize)
            }
            size="sm"
          >
            <ChevronRight />
          </IconButton>
        </Stack>
      </Stack>
    </>
  );
}

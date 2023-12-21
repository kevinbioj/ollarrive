import { Add, CloseRounded, KeyboardArrowRight } from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import DelivererCreationModal from "~/components/DelivererCreationModal";
import SortableAndPaginatedTable from "~/components/SortableAndPaginatedTable";
import { useDelivererSearch } from "~/hooks/useDelivererSearch";
import PathConstants from "~/routes";

type DelivererSearchParams = {
  name?: string;
  available?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  page: number;
  limit: number;
  sortBy: "name" | "available" | "createdAt";
  sortOrder: "asc" | "desc";
};

const parseSearchParams = (
  searchParams: URLSearchParams
): DelivererSearchParams => {
  const name = searchParams.get("name");
  const available = searchParams.get("available");
  const createdAfter = searchParams.get("createdAfter");
  const createdBefore = searchParams.get("createdBefore");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  const createdAfterDate = createdAfter === null ? null : dayjs(createdAfter);
  const createdBeforeDate =
    createdBefore === null ? null : dayjs(createdBefore);
  return {
    ...(name !== null && name.trim() !== "" ? { name: name.trim() } : {}),
    ...(available !== null
      ? { available: available === "false" ? false : true }
      : {}),
    ...(createdAfterDate?.isValid()
      ? { createdAfter: createdAfterDate.toISOString() }
      : {}),
    ...(createdBeforeDate?.isValid()
      ? { createdBefore: createdBeforeDate.toISOString() }
      : {}),
    page: Math.max(0, +(page ?? 0), 0),
    limit: Math.min(Math.max(5, +(limit ?? 0)), 50),
    sortBy: (["name", "available", "createdAt"] as const).includes(sortBy)
      ? sortBy
      : "name",
    sortOrder: (["asc", "desc"] as const).includes(sortOrder)
      ? sortOrder
      : "asc",
  };
};

const stringifySearchParams = (parsed: DelivererSearchParams) => {
  const hasName = typeof parsed.name === "string" && parsed.name.trim() !== "";
  const hasAvailability = typeof parsed.available === "boolean";
  return new URLSearchParams({
    ...(hasName ? { name: parsed.name } : {}),
    ...(hasAvailability ? { available: String(parsed.available) } : {}),
    ...(parsed.createdAfter ? { createdAfter: parsed.createdAfter } : {}),
    ...(parsed.createdBefore ? { createdBefore: parsed.createdBefore } : {}),
    page: parsed.page.toString(),
    limit: parsed.limit.toString(),
    sortBy: parsed.sortBy,
    sortOrder: parsed.sortOrder,
  });
};

export default function DelivererListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedSearchParams = parseSearchParams(searchParams);
  const { data: results } = useDelivererSearch(parsedSearchParams);
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des livreurs</Typography>
      </Breadcrumbs>
      <Sheet
        sx={{
          border: 1,
          borderColor: "lightgray",
          borderRadius: 10,
          padding: 1,
        }}
      >
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
        >
          <Stack direction="column">
            <Typography level="title-md">Filtrer les livreurs</Typography>
            <Stack direction="row" gap={2}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={parsedSearchParams.name}
                  onChange={(e) =>
                    setSearchParams(
                      stringifySearchParams({
                        ...parsedSearchParams,
                        name: e.target.value,
                      })
                    )
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Disponibilité</FormLabel>
                <Select
                  onChange={(_, available) =>
                    setSearchParams(
                      stringifySearchParams({
                        ...parsedSearchParams,
                        available: available ?? undefined,
                      })
                    )
                  }
                  placeholder="Peu importe"
                  sx={{ minWidth: 150 }}
                  value={
                    typeof parsedSearchParams.available === "boolean"
                      ? parsedSearchParams.available
                      : null
                  }
                  {...(typeof parsedSearchParams.available === "boolean" && {
                    indicator: null,
                    endDecorator: (
                      <IconButton
                        color="neutral"
                        onClick={() =>
                          setSearchParams(
                            stringifySearchParams({
                              ...parsedSearchParams,
                              available: undefined,
                            })
                          )
                        }
                        onMouseDown={(e) => void e.stopPropagation()}
                        variant="plain"
                      >
                        <CloseRounded fontSize="small" />
                      </IconButton>
                    ),
                  })}
                >
                  <Option value={true}>Oui</Option>
                  <Option value={false}>Non</Option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Création du livreur</FormLabel>
                <DateRangePicker
                  disableFuture
                  localeText={{
                    start: "entre le",
                    end: "et le",
                    clearButtonLabel: "Réinitialiser",
                  }}
                  onChange={(range) =>
                    setSearchParams(
                      stringifySearchParams({
                        ...parsedSearchParams,
                        createdAfter: range[0]?.toISOString() ?? undefined,
                        createdBefore:
                          range[1]
                            ?.add(1, "day")
                            .subtract(1, "second")
                            .toISOString() ?? undefined,
                      })
                    )
                  }
                  slotProps={{
                    actionBar: { actions: ["clear"] },
                    textField: { size: "small" },
                  }}
                  value={[
                    parsedSearchParams.createdAfter
                      ? dayjs(parsedSearchParams.createdAfter)
                      : null,
                    parsedSearchParams.createdBefore
                      ? dayjs(parsedSearchParams.createdBefore)
                      : null,
                  ]}
                />
              </FormControl>
            </Stack>
          </Stack>
          <Button
            onClick={() => setCreationModalOpen(true)}
            startDecorator={<Add />}
          >
            Créer un livreur
          </Button>
        </Stack>
        {results && (
          <SortableAndPaginatedTable
            columns={[
              { key: "name", label: "Nom", render: (r) => r.name },
              {
                key: "available",
                label: "Disponibilité",
                render: (r) => (r.available ? "Oui" : "Non"),
              },
              {
                key: "createdAt",
                label: "Création",
                render: (r) => dayjs(r.createdAt).format("DD/MM/YYYY HH:mm"),
              },
            ]}
            data={results.items}
            hoverRow
            onClick={(row) => navigate(`/deliverers/${row.id}`)}
            onPageChange={(page, limit) =>
              setSearchParams(
                stringifySearchParams({ ...parsedSearchParams, page, limit })
              )
            }
            onSortChange={(sortBy, sortOrder) =>
              setSearchParams(
                stringifySearchParams({
                  ...parsedSearchParams,
                  sortBy: sortBy as "name" | "available" | "createdAt",
                  sortOrder,
                })
              )
            }
            pagination={{
              page: results.page,
              totalPages: results.pageCount,
              pageSize: results.itemsPerPage,
            }}
            sort={{
              by: parsedSearchParams.sortBy,
              order: parsedSearchParams.sortOrder,
            }}
            totalItems={results.totalItems}
          />
        )}
      </Sheet>
      <DelivererCreationModal
        aria-labelledby="Création d'un livreur"
        aria-describedby="Formulaire de création d'un nouveau livreur"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

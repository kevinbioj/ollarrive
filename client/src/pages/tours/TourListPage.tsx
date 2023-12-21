import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { Breadcrumbs, Button, Link, Sheet, Stack, Typography } from "@mui/joy";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import TourCreationModal from "~/components/TourCreationModal";
import SortableAndPaginatedTable from "~/components/SortableAndPaginatedTable";
import PathConstants from "~/routes";
import { useSearchTours } from "~/hooks/useTours";

type TourSearchParams = {
  page: number;
  limit: number;
  sortBy: "name" | "startDate" | "endDate";
  sortOrder: "asc" | "desc";
};

const parseSearchParams = (searchParams: URLSearchParams): TourSearchParams => {
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  return {
    page: Math.max(0, +(page ?? 0), 0),
    limit: Math.min(Math.max(5, +(limit ?? 0)), 50),
    sortBy: (["name", "startDate", "endDate"] as const).includes(sortBy)
      ? sortBy
      : "name",
    sortOrder: (["asc", "desc"] as const).includes(sortOrder)
      ? sortOrder
      : "asc",
  };
};

const stringifySearchParams = (parsed: TourSearchParams) => {
  return new URLSearchParams({
    page: parsed.page.toString(),
    limit: parsed.limit.toString(),
    sortBy: parsed.sortBy,
    sortOrder: parsed.sortOrder,
  });
};

export default function TourListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedSearchParams = parseSearchParams(searchParams);
  const { data: results } = useSearchTours(parsedSearchParams);
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des tournées</Typography>
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
          justifyContent="flex-end"
        >
          <Button
            onClick={() => setCreationModalOpen(true)}
            startDecorator={<Add />}
          >
            Créer une tournée
          </Button>
        </Stack>
        {results && (
          <SortableAndPaginatedTable
            columns={[
              {
                key: "name",
                label: "Nom",
                render: (r) => r.name,
                sortable: true,
              },
              {
                key: "startDate",
                label: "Date de début",
                render: (r) => dayjs(r.startDate).format("DD/MM/YYYY HH:mm"),
                sortable: true,
              },
              {
                key: "endDate",
                label: "Date de fin",
                render: (r) => dayjs(r.endDate).format("DD/MM/YYYY HH:mm"),
                sortable: true,
              },
              {
                key: "deliverer",
                label: "Assignée à",
                render: (r) =>
                  r.deliverer ? (
                    r.deliverer.name
                  ) : (
                    <Typography color="neutral">Personne</Typography>
                  ),
              },
            ]}
            data={results.items}
            hoverRow
            onClick={(row) => navigate(`/tours/${row.id}`)}
            onPageChange={(page, limit) =>
              setSearchParams(
                stringifySearchParams({ ...parsedSearchParams, page, limit })
              )
            }
            onSortChange={(sortBy, sortOrder) =>
              setSearchParams(
                stringifySearchParams({
                  ...parsedSearchParams,
                  sortBy: sortBy as "name" | "startDate" | "endDate",
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
      <TourCreationModal
        aria-labelledby="Création d'un livreur"
        aria-describedby="Formulaire de création d'un nouveau livreur"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

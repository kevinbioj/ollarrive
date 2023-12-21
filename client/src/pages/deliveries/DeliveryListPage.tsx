import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { Breadcrumbs, Button, Link, Sheet, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import {
  Link as RouterLink,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import SortableAndPaginatedTable from "~/components/SortableAndPaginatedTable";
import PathConstants from "~/routes";
import { useSearchDeliveries } from "~/hooks/useDeliveries";
import DeliveryCreationModal from "~/components/DeliveryCreationModal";

type DeliverySearchParams = {
  page: number;
  limit: number;
  sortBy: "pickupAddress" | "deliveryAddress";
  sortOrder: "asc" | "desc";
};

const parseSearchParams = (
  searchParams: URLSearchParams
): DeliverySearchParams => {
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");
  return {
    page: Math.max(0, +(page ?? 0), 0),
    limit: Math.min(Math.max(5, +(limit ?? 0)), 50),
    sortBy: (["pickupAddress", "deliveryAddress"] as const).includes(sortBy)
      ? sortBy
      : "pickupAddress",
    sortOrder: (["asc", "desc"] as const).includes(sortOrder)
      ? sortOrder
      : "asc",
  };
};

const stringifySearchParams = (parsed: DeliverySearchParams) => {
  return new URLSearchParams({
    page: parsed.page.toString(),
    limit: parsed.limit.toString(),
    sortBy: parsed.sortBy,
    sortOrder: parsed.sortOrder,
  });
};

export default function DeliveryListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedSearchParams = parseSearchParams(searchParams);
  const { data: results } = useSearchDeliveries(parsedSearchParams);
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des livraisons</Typography>
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
            Créer une livraison
          </Button>
        </Stack>
        {results && (
          <SortableAndPaginatedTable
            columns={[
              {
                key: "pickupAddress",
                label: "Adresse d'enlèvement",
                render: (r) => r.pickupAddress,
                sortable: true,
              },
              {
                key: "deliveryAddress",
                label: "Adresse de livraison",
                render: (r) => r.deliveryAddress,
                sortable: true,
              },
              {
                key: "tour",
                label: "Tournée",
                render: (r) =>
                  r.tour ? (
                    r.tour.name
                  ) : (
                    <Typography color="neutral">Aucune</Typography>
                  ),
              },
            ]}
            data={results.items}
            hoverRow
            onClick={(row) => navigate(`/deliveries/${row.id}`)}
            onPageChange={(page, limit) =>
              setSearchParams(
                stringifySearchParams({ ...parsedSearchParams, page, limit })
              )
            }
            onSortChange={(sortBy, sortOrder) =>
              setSearchParams(
                stringifySearchParams({
                  ...parsedSearchParams,
                  sortBy: sortBy as "pickupAddress" | "deliveryAddress",
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
      <DeliveryCreationModal
        aria-labelledby="Création d'une livraison"
        aria-describedby="Formulaire de création d'une nouvelle livraison"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { DeliveryDto } from "~/api/@types";
import DeliveryCreationModal from "~/components/DeliveryCreationModal";
import { MyTable, MyTableColumn } from "~/components/MyTable";
import { useSearchDeliveries } from "~/hooks/useDeliveries";
import { usePaginationParams } from "~/hooks/usePaginationParams";
import PathConstants from "~/routes";

const columns: MyTableColumn<DeliveryDto>[] = [
  {
    key: "pickupAddress",
    label: "Adresse d'enlèvement",
    renderData: (r) => r.pickupAddress,
  },
  {
    key: "deliveryAddress",
    label: "Adresse de livraison",
    renderData: (r) => r.deliveryAddress,
  },
  {
    key: "tour",
    label: "Tournée",
    renderData: (r) => (r.tour ? r.tour.name : <Typography color="neutral">Aucune</Typography>),
  },
] as const;

export default function DeliveryListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = usePaginationParams({
    sortableColumns: ["pickupAddress", "deliveryAddress"] as const,
  });
  const { data: results, isLoading } = useSearchDeliveries(searchParams);
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des livraisons</Typography>
      </Breadcrumbs>
      <MyTable
        columns={columns}
        data={results}
        getRowKey={(row) => row.id}
        loading={isLoading}
        header={
          <Stack alignItems="flex-start" direction="row" justifyContent="flex-end" padding={1}>
            <Button onClick={() => setCreationModalOpen(true)} startDecorator={<Add />}>
              Créer une livraison
            </Button>
          </Stack>
        }
        itemsPerPageOptions={[5, 10]}
        onClick={(r) => navigate(`/deliveries/${r.id}`)}
        onPaginationUpdate={(pagination) => setSearchParams((sp) => ({ ...sp, ...pagination }))}
        onSortUpdate={(sort) => setSearchParams((sp) => ({ ...sp, ...sort }))}
        sortableColumns={["pickupAddress", "deliveryAddress"] as const}
      />
      <DeliveryCreationModal
        aria-labelledby="Création d'une livraison"
        aria-describedby="Formulaire de création d'une nouvelle livraison"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

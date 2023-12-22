import { Add, KeyboardArrowRight } from "@mui/icons-material";
import { Breadcrumbs, Button, Link, Stack, Typography } from "@mui/joy";
import dayjs from "dayjs";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { TourDto } from "~/api/@types";
import { MyTable, MyTableColumn } from "~/components/MyTable";
import TourCreationModal from "~/components/TourCreationModal";
import { usePaginationParams } from "~/hooks/usePaginationParams";
import { useSearchTours } from "~/hooks/useTours";
import PathConstants from "~/routes";

const columns: MyTableColumn<TourDto>[] = [
  { key: "name", label: "Nom", renderData: (r) => r.name },
  {
    key: "startDate",
    label: "Date de début",
    renderData: (r) => dayjs(r.startDate).format("DD/MM/YYYY HH:mm"),
  },
  {
    key: "endDate",
    label: "Date de fin",
    renderData: (r) => dayjs(r.endDate).format("DD/MM/YYYY HH:mm"),
  },
  {
    key: "deliverer",
    label: "Assignée à",
    renderData: (r) =>
      r.deliverer ? <>{r.deliverer.name}</> : <Typography color="neutral">Personne</Typography>,
  },
];

export default function TourListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = usePaginationParams({
    sortableColumns: ["name", "startDate", "endDate"] as const,
  });
  const { data: results, isLoading } = useSearchTours(searchParams);
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des tournées</Typography>
      </Breadcrumbs>
      <MyTable
        columns={columns}
        data={results}
        getRowKey={(row) => row.id}
        loading={isLoading}
        header={
          <Stack alignItems="flex-start" direction="row" justifyContent="flex-end" padding={1}>
            <Button onClick={() => setCreationModalOpen(true)} startDecorator={<Add />}>
              Créer une tournée
            </Button>
          </Stack>
        }
        itemsPerPageOptions={[5, 10]}
        onClick={(r) => navigate(`/tours/${r.id}`)}
        onPaginationUpdate={(pagination) => setSearchParams((sp) => ({ ...sp, ...pagination }))}
        onSortUpdate={(sort) => setSearchParams((sp) => ({ ...sp, ...sort }))}
        sortableColumns={["name", "startDate", "endDate"] as const}
      />
      <TourCreationModal
        aria-labelledby="Création d'un livreur"
        aria-describedby="Formulaire de création d'un nouveau livreur"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

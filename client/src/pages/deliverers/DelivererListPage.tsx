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
  Stack,
  Typography,
} from "@mui/joy";
import { DateRangePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  BooleanParam,
  DateTimeParam,
  StringParam,
  useQueryParams,
  withDefault,
} from "use-query-params";
import { DelivererDto } from "~/api/@types";

import DelivererCreationModal from "~/components/DelivererCreationModal";
import { MyTable, MyTableColumn } from "~/components/MyTable";
import { useSearchDeliverers } from "~/hooks/useDeliverers";
import { usePaginationParams } from "~/hooks/usePaginationParams";
import PathConstants from "~/routes";

const columns: MyTableColumn<DelivererDto>[] = [
  { key: "name", label: "Nom", renderData: (r) => r.name },
  { key: "available", label: "Disponibilité", renderData: (r) => (r.available ? "Oui" : "Non") },
  {
    key: "createdAt",
    label: "Date de création",
    renderData: (r) => dayjs(r.createdAt).format("DD/MM/YYYY HH:mm"),
  },
];

const filterParamsSchema = {
  name: withDefault(StringParam, null),
  available: withDefault(BooleanParam, null),
  createdAfter: withDefault(DateTimeParam, null),
  createdBefore: withDefault(DateTimeParam, null),
};

export default function DelivererListPage() {
  const navigate = useNavigate();
  const [filterParams, setFilterParams] = useQueryParams(filterParamsSchema);
  const [paginationParams, setPaginationParams] = usePaginationParams({
    sortableColumns: ["name", "available", "createdAt"] as const,
  });
  const { data: results, isLoading } = useSearchDeliverers({
    ...filterParams,
    ...paginationParams,
  });
  const [isCreationModalOpen, setCreationModalOpen] = useState(false);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Typography>Gestion des livreurs</Typography>
      </Breadcrumbs>
      <MyTable
        columns={columns}
        data={results}
        getRowKey={(row) => row.id}
        loading={isLoading}
        header={
          <Stack alignItems="flex-start" direction="row" justifyContent="space-between" padding={1}>
            <Stack direction="row" gap={2}>
              <FormControl>
                <FormLabel>Nom</FormLabel>
                <Input
                  value={filterParams.name ?? undefined}
                  onChange={(e) =>
                    setFilterParams((fp) => ({ ...fp, name: e.target.value || null }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Disponibilité</FormLabel>
                <Select
                  onChange={(_, available) => setFilterParams((fp) => ({ ...fp, available }))}
                  placeholder="Peu importe"
                  sx={{ minWidth: 150 }}
                  value={filterParams.available ?? null}
                  {...(filterParams.available !== null && {
                    indicator: null,
                    endDecorator: (
                      <IconButton
                        color="neutral"
                        onClick={() => setFilterParams((fp) => ({ ...fp, available: null }))}
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
                    setFilterParams((fp) => ({
                      ...fp,
                      createdAfter: range[0]?.toDate() ?? null,
                      createdBefore: range[1]?.add(1, "day").subtract(1, "second").toDate() ?? null,
                    }))
                  }
                  slotProps={{
                    actionBar: { actions: ["clear"] },
                    textField: { size: "small" },
                  }}
                  value={[
                    filterParams.createdAfter ? dayjs(filterParams.createdAfter) : null,
                    filterParams.createdBefore ? dayjs(filterParams.createdBefore) : null,
                  ]}
                />
              </FormControl>
            </Stack>
            <Button onClick={() => setCreationModalOpen(true)} startDecorator={<Add />}>
              Créer un livreur
            </Button>
          </Stack>
        }
        itemsPerPageOptions={[5, 10]}
        onClick={(r) => navigate(`/deliverers/${r.id}`)}
        onPaginationUpdate={(pagination) => setPaginationParams((pp) => ({ ...pp, ...pagination }))}
        onSortUpdate={(sort) => setPaginationParams((pp) => ({ ...pp, ...sort }))}
        sortableColumns={["name", "available", "createdAt"] as const}
      />
      <DelivererCreationModal
        aria-labelledby="Création d'un livreur"
        aria-describedby="Formulaire de création d'un nouveau livreur"
        open={isCreationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </>
  );
}

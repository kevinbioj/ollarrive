import { Delete, KeyboardArrowRight } from "@mui/icons-material";
import {
  Breadcrumbs,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  Input,
  Link,
  Stack,
  Typography,
} from "@mui/joy";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { TOUR_NAME_LIMIT } from "~/api/constants";
import { useTour } from "~/hooks/useTour";
import { useTourUpdate } from "~/hooks/useTourUpdate";
import { useTourDelete } from "~/hooks/useTourDelete";
import PathConstants from "~/routes";

export default function TourDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: tour } = useTour(id!);
  const { isPending: isUpdating, mutate: updateTour } = useTourUpdate(id!);
  const { mutate: deleteTour } = useTourDelete(id!);
  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      startDate: dayjs(),
      endDate: dayjs(),
      delivererId: null,
    },
  });
  useEffect(() => {
    if (typeof tour === "undefined") return;
    setValue("name", tour.name);
    setValue("startDate", dayjs(tour.startDate));
    setValue("endDate", dayjs(tour.endDate));
  }, [tour, setValue]);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Link
          color="neutral"
          component={RouterLink}
          to={PathConstants.TOUR_LIST}
        >
          Gestion des tournées
        </Link>
        <Typography>{tour?.name ?? "Chargement en cours..."}</Typography>
      </Breadcrumbs>
      {tour && (
        <Stack component="form" onSubmit={handleSubmit((e) => updateTour(e))}>
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Identifiant</FormLabel>
            <Input defaultValue={tour.id} readOnly variant="soft" />
          </FormControl>
          <FormControl error={!!formState.errors.name} sx={{ marginBottom: 3 }}>
            <FormLabel>Nom</FormLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input placeholder="Jacques" {...field} />}
              rules={{
                maxLength: {
                  value: TOUR_NAME_LIMIT,
                  message: `Longueur maximale de ${TOUR_NAME_LIMIT} caractères`,
                },
                required: {
                  value: true,
                  message: "Champ requis",
                },
              }}
            />
            <FormHelperText>{formState.errors.name?.message}</FormHelperText>
          </FormControl>
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Début de la tournée</FormLabel>
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <DateTimePicker
                  slotProps={{ textField: { size: "small" } }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Fin de la tournée</FormLabel>
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <DateTimePicker
                  slotProps={{ textField: { size: "small" } }}
                  {...field}
                />
              )}
            />
          </FormControl>
          <Stack direction="row" gap={1}>
            <Button
              color="warning"
              fullWidth
              loading={isUpdating}
              type="submit"
            >
              Mettre à jour
            </Button>
            <IconButton
              color="danger"
              onClick={() =>
                deleteTour(undefined, {
                  onSuccess: () => navigate(PathConstants.TOUR_LIST),
                })
              }
              variant="solid"
            >
              <Delete />
            </IconButton>
          </Stack>
        </Stack>
      )}
    </>
  );
}

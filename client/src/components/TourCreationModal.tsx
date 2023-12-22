import { CheckBox } from "@mui/icons-material";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  ModalProps,
  Snackbar,
  Stack,
  Typography,
} from "@mui/joy";
import { DateTimePicker } from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TOUR_NAME_LIMIT } from "~/api/constants";
import { useCreateTour } from "~/hooks/useTours";

type TourCreationModalProps = Omit<ModalProps, "children">;

export default function TourCreationModal({ onClose, ...props }: TourCreationModalProps) {
  const { data, mutate: createTour } = useCreateTour();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      startDate: dayjs().subtract(1, "day"),
      endDate: dayjs(),
    },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  return (
    <>
      <Modal onClose={onClose} {...props}>
        <ModalDialog>
          <Typography level="h3">Création d'une nouvelle tournée</Typography>
          <form
            onSubmit={handleSubmit((e) =>
              createTour(e, {
                onSuccess: () => {
                  onClose?.({}, "closeClick");
                  setSnackbarOpen(true);
                },
              })
            )}
          >
            <FormControl error={!!formState.errors.name} sx={{ marginBottom: 3 }}>
              <FormLabel>Nom</FormLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => <Input placeholder="Tournée de Guiness" {...field} />}
                rules={{
                  maxLength: {
                    value: TOUR_NAME_LIMIT,
                    message: "Longueur maximale de 64 caractères",
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
                  <DateTimePicker slotProps={{ textField: { size: "small" } }} {...field} />
                )}
              />
            </FormControl>
            <FormControl sx={{ marginBottom: 3 }}>
              <FormLabel>Fin de la tournée</FormLabel>
              <Controller
                control={control}
                name="endDate"
                render={({ field }) => (
                  <DateTimePicker slotProps={{ textField: { size: "small" } }} {...field} />
                )}
              />
            </FormControl>
            <Button color="success" fullWidth type="submit">
              Valider
            </Button>
          </form>
        </ModalDialog>
      </Modal>
      <Snackbar
        autoHideDuration={5000}
        color="success"
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      >
        <Stack alignItems="center" direction="row" gap={2}>
          <CheckBox />
          <Stack>
            <Typography level="title-lg">Création réussie</Typography>
            <Typography level="body-md">
              {data?.name} a été ajouté·e à la liste des tournées.
            </Typography>
          </Stack>
        </Stack>
      </Snackbar>
    </>
  );
}

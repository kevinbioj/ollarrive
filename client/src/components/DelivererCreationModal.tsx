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
  Switch,
  Typography,
} from "@mui/joy";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DELIVERER_NAME_LIMIT } from "~/api/constants";
import { useDelivererCreate } from "~/hooks/useDelivererCreate";

type DelivererCreationModalProps = Omit<ModalProps, "children">;

export default function DelivererCreationModal({
  onClose,
  ...props
}: DelivererCreationModalProps) {
  const { data, mutate: createDeliverer } = useDelivererCreate();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: { name: "", available: true },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  return (
    <>
      <Modal onClose={onClose} {...props}>
        <ModalDialog>
          <Typography level="h3">Création d'un nouveau livreur</Typography>
          <form
            onSubmit={handleSubmit((e) =>
              createDeliverer(e, {
                onSuccess: () => {
                  onClose?.({}, "closeClick");
                  setSnackbarOpen(true);
                },
              })
            )}
          >
            <FormControl
              error={!!formState.errors.name}
              sx={{ marginBottom: 3 }}
            >
              <FormLabel>Nom</FormLabel>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <Input placeholder="Jacques" {...field} />
                )}
                rules={{
                  maxLength: {
                    value: DELIVERER_NAME_LIMIT,
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
            <FormControl orientation="horizontal" sx={{ marginBottom: 3 }}>
              <FormLabel>Disponible</FormLabel>
              <Controller
                control={control}
                name="available"
                render={({ field }) => (
                  <Switch checked={field.value} {...field} />
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
              {data?.name} a été ajouté·e à la liste des livreurs.
            </Typography>
          </Stack>
        </Stack>
      </Snackbar>
    </>
  );
}

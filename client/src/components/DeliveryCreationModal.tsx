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
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ADDRESS_LIMIT } from "~/api/constants";
import { useCreateDelivery } from "~/hooks/useDeliveries";

type DeliveryCreationModalProps = Omit<ModalProps, "children">;

export default function DeliveryCreationModal({
  onClose,
  ...props
}: DeliveryCreationModalProps) {
  const { mutate: createDelivery } = useCreateDelivery();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
    },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  return (
    <>
      <Modal onClose={onClose} {...props}>
        <ModalDialog>
          <Typography level="h3">Création d'une nouvelle livraison</Typography>
          <form
            onSubmit={handleSubmit((e) =>
              createDelivery(e, {
                onSuccess: () => {
                  onClose?.({}, "closeClick");
                  setSnackbarOpen(true);
                },
              })
            )}
          >
            <FormControl
              error={!!formState.errors.pickupAddress}
              sx={{ marginBottom: 3 }}
            >
              <FormLabel>Adresse d&apos;enlèvement</FormLabel>
              <Controller
                control={control}
                name="pickupAddress"
                render={({ field }) => (
                  <Input
                    placeholder="3 Avenue du McDonald's 76000 Rouen"
                    {...field}
                  />
                )}
                rules={{
                  maxLength: {
                    value: ADDRESS_LIMIT,
                    message: `Longueur maximale de ${ADDRESS_LIMIT} caractères`,
                  },
                  required: {
                    value: true,
                    message: "Champ requis",
                  },
                }}
              />
              <FormHelperText>
                {formState.errors.pickupAddress?.message}
              </FormHelperText>
            </FormControl>
            <FormControl
              error={!!formState.errors.deliveryAddress}
              sx={{ marginBottom: 3 }}
            >
              <FormLabel>Adresse de livraison</FormLabel>
              <Controller
                control={control}
                name="deliveryAddress"
                render={({ field }) => (
                  <Input
                    placeholder="8 Avenue du Burger King 76600 Petit-Quevilly"
                    {...field}
                  />
                )}
                rules={{
                  maxLength: {
                    value: ADDRESS_LIMIT,
                    message: `Longueur maximale de ${ADDRESS_LIMIT} caractères`,
                  },
                  required: {
                    value: true,
                    message: "Champ requis",
                  },
                }}
              />
              <FormHelperText>
                {formState.errors.deliveryAddress?.message}
              </FormHelperText>
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
              La livraison a été ajoutée à la liste avec succès.
            </Typography>
          </Stack>
        </Stack>
      </Snackbar>
    </>
  );
}

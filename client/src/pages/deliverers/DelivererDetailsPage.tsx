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
  Switch,
  Typography,
} from "@mui/joy";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { DELIVERER_NAME_LIMIT } from "~/api/constants";
import {
  useDeleteDelivererById,
  useDelivererById,
  useUpdateDelivererById,
} from "~/hooks/useDeliverers";
import PathConstants from "~/routes";

export default function DelivererDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: deliverer } = useDelivererById(id!);
  const { isPending: isUpdating, mutate: updateDeliverer } =
    useUpdateDelivererById(id!);
  const { mutate: deleteDeliverer } = useDeleteDelivererById(id!);
  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: { name: "", available: true },
  });
  useEffect(() => {
    if (typeof deliverer === "undefined") return;
    setValue("name", deliverer.name);
    setValue("available", deliverer.available);
  }, [deliverer, setValue]);
  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Link
          color="neutral"
          component={RouterLink}
          to={PathConstants.DELIVERER_LIST}
        >
          Gestion des livreurs
        </Link>
        <Typography>{deliverer?.name ?? "Chargement en cours..."}</Typography>
      </Breadcrumbs>
      {deliverer && (
        <Stack
          component="form"
          onSubmit={handleSubmit((e) => updateDeliverer(e))}
        >
          <FormControl>
            <FormLabel>Identifiant</FormLabel>
            <Input defaultValue={deliverer.id} readOnly variant="soft" />
          </FormControl>
          <FormControl error={!!formState.errors.name} sx={{ marginBottom: 3 }}>
            <FormLabel>Nom</FormLabel>
            <Controller
              control={control}
              name="name"
              render={({ field }) => <Input placeholder="Jacques" {...field} />}
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
                <Switch checked={field.value} size="lg" {...field} />
              )}
            />
          </FormControl>
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Date de création</FormLabel>
            <Input
              defaultValue={dayjs(deliverer.createdAt).format(
                "DD/MM/YYYY HH:mm"
              )}
              readOnly
              variant="soft"
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
                deleteDeliverer(undefined, {
                  onSuccess: () => navigate(PathConstants.DELIVERER_LIST),
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

import { Delete, KeyboardArrowRight } from "@mui/icons-material";
import {
  Box,
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
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import { ADDRESS_LIMIT } from "~/api/constants";
import { findTours } from "~/api/tours";
import AsynchronousAutocomplete from "~/components/AsynchronousAutocomplete";
import {
  useDeleteDeliveryById,
  useDeliveryById,
  useUpdateDeliveryById,
} from "~/hooks/useDeliveries";
import PathConstants from "~/routes";

export default function DeliveryDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: delivery } = useDeliveryById(id!);
  const { isPending: isUpdating, mutate: updateDelivery } = useUpdateDeliveryById(id!);
  const { mutate: deleteDelivery } = useDeleteDeliveryById(id!);
  const { control, formState, handleSubmit, setValue } = useForm<{
    pickupAddress: string;
    deliveryAddress: string;
    tour: { label: string; id: string } | null;
  }>({
    defaultValues: {
      pickupAddress: "",
      deliveryAddress: "",
      tour: null,
    },
  });

  useEffect(() => {
    if (typeof delivery === "undefined") return;
    setValue("pickupAddress", delivery.pickupAddress);
    setValue("deliveryAddress", delivery.deliveryAddress);
    setValue("tour", delivery.tour ? { label: delivery.tour.name, id: delivery.tour.id } : null);
  }, [delivery, setValue]);

  return (
    <>
      <Breadcrumbs separator={<KeyboardArrowRight />}>
        <Link color="neutral" component={RouterLink} to={PathConstants.HOME}>
          Accueil
        </Link>
        <Link color="neutral" component={RouterLink} to={PathConstants.DELIVERY_LIST}>
          Gestion des livraisons
        </Link>
        <Typography>
          {delivery ? (
            <Box alignItems="center" display="flex">
              {delivery.pickupAddress} <KeyboardArrowRight fontSize="small" />{" "}
              {delivery.deliveryAddress}
            </Box>
          ) : (
            "Chargement en cours..."
          )}
        </Typography>
      </Breadcrumbs>
      {delivery && (
        <Stack
          component="form"
          onSubmit={handleSubmit(({ tour, ...data }) =>
            updateDelivery({ ...data, tourId: tour?.id ?? null })
          )}
        >
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Identifiant</FormLabel>
            <Input defaultValue={delivery.id} readOnly variant="soft" />
          </FormControl>
          <FormControl error={!!formState.errors.pickupAddress} sx={{ marginBottom: 3 }}>
            <FormLabel>Adresse d&apos;enlèvement</FormLabel>
            <Controller
              control={control}
              name="pickupAddress"
              render={({ field }) => (
                <Input placeholder="3 Avenue du McDonald's 76000 Rouen" {...field} />
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
            <FormHelperText>{formState.errors.pickupAddress?.message}</FormHelperText>
          </FormControl>
          <FormControl error={!!formState.errors.deliveryAddress} sx={{ marginBottom: 3 }}>
            <FormLabel>Adresse de livraison</FormLabel>
            <Controller
              control={control}
              name="deliveryAddress"
              render={({ field }) => (
                <Input placeholder="8 Avenue du Burger King 76600 Petit-Quevilly" {...field} />
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
            <FormHelperText>{formState.errors.deliveryAddress?.message}</FormHelperText>
          </FormControl>
          <FormControl sx={{ marginBottom: 3 }}>
            <FormLabel>Tournée de rattachement</FormLabel>
            <Controller
              control={control}
              name="tour"
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              render={({ field: { onChange, ref, ...field } }) => (
                <AsynchronousAutocomplete
                  fetchOptions={async (name) => {
                    if (name.length < 3) return [];
                    const results = await findTours({ name });
                    return results.items.map((d) => ({
                      label: d.name,
                      id: d.id,
                    }));
                  }}
                  isOptionEqualToValue={(o1, o2) => o1.id === o2.id}
                  onChange={(_, value) => onChange(value)}
                  {...field}
                />
              )}
            />
          </FormControl>
          <Stack direction="row" gap={1}>
            <Button color="warning" fullWidth loading={isUpdating} type="submit">
              Mettre à jour
            </Button>
            <IconButton
              color="danger"
              onClick={() =>
                deleteDelivery(undefined, {
                  onSuccess: () => navigate(PathConstants.DELIVERY_LIST),
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

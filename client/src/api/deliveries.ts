import { DeliveryDto, SearchResultDto } from "~/api/@types";
import client from "~/api/client";

export type FindDeliveriesRequest = {
  sortBy: "pickupAddress" | "deliveryAddress";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};

export async function findDeliveries(searchParams: FindDeliveriesRequest) {
  const response = await client.get("deliveries", { searchParams });
  return response.json<SearchResultDto<DeliveryDto>>();
}

export type CreateDeliveryRequest = {
  pickupAddress: string;
  deliveryAddress: string;
};

export async function createDelivery(data: CreateDeliveryRequest) {
  const response = await client.post("deliveries", {
    json: data,
  });
  return response.json<DeliveryDto>();
}

export async function findDeliveryById(id: string) {
  const response = await client.get(`deliveries/${id}`);
  return response.json<DeliveryDto>();
}

export type UpdateDeliveryRequest = {
  pickupAddress: string;
  deliveryAddress: string;
  tourId: string | null;
};

export async function updateDeliveryById(
  id: string,
  data: UpdateDeliveryRequest
) {
  const response = await client.put(`deliveries/${id}`, {
    json: data,
  });
  return response.json<DeliveryDto>();
}

export async function deleteDeliveryById(id: string) {
  await client.delete(`deliveries/${id}`);
}

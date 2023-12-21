import { DelivererDto, SearchResultDto } from "~/api/@types";
import client from "~/api/client";

export type FindDeliverersRequest = {
  name?: string;
  available?: boolean;
  createdAfter?: string;
  createdBefore?: string;
  sortBy?: "name" | "available" | "createdAt";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export async function findDeliverers(searchParams: FindDeliverersRequest) {
  const response = await client.get("deliverers", { searchParams });
  return response.json<SearchResultDto<DelivererDto>>();
}

export type CreateDelivererRequest = {
  name: string;
  available: boolean;
};

export async function createDeliverer(data: CreateDelivererRequest) {
  const response = await client.post("deliverers", { json: data });
  return response.json<DelivererDto>();
}

export async function findDelivererById(id: string) {
  const response = await client.get(`deliverers/${id}`);
  return response.json<DelivererDto>();
}

export type UpdateDelivererRequest = {
  name: string;
  available: boolean;
};

export async function updateDelivererById(
  id: string,
  data: UpdateDelivererRequest
) {
  const response = await client.put(`deliverers/${id}`, { json: data });
  return response.json<DelivererDto>();
}

export async function deleteDelivererById(id: string) {
  await client.delete(`deliverers/${id}`);
}

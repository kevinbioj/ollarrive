import dayjs from "dayjs";

import { TourDto, SearchResultDto } from "~/api/@types";
import client from "~/api/client";

export type FindToursRequest = {
  sortBy: "name" | "startDate" | "endDate";
  sortOrder: "asc" | "desc";
  page: number;
  limit: number;
};

export async function findTours(searchParams: FindToursRequest) {
  const response = await client.get("tours", { searchParams });
  return response.json<SearchResultDto<TourDto>>();
}

export type CreateTourRequest = {
  name: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};

export async function createTour(data: CreateTourRequest) {
  const response = await client.post("tours", {
    json: {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    },
  });
  return response.json<TourDto>();
}

export async function findTourById(id: string) {
  const response = await client.get(`tours/${id}`);
  return response.json<TourDto>();
}

export type UpdateTourRequest = {
  name: string;
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  delivererId: string | null;
};

export async function updateTourById(id: string, data: UpdateTourRequest) {
  const response = await client.put(`tours/${id}`, {
    json: {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate.toISOString(),
    },
  });
  return response.json<TourDto>();
}

export async function deleteTourById(id: string) {
  await client.delete(`tours/${id}`);
}

export type SearchResultDto<T> = {
  items: T[];
  page: number;
  pageCount: number;
  itemsPerPage: number;
  totalItems: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};

export type DelivererDto = {
  id: string;
  name: string;
  available: boolean;
  createdAt: string;
};

export type TourDto = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  deliverer: DelivererDto | null;
};

export type DeliveryDto = {
  id: string;
  pickupAddress: string;
  deliveryAddress: string;
  tour: TourDto | null;
};

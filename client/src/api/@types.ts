export type SearchResultDto<T> = {
  items: T[];
  page: number;
  pageCount: number;
  itemsPerPage: number;
  totalItems: number;
};

export type DelivererDto = {
  id: string;
  name: string;
  available: boolean;
  createdAt: string;
};

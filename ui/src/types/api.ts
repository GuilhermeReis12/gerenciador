export type Paginated<T> = {
  results: T[];
  count: number;
  total_pages: number;
  next?: string | null;
  previous?: string | null;
};

export type PaginationParams = {
  page?: number;
  page_size?: number;
};

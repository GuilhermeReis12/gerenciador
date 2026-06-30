import { useCallback, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from 'constants/pagination';

export function usePagination(initialPageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const resetPage = useCallback(() => setPage(1), []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    resetPage,
    handlePageSizeChange,
    params: { page, page_size: pageSize }
  };
}

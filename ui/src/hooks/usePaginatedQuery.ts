import { useCallback, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { api } from 'api/client';
import { parseApiError } from 'api/client';
import { Paginated } from 'types/api';
import { toast } from 'react-toastify';

type UsePaginatedQueryOptions<T> = {
  endpoint: string;
  params?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
  onError?: (message: string) => void;
  initialData?: Paginated<T> | null;
};

export function usePaginatedQuery<T>({
  endpoint,
  params = {},
  enabled = true,
  onError,
  initialData = null
}: UsePaginatedQueryOptions<T>) {
  const [data, setData] = useState<Paginated<T> | null>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    try {
      const config: AxiosRequestConfig = {
        params: Object.fromEntries(
          Object.entries(params).filter(([, value]) => value !== undefined && value !== '')
        )
      };
      const response = await api.get<Paginated<T>>(endpoint, config);
      setData(response.data);
    } catch (error) {
      const message = parseApiError(error).message;
      if (onError) {
        onError(message);
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, enabled, onError, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refresh: fetchData, setData };
}

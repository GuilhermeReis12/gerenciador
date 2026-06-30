import { useCallback, useEffect, useState } from 'react';
import { api } from 'api/client';
import { TarefaMetrics } from 'types/tarefas';

type MetricsScope = 'assigned' | 'team';

export function useTarefaMetrics(scope?: MetricsScope) {
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<TarefaMetrics>('/tarefas/metrics', {
        params: scope ? { scope } : undefined
      });
      setMetrics(response.data);
    } catch {
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { metrics, loading, refresh };
}

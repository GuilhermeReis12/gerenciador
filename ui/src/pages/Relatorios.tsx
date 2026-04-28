import React, { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { api } from '../utils/axios';

type Metric = {
  total: number;
  open: number;
  done: number;
  overdue: number;
  archived: number;
  urgent: number;
};

const RelatoriosPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric | null>(null);

  useEffect(() => {
    const load = async () => {
      const response = await api.get<Metric>('/tarefas/metrics');
      setMetrics(response.data);
    };
    load();
  }, []);

  const completionRate = useMemo(() => {
    if (!metrics?.total) return 0;
    return Math.round((metrics.done / metrics.total) * 100);
  }, [metrics]);

  const overdueRate = useMemo(() => {
    if (!metrics?.total) return 0;
    return Math.round((metrics.overdue / metrics.total) * 100);
  }, [metrics]);

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Relatórios Gerenciais
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Indicadores operacionais para gestão corporativa e tomada de decisão.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} useFlexGap flexWrap="wrap">
        <Card sx={{ minWidth: 240, flex: '1 1 240px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Taxa de conclusão
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {completionRate}%
            </Typography>
            <LinearProgress variant="determinate" value={completionRate} sx={{ mt: 1 }} />
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 240, flex: '1 1 240px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Taxa de atraso
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {overdueRate}%
            </Typography>
            <LinearProgress color="warning" variant="determinate" value={overdueRate} sx={{ mt: 1 }} />
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 240, flex: '1 1 240px' }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Tarefas urgentes
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {metrics?.urgent ?? 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Itens com maior prioridade para ação imediata.
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default RelatoriosPage;


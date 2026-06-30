import React, { useMemo } from 'react';
import { Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { useTarefaMetrics } from 'hooks/useTarefaMetrics';
import { LoadingState } from 'components/feedback/LoadingState';

const RelatoriosPage: React.FC = () => {
  const { metrics, loading } = useTarefaMetrics();

  const completionRate = useMemo(() => {
    if (!metrics?.total) return 0;
    return Math.round((metrics.done / metrics.total) * 100);
  }, [metrics]);

  const overdueRate = useMemo(() => {
    if (!metrics?.total) return 0;
    return Math.round((metrics.overdue / metrics.total) * 100);
  }, [metrics]);

  return (
    <PageContainer>
      <PageHeader
        title="Relatórios Gerenciais"
        description="Indicadores operacionais para gestão corporativa e tomada de decisão."
      />

      {loading && <LoadingState rows={2} height={120} />}

      {!loading && (
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
      )}
    </PageContainer>
  );
};

export default RelatoriosPage;

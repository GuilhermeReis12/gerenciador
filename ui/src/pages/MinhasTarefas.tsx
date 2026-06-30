import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Box, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { api, parseApiError } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { MetricsGrid } from 'components/ui/MetricsGrid';
import { StatusChip } from 'components/ui/StatusChip';
import { PriorityChip } from 'components/ui/PriorityChip';
import { LoadingState } from 'components/feedback/LoadingState';
import { EmptyState } from 'components/feedback/EmptyState';
import { DataPagination } from 'components/tables/DataPagination';
import { usePagination } from 'hooks/usePagination';
import { useTarefaMetrics } from 'hooks/useTarefaMetrics';
import { Paginated, Tarefa, TarefaStatus } from 'types/tarefas';

type StatusTab = 'all' | TarefaStatus | 'overdue';

const MinhasTarefasPage: React.FC = () => {
  const { page, pageSize, setPage } = usePagination(20);
  const { metrics, refresh: refreshMetrics } = useTarefaMetrics('assigned');

  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<StatusTab>('all');
  const [data, setData] = useState<Paginated<Tarefa> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Paginated<Tarefa>>('/tarefas/assigned_to_me', {
        params: { page, page_size: pageSize, arquivada: false, ordering: 'data_limite' }
      });
      setData(response.data);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredTasks = useMemo(() => {
    const tasks = data?.results || [];
    const today = new Date().toISOString().slice(0, 10);
    if (tab === 'overdue') {
      return tasks.filter(
        (task) => task.data_limite && task.data_limite < today && task.status !== 'DONE'
      );
    }
    if (tab === 'all') return tasks;
    return tasks.filter((task) => task.status === tab);
  }, [data, tab]);

  const updateStatus = async (task: Tarefa, action: 'concluir' | 'reabrir' | 'em_andamento') => {
    try {
      await api.post(`/tarefas/${task.id}/${action}`);
      toast.success('Tarefa atualizada.');
      await load();
      await refreshMetrics();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Minhas Tarefas"
        description="Tarefas atribuídas a você. Execute, atualize o status e conclua dentro do prazo."
        gradient
      />

      <MetricsGrid
        items={[
          { label: 'Atribuídas', value: metrics?.total ?? 0, color: '#2563eb' },
          { label: 'Em andamento', value: metrics?.in_progress ?? 0, color: '#0284c7' },
          { label: 'Concluídas', value: metrics?.done ?? 0, color: '#16a34a' },
          { label: 'Atrasadas', value: metrics?.overdue ?? 0, color: '#dc2626' }
        ]}
      />

      <ContentCard>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
          <Tab label="Todas" value="all" />
          <Tab label="A fazer" value="TODO" />
          <Tab label="Em andamento" value="IN_PROGRESS" />
          <Tab label="Concluídas" value="DONE" />
          <Tab label="Atrasadas" value="overdue" />
        </Tabs>

        {loading && <LoadingState variant="linear" />}
        {!loading && filteredTasks.length === 0 && (
          <EmptyState
            title="Nenhuma tarefa atribuída"
            description="Quando alguém atribuir uma tarefa a você, ela aparecerá aqui."
          />
        )}

        <Stack spacing={1.5}>
          {filteredTasks.map((task) => {
            const isOverdue =
              !!task.data_limite &&
              task.data_limite < new Date().toISOString().slice(0, 10) &&
              task.status !== 'DONE';

            return (
              <Box
                key={task.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  borderLeft: '6px solid',
                  borderLeftColor: task.status === 'DONE' ? 'success.main' : isOverdue ? 'error.main' : 'primary.main'
                }}
              >
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                  <div>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {task.titulo}
                    </Typography>
                    {!!task.descricao && (
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {task.descricao}
                      </Typography>
                    )}
                    <Stack direction="row" spacing={1} sx={{ mt: 1.2 }} flexWrap="wrap" useFlexGap>
                      <StatusChip status={task.status} />
                      <PriorityChip prioridade={task.prioridade} />
                      {!!task.data_limite && (
                        <Chip
                          size="small"
                          color={isOverdue ? 'error' : 'default'}
                          variant="outlined"
                          label={`Prazo: ${task.data_limite}`}
                        />
                      )}
                      {!!task.created_by_name && (
                        <Chip size="small" variant="outlined" label={`Criada por ${task.created_by_name}`} />
                      )}
                      {!!task.link && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label="Abrir link"
                          component="a"
                          clickable
                          href={task.link}
                          target="_blank"
                          rel="noreferrer"
                        />
                      )}
                    </Stack>
                  </div>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    {task.status !== 'DONE' && task.status !== 'IN_PROGRESS' && (
                      <Button variant="outlined" onClick={() => updateStatus(task, 'em_andamento')}>
                        Iniciar
                      </Button>
                    )}
                    {task.status !== 'DONE' && (
                      <Button variant="contained" color="success" onClick={() => updateStatus(task, 'concluir')}>
                        Concluir
                      </Button>
                    )}
                    {task.status === 'DONE' && (
                      <Button variant="outlined" onClick={() => updateStatus(task, 'reabrir')}>
                        Reabrir
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Box>
            );
          })}
        </Stack>

        {!!data && data.total_pages > 1 && tab === 'all' && (
          <DataPagination
            page={page}
            totalPages={data.total_pages}
            count={data.count}
            onPageChange={setPage}
          />
        )}
      </ContentCard>
    </PageContainer>
  );
};

export default MinhasTarefasPage;

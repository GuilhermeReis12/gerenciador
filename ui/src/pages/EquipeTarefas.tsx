import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
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
import { AssignableUser, Paginated, Tarefa, TarefaStatus } from 'types/tarefas';

const EquipeTarefasPage: React.FC = () => {
  const { page, pageSize, setPage } = usePagination(20);
  const { metrics } = useTarefaMetrics('team');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Paginated<Tarefa> | null>(null);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<TarefaStatus | ''>('');
  const [assigneeFilter, setAssigneeFilter] = useState<number | ''>('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {
        page,
        page_size: pageSize,
        ordering: '-created_at'
      };
      if (statusFilter) params.status = statusFilter;
      if (assigneeFilter) params.assigned_to = assigneeFilter;

      const [tasksRes, usersRes] = await Promise.all([
        api.get<Paginated<Tarefa>>('/tarefas/team', { params }),
        api.get<AssignableUser[]>('/tarefas/assignable_users')
      ]);
      setData(tasksRes.data);
      setUsers(usersRes.data || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, statusFilter, assigneeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const tasks = useMemo(() => data?.results || [], [data?.results]);

  const groupedByAssignee = useMemo(() => {
    const map = new Map<string, { total: number; done: number }>();
    tasks.forEach((task) => {
      const key = task.assigned_to_name || task.assigned_team_name || 'Sem responsável';
      const current = map.get(key) || { total: 0, done: 0 };
      current.total += 1;
      if (task.status === 'DONE') current.done += 1;
      map.set(key, current);
    });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <PageContainer>
      <PageHeader
        title="Painel da Equipe"
        description="Acompanhe o andamento das tarefas da equipe e veja quem já concluiu as atividades."
        gradient
      />

      <MetricsGrid
        items={[
          { label: 'Total', value: metrics?.total ?? 0 },
          { label: 'Abertas', value: metrics?.open ?? 0 },
          { label: 'Em andamento', value: metrics?.in_progress ?? 0 },
          { label: 'Concluídas', value: metrics?.done ?? 0 },
          { label: 'Atrasadas', value: metrics?.overdue ?? 0 }
        ]}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ContentCard>
            <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Resumo por responsável</Typography>
            <Stack spacing={1}>
              {groupedByAssignee.map(([name, stats]) => (
                <Box
                  key={name}
                  sx={{
                    p: 1.2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography sx={{ fontWeight: 600 }}>{name}</Typography>
                  <Typography color="text.secondary">
                    {stats.done}/{stats.total} concluídas
                  </Typography>
                </Box>
              ))}
              {!groupedByAssignee.length && (
                <Typography color="text.secondary">Nenhuma tarefa atribuída ainda.</Typography>
              )}
            </Stack>
          </ContentCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <ContentCard>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value as TarefaStatus | '');
                    setPage(1);
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="TODO">A fazer</MenuItem>
                  <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
                  <MenuItem value="DONE">Concluída</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Funcionário</InputLabel>
                <Select
                  label="Funcionário"
                  value={assigneeFilter}
                  onChange={(e) => {
                    setAssigneeFilter(e.target.value === '' ? '' : Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {users.map((user) => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.name || user.username}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>

            {loading && <LoadingState variant="linear" />}

            {!loading && !tasks.length && (
              <EmptyState title="Nenhuma tarefa encontrada" description="Ajuste os filtros para ver resultados." />
            )}

            <Stack spacing={1.2}>
              {tasks.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'grey.50'
                  }}
                >
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                    <Box>
                      <Typography sx={{ fontWeight: 700 }}>{task.titulo}</Typography>
                      <Stack direction="row" spacing={0.8} sx={{ mt: 0.8 }} flexWrap="wrap" useFlexGap>
                        <StatusChip status={task.status} />
                        <PriorityChip prioridade={task.prioridade} />
                        {!!task.assigned_to_name && (
                          <Typography variant="caption" color="text.secondary">
                            Responsável: {task.assigned_to_name}
                          </Typography>
                        )}
                        {!!task.data_limite && (
                          <Typography variant="caption" color="text.secondary">
                            Prazo: {task.data_limite}
                          </Typography>
                        )}
                      </Stack>
                    </Box>
                    <Typography
                      sx={{ fontWeight: 700, color: task.status === 'DONE' ? 'success.main' : 'text.secondary' }}
                    >
                      {task.status === 'DONE' ? 'Concluída' : 'Em execução'}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>

            {!!data && (
              <DataPagination
                page={page}
                totalPages={data.total_pages}
                count={data.count}
                onPageChange={setPage}
              />
            )}
          </ContentCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default EquipeTarefasPage;

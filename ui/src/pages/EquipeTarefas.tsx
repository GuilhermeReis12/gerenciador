import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';
import { parseApiError } from '../utils/apiError';
import {
  AssignableUser,
  Paginated,
  Tarefa,
  TarefaMetrics,
  TarefaStatus,
  prioridadeLabel,
  statusLabel
} from '../types/tarefas';

const statusColor: Record<TarefaStatus, 'default' | 'warning' | 'success' | 'info'> = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  DONE: 'success'
};

const EquipeTarefasPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [statusFilter, setStatusFilter] = useState<TarefaStatus | ''>('');
  const [assigneeFilter, setAssigneeFilter] = useState<number | ''>('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page_size: 100, ordering: '-created_at' };
      if (statusFilter) params.status = statusFilter;
      if (assigneeFilter) params.assigned_to = assigneeFilter;

      const [tasksRes, metricsRes, usersRes] = await Promise.all([
        api.get<Paginated<Tarefa>>('/tarefas/team', { params }),
        api.get<TarefaMetrics>('/tarefas/metrics', { params: { scope: 'team' } }),
        api.get<AssignableUser[]>('/tarefas/assignable_users')
      ]);
      setTasks(tasksRes.data.results || []);
      setMetrics(metricsRes.data);
      setUsers(usersRes.data || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, assigneeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const groupedByAssignee = useMemo(() => {
    const map = new Map<string, { total: number; done: number; open: number }>();
    tasks.forEach((task) => {
      const key = task.assigned_to_name || task.assigned_team_name || 'Sem responsável';
      const current = map.get(key) || { total: 0, done: 0, open: 0 };
      current.total += 1;
      if (task.status === 'DONE') current.done += 1;
      else current.open += 1;
      map.set(key, current);
    });
    return Array.from(map.entries());
  }, [tasks]);

  return (
    <Box sx={{ mt: 2 }}>
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Painel da Equipe
          </Typography>
          <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
            Acompanhe o andamento das tarefas da equipe e veja quem já concluiu as atividades.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {[
          { label: 'Total', value: metrics?.total ?? 0 },
          { label: 'Abertas', value: metrics?.open ?? 0 },
          { label: 'Em andamento', value: metrics?.in_progress ?? 0 },
          { label: 'Concluídas', value: metrics?.done ?? 0 },
          { label: 'Atrasadas', value: metrics?.overdue ?? 0 }
        ].map((item) => (
          <Grid item xs={6} md={2.4} key={item.label}>
            <Card>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Resumo por responsável</Typography>
              <Stack spacing={1}>
                {groupedByAssignee.map(([name, stats]) => (
                  <Box
                    key={name}
                    sx={{
                      p: 1.2,
                      borderRadius: 2,
                      border: '1px solid #e8ebf0',
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
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TarefaStatus | '')}
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
                    onChange={(e) =>
                      setAssigneeFilter(e.target.value === '' ? '' : Number(e.target.value))
                    }
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

              {loading && <LinearProgress sx={{ mb: 2 }} />}

              <Stack spacing={1.2}>
                {tasks.map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid #ebedf2',
                      backgroundColor: '#fafbfc'
                    }}
                  >
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Typography sx={{ fontWeight: 700 }}>{task.titulo}</Typography>
                        <Stack direction="row" spacing={0.8} sx={{ mt: 0.8 }} flexWrap="wrap">
                          <Chip size="small" color={statusColor[task.status]} label={statusLabel[task.status]} />
                          <Chip size="small" variant="outlined" label={prioridadeLabel[task.prioridade]} />
                          {!!task.assigned_to_name && (
                            <Chip size="small" variant="outlined" label={`Responsável: ${task.assigned_to_name}`} />
                          )}
                          {!!task.assigned_team_name && (
                            <Chip size="small" variant="outlined" label={`Equipe: ${task.assigned_team_name}`} />
                          )}
                          {!!task.data_limite && (
                            <Chip size="small" variant="outlined" label={`Prazo: ${task.data_limite}`} />
                          )}
                        </Stack>
                      </Box>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: task.status === 'DONE' ? 'success.main' : 'text.secondary'
                        }}
                      >
                        {task.status === 'DONE' ? 'Concluída' : 'Em execução'}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
                {!loading && !tasks.length && (
                  <Typography color="text.secondary">Nenhuma tarefa encontrada para os filtros selecionados.</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EquipeTarefasPage;

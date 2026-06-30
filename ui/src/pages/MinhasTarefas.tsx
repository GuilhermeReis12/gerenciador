import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';
import { parseApiError } from '../utils/apiError';
import {
  Paginated,
  Tarefa,
  TarefaMetrics,
  TarefaStatus,
  prioridadeLabel,
  statusLabel
} from '../types/tarefas';

type StatusTab = 'all' | TarefaStatus | 'overdue';

const statusColor: Record<TarefaStatus, 'default' | 'warning' | 'success' | 'info'> = {
  TODO: 'default',
  IN_PROGRESS: 'info',
  DONE: 'success'
};

const MinhasTarefasPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<StatusTab>('all');
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksRes, metricsRes] = await Promise.all([
        api.get<Paginated<Tarefa>>('/tarefas/assigned_to_me', {
          params: { page_size: 100, arquivada: false, ordering: 'data_limite' }
        }),
        api.get<TarefaMetrics>('/tarefas/metrics', { params: { scope: 'assigned' } })
      ]);
      setTasks(tasksRes.data.results || []);
      setMetrics(metricsRes.data);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (tab === 'overdue') {
      return tasks.filter(
        (task) => task.data_limite && task.data_limite < today && task.status !== 'DONE'
      );
    }
    if (tab === 'all') return tasks;
    return tasks.filter((task) => task.status === tab);
  }, [tasks, tab]);

  const updateStatus = async (task: Tarefa, action: 'concluir' | 'reabrir' | 'em_andamento') => {
    try {
      await api.post(`/tarefas/${task.id}/${action}`);
      toast.success('Tarefa atualizada.');
      await load();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const kpis = [
    { label: 'Atribuídas', value: metrics?.total ?? 0, color: '#1976d2' },
    { label: 'Em andamento', value: metrics?.in_progress ?? 0, color: '#0288d1' },
    { label: 'Concluídas', value: metrics?.done ?? 0, color: '#2e7d32' },
    { label: 'Atrasadas', value: metrics?.overdue ?? 0, color: '#d32f2f' }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: 'white' }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Minhas Tarefas
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 0.5 }}>
            Aqui estão as tarefas atribuídas a você. Execute, atualize o status e conclua dentro do prazo.
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={1.5} sx={{ mb: 2 }}>
        {kpis.map((item) => (
          <Grid item xs={6} md={3} key={item.label}>
            <Card>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: item.color }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card>
        <CardContent>
          <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
            <Tab label="Todas" value="all" />
            <Tab label="A fazer" value="TODO" />
            <Tab label="Em andamento" value="IN_PROGRESS" />
            <Tab label="Concluídas" value="DONE" />
            <Tab label="Atrasadas" value="overdue" />
          </Tabs>

          {loading && <LinearProgress sx={{ mb: 2 }} />}

          {!loading && filteredTasks.length === 0 && (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography sx={{ fontWeight: 700 }}>Nenhuma tarefa atribuída</Typography>
              <Typography color="text.secondary">Quando alguém atribuir uma tarefa a você, ela aparecerá aqui.</Typography>
            </Box>
          )}

          <Stack spacing={1.5}>
            {filteredTasks.map((task) => {
              const isOverdue =
                !!task.data_limite &&
                task.data_limite < new Date().toISOString().slice(0, 10) &&
                task.status !== 'DONE';

              return (
                <Card
                  key={task.id}
                  variant="outlined"
                  sx={{
                    borderLeft: `6px solid ${
                      task.status === 'DONE' ? '#2e7d32' : isOverdue ? '#d32f2f' : '#1976d2'
                    }`
                  }}
                >
                  <CardContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 800 }}>
                          {task.titulo}
                        </Typography>
                        {!!task.descricao && (
                          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                            {task.descricao}
                          </Typography>
                        )}
                        <Stack direction="row" spacing={1} sx={{ mt: 1.2 }} flexWrap="wrap">
                          <Chip size="small" color={statusColor[task.status]} label={statusLabel[task.status]} />
                          <Chip size="small" variant="outlined" label={prioridadeLabel[task.prioridade]} />
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
                      </Box>

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems="flex-start">
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
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default MinhasTarefasPage;

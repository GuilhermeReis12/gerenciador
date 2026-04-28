import React, { useEffect, useMemo, useState } from 'react';
import { LineFooter } from '../components/StoryBook/Modal/ModalStyled';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/axios';

type TarefaMetrics = {
  total: number;
  open: number;
  done: number;
  overdue: number;
  archived: number;
  urgent: number;
};

type Tarefa = {
  id: number;
  titulo: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  prioridade: 'LOW' | 'MEDIUM' | 'HIGH';
  data_limite?: string | null;
};

type Paginated<T> = {
  results: T[];
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);
  const [latestTasks, setLatestTasks] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [metricsResponse, tasksResponse] = await Promise.all([
          api.get<TarefaMetrics>('/tarefas/metrics'),
          api.get<Paginated<Tarefa>>('/tarefas', { params: { page_size: 6, ordering: '-created_at' } })
        ]);
        setMetrics(metricsResponse.data);
        setLatestTasks(tasksResponse.data.results || []);
      } catch (error) {
        // manter home resiliente mesmo sem API disponível
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kpis = useMemo(() => [
    { label: 'Total de tarefas', value: metrics?.total ?? 0 },
    { label: 'Abertas', value: metrics?.open ?? 0 },
    { label: 'Concluídas', value: metrics?.done ?? 0 },
    { label: 'Atrasadas', value: metrics?.overdue ?? 0 },
    { label: 'Urgentes', value: metrics?.urgent ?? 0 }
  ], [metrics]);

  return (
    <main style={{ minHeight: '100vh', padding: '8px 0 24px 0' }}>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 800, mt: 2 }}>
        Gerenciador de Tarefas
      </Typography>

      <Typography sx={{ fontSize: 16, color: '#555', mb: 2 }}>
        Dashboard executivo com visão consolidada da operação.
      </Typography>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }} useFlexGap flexWrap="wrap">
        {loading
          ? (
            <>
              <Skeleton variant="rounded" width={180} height={96} />
              <Skeleton variant="rounded" width={180} height={96} />
              <Skeleton variant="rounded" width={180} height={96} />
            </>
            )
          : kpis.map((kpi) => (
            <Card key={kpi.label} sx={{ minWidth: 180, flex: '1 1 180px' }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {kpi.label}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {kpi.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Tarefas recentes
              </Typography>
              <Button size="small" onClick={() => navigate('/tarefas')}>
                Ver todas
              </Button>
            </Stack>
            <Divider sx={{ mb: 1.5 }} />
            <Stack spacing={1}>
              {latestTasks.map((task) => (
                <Stack
                  key={task.id}
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  sx={{ border: '1px solid #ededed', borderRadius: 2, px: 1.5, py: 1 }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>{task.titulo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prazo: {task.data_limite || 'Não definido'}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label={task.status} />
                    <Chip size="small" variant="outlined" label={`P${task.prioridade}`} />
                  </Stack>
                </Stack>
              ))}
              {!latestTasks.length && !loading && (
                <Typography variant="body2" color="text.secondary">
                  Ainda não existem tarefas cadastradas.
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Ações rápidas
            </Typography>
            <Stack spacing={1.5}>
              <Button fullWidth variant="contained" onClick={() => navigate('/tarefas')}>
                Abrir gestão de tarefas
              </Button>
              <Button fullWidth variant="outlined" onClick={() => navigate('/agenda')}>
                Ver agenda de prazos
              </Button>
              <Button fullWidth variant="outlined" onClick={() => navigate('/relatorios')}>
                Ver relatórios gerenciais
              </Button>
              <Button fullWidth variant="text" onClick={() => navigate('/meu-perfil')}>
                Configurações do perfil
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <LineFooter />
    </main>
  );
};

export default HomePage;
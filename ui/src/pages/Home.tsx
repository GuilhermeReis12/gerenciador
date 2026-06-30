import React, { useEffect, useMemo, useState } from 'react';
import { Button, Divider, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { MetricsGrid } from 'components/ui/MetricsGrid';
import { StatusChip } from 'components/ui/StatusChip';
import { PriorityChip } from 'components/ui/PriorityChip';
import { LoadingState } from 'components/feedback/LoadingState';
import { EmptyState } from 'components/feedback/EmptyState';
import { useTarefaMetrics } from 'hooks/useTarefaMetrics';
import { Paginated, Tarefa } from 'types/tarefas';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, loading: metricsLoading } = useTarefaMetrics();
  const [latestTasks, setLatestTasks] = useState<Tarefa[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      setTasksLoading(true);
      try {
        const response = await api.get<Paginated<Tarefa>>('/tarefas', {
          params: { page_size: 6, ordering: '-created_at' }
        });
        setLatestTasks(response.data.results || []);
      } catch {
        // manter home resiliente
      } finally {
        setTasksLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const kpis = useMemo(
    () => [
      { label: 'Total de tarefas', value: metrics?.total ?? 0 },
      { label: 'Abertas', value: metrics?.open ?? 0 },
      { label: 'Concluídas', value: metrics?.done ?? 0 },
      { label: 'Atrasadas', value: metrics?.overdue ?? 0 },
      { label: 'Urgentes', value: metrics?.urgent ?? 0 }
    ],
    [metrics]
  );

  const loading = metricsLoading || tasksLoading;

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Visão consolidada da operação e ações rápidas."
      />

      <MetricsGrid items={kpis} loading={metricsLoading} />

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <ContentCard>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Tarefas recentes
            </Typography>
            <Button size="small" onClick={() => navigate('/tarefas')}>
              Ver todas
            </Button>
          </Stack>
          <Divider sx={{ mb: 1.5 }} />

          {loading && <LoadingState rows={3} height={56} />}
          {!loading && !latestTasks.length && (
            <EmptyState title="Nenhuma tarefa cadastrada" description="As tarefas mais recentes aparecerão aqui." />
          )}

          <Stack spacing={1}>
            {latestTasks.map((task) => (
              <Stack
                key={task.id}
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, px: 1.5, py: 1 }}
              >
                <div>
                  <Typography sx={{ fontWeight: 600 }}>{task.titulo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prazo: {task.data_limite || 'Não definido'}
                  </Typography>
                </div>
                <Stack direction="row" spacing={1} sx={{ mt: { xs: 1, md: 0 } }}>
                  <StatusChip status={task.status} />
                  <PriorityChip prioridade={task.prioridade} />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </ContentCard>

        <ContentCard>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
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
        </ContentCard>
      </Stack>
    </PageContainer>
  );
};

export default HomePage;

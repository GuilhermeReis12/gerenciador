import React, { useEffect, useMemo, useState } from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import { api } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { StatusChip } from 'components/ui/StatusChip';
import { PriorityChip } from 'components/ui/PriorityChip';
import { LoadingState } from 'components/feedback/LoadingState';
import { EmptyState } from 'components/feedback/EmptyState';
import { Paginated, Tarefa } from 'types/tarefas';
import { MAX_PAGE_SIZE } from 'constants/pagination';

const AgendaPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get<Paginated<Tarefa>>('/tarefas', {
          params: { page_size: MAX_PAGE_SIZE, ordering: 'data_limite', arquivada: false }
        });
        setTarefas(response.data.results || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const grouped = useMemo(() => {
    const map: Record<string, Tarefa[]> = {};
    tarefas.forEach((tarefa) => {
      const key = tarefa.data_limite || 'Sem prazo';
      if (!map[key]) map[key] = [];
      map[key].push(tarefa);
    });
    return Object.entries(map);
  }, [tarefas]);

  return (
    <PageContainer>
      <PageHeader
        title="Agenda de Entregas"
        description="Planejamento por prazo para acompanhamento diário da operação."
      />

      {loading && <LoadingState />}
      {!loading && grouped.length === 0 && (
        <EmptyState
          title="Nenhuma tarefa na agenda"
          description="Cadastre tarefas com data limite para visualizar o cronograma."
        />
      )}

      <Stack spacing={2}>
        {grouped.map(([dateKey, itens]) => (
          <ContentCard key={dateKey}>
            <Typography sx={{ fontWeight: 700 }}>
              {dateKey === 'Sem prazo' ? 'Sem prazo definido' : `Prazo: ${dateKey}`}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1}>
              {itens.map((tarefa) => (
                <Stack
                  key={tarefa.id}
                  direction={{ xs: 'column', md: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', md: 'center' }}
                  spacing={1}
                >
                  <Typography>{tarefa.titulo}</Typography>
                  <Stack direction="row" spacing={1}>
                    <StatusChip status={tarefa.status} />
                    <PriorityChip prioridade={tarefa.prioridade} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </ContentCard>
        ))}
      </Stack>
    </PageContainer>
  );
};

export default AgendaPage;

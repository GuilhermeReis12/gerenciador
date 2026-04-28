import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { api } from '../utils/axios';

type Tarefa = {
  id: number;
  titulo: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  prioridade: 'LOW' | 'MEDIUM' | 'HIGH';
  data_limite?: string | null;
  arquivada: boolean;
};

type Paginated<T> = {
  results: T[];
};

const AgendaPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get<Paginated<Tarefa>>('/tarefas', {
          params: { page_size: 100, ordering: 'data_limite', arquivada: false }
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
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 800 }}>
        Agenda de Entregas
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Planejamento por prazo para acompanhamento diário da operação.
      </Typography>

      {loading && (
        <Stack spacing={1}>
          <Skeleton height={64} />
          <Skeleton height={64} />
          <Skeleton height={64} />
        </Stack>
      )}

      {!loading && grouped.length === 0 && (
        <Card>
          <CardContent>
            <Typography sx={{ fontWeight: 700 }}>Nenhuma tarefa na agenda</Typography>
            <Typography variant="body2" color="text.secondary">
              Cadastre tarefas com data limite para visualizar o cronograma.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Stack spacing={2}>
        {grouped.map(([dateKey, itens]) => (
          <Card key={dateKey}>
            <CardContent>
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
                      <Chip size="small" label={tarefa.status} />
                      <Chip size="small" variant="outlined" label={`Prioridade ${tarefa.prioridade}`} />
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default AgendaPage;


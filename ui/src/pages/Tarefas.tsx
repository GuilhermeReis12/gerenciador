import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';

type TarefaStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
type TarefaPrioridade = 'LOW' | 'MEDIUM' | 'HIGH';
type ArquivadaFilter = 'true' | 'false' | '';

type Tarefa = {
  id: number;
  titulo: string;
  descricao?: string | null;
  status: TarefaStatus;
  prioridade: TarefaPrioridade;
  data_limite?: string | null;
  arquivada: boolean;
};

type Paginated<T> = {
  results: T[];
  count: number;
  total_pages: number;
};

type TarefaMetrics = {
  total: number;
  open: number;
  done: number;
  overdue: number;
  archived: number;
  urgent: number;
};

const statusLabel: Record<TarefaStatus, string> = {
  TODO: 'A fazer',
  IN_PROGRESS: 'Em andamento',
  DONE: 'Concluída'
};

const prioridadeLabel: Record<TarefaPrioridade, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta'
};

const TarefasPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<Paginated<Tarefa> | null>(null);
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TarefaStatus | ''>('');
  const [prioridade, setPrioridade] = useState<TarefaPrioridade | ''>('');
  const [arquivada, setArquivada] = useState<ArquivadaFilter>('');
  const [ordering, setOrdering] = useState('-created_at');

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [editing, setEditing] = useState<Tarefa | null>(null);

  const [filterDraft, setFilterDraft] = useState({
    status: '' as TarefaStatus | '',
    prioridade: '' as TarefaPrioridade | '',
    arquivada: '' as ArquivadaFilter,
    ordering: '-created_at'
  });

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    status: 'TODO' as TarefaStatus,
    prioridade: 'MEDIUM' as TarefaPrioridade,
    data_limite: ''
  });

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, page_size: pageSize, ordering };
    if (q) params.q = q;
    if (status) params.status = status;
    if (prioridade) params.prioridade = prioridade;
    if (arquivada) params.arquivada = arquivada;
    return params;
  }, [page, pageSize, ordering, q, status, prioridade, arquivada]);

  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<Tarefa>>('/tarefas', { params: queryParams });
      setData(res.data);
      setSelectedIds([]);
    } catch {
      toast.error('Nao foi possivel carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await api.get<TarefaMetrics>('/tarefas/metrics');
      setMetrics(res.data);
    } catch {
      // nao bloquear a tela por causa das metricas
    }
  }, []);

  useEffect(() => {
    fetchTarefas();
    fetchMetrics();
  }, [fetchTarefas, fetchMetrics]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      titulo: '',
      descricao: '',
      status: 'TODO',
      prioridade: 'MEDIUM',
      data_limite: ''
    });
    setOpenTaskModal(true);
  };

  const openEdit = (tarefa: Tarefa) => {
    setEditing(tarefa);
    setForm({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || '',
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      data_limite: tarefa.data_limite || ''
    });
    setOpenTaskModal(true);
  };

  const applyFilters = () => {
    setStatus(filterDraft.status);
    setPrioridade(filterDraft.prioridade);
    setArquivada(filterDraft.arquivada);
    setOrdering(filterDraft.ordering);
    setPage(1);
    setOpenFilterModal(false);
  };

  const clearFilters = () => {
    const clean = {
      status: '' as TarefaStatus | '',
      prioridade: '' as TarefaPrioridade | '',
      arquivada: '' as ArquivadaFilter,
      ordering: '-created_at'
    };
    setFilterDraft(clean);
    setStatus('');
    setPrioridade('');
    setArquivada('');
    setOrdering('-created_at');
    setPage(1);
    setOpenFilterModal(false);
  };

  const save = async () => {
    if (!form.titulo.trim()) {
      toast.error('Titulo obrigatorio.');
      return;
    }
    try {
      const payload = {
        ...form,
        data_limite: form.data_limite || null,
        descricao: form.descricao || null
      };
      if (editing) {
        await api.patch(`/tarefas/${editing.id}`, payload);
        toast.success('Tarefa atualizada.');
      } else {
        await api.post('/tarefas', payload);
        toast.success('Tarefa criada.');
      }
      setOpenTaskModal(false);
      await fetchTarefas();
      await fetchMetrics();
    } catch {
      toast.error('Nao foi possivel salvar a tarefa.');
    }
  };

  const concludeOrReopen = async (tarefa: Tarefa) => {
    try {
      if (tarefa.status === 'DONE') {
        await api.post(`/tarefas/${tarefa.id}/reabrir`);
      } else {
        await api.post(`/tarefas/${tarefa.id}/concluir`);
      }
      await fetchTarefas();
      await fetchMetrics();
    } catch {
      toast.error('Nao foi possivel atualizar o status.');
    }
  };

  const archiveOrRestore = async (tarefa: Tarefa) => {
    try {
      if (tarefa.arquivada) {
        await api.post(`/tarefas/${tarefa.id}/desarquivar`);
      } else {
        await api.post(`/tarefas/${tarefa.id}/arquivar`);
      }
      await fetchTarefas();
      await fetchMetrics();
    } catch {
      toast.error('Nao foi possivel atualizar o arquivamento.');
    }
  };

  const remove = async (tarefa: Tarefa) => {
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;
    try {
      await api.delete(`/tarefas/${tarefa.id}`);
      toast.success('Tarefa excluida.');
      await fetchTarefas();
      await fetchMetrics();
    } catch {
      toast.error('Nao foi possivel excluir a tarefa.');
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const bulkUpdate = async (updates: Record<string, any>, successMessage: string) => {
    if (!selectedIds.length) {
      toast.info('Selecione ao menos uma tarefa.');
      return;
    }
    try {
      await api.post('/tarefas/bulk_update', { ids: selectedIds, updates });
      toast.success(successMessage);
      await fetchTarefas();
      await fetchMetrics();
    } catch {
      toast.error('Falha na acao em lote.');
    }
  };

  const filterCount = [status, prioridade, arquivada].filter(Boolean).length;
  const kpis = [
    { label: 'Total', value: metrics?.total ?? 0 },
    { label: 'Abertas', value: metrics?.open ?? 0 },
    { label: 'Concluidas', value: metrics?.done ?? 0 },
    { label: 'Atrasadas', value: metrics?.overdue ?? 0 }
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Gestao de Tarefas
                </Typography>
                <Typography color="text.secondary">
                  Operacao central com visual limpo, foco e produtividade.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" onClick={() => setOpenFilterModal(true)}>
                  Filtros {filterCount > 0 ? `(${filterCount})` : ''}
                </Button>
                <Button variant="contained" onClick={openCreate}>
                  Nova tarefa
                </Button>
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar por titulo ou descricao..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Pagina</InputLabel>
                <Select
                  label="Pagina"
                  value={String(pageSize)}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 1.5 }}>
        {kpis.map((item) => (
          <Card key={item.label} sx={{ minWidth: 140 }}>
            <CardContent sx={{ py: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {item.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
            <Button variant="outlined" onClick={() => bulkUpdate({ status: 'DONE' }, 'Concluidas em lote.')}>
              Concluir selecionadas
            </Button>
            <Button variant="outlined" onClick={() => bulkUpdate({ status: 'TODO' }, 'Reabertas em lote.')}>
              Reabrir selecionadas
            </Button>
            <Button variant="outlined" onClick={() => bulkUpdate({ arquivada: true }, 'Arquivadas em lote.')}>
              Arquivar selecionadas
            </Button>
            {!!selectedIds.length && <Chip label={`${selectedIds.length} selecionada(s)`} color="primary" />}
          </Stack>
          <Divider />

          <Box sx={{ mt: 1.5 }}>
            {loading && (
              <Stack spacing={1}>
                <Skeleton height={68} />
                <Skeleton height={68} />
                <Skeleton height={68} />
              </Stack>
            )}

            {!loading && (data?.results.length || 0) === 0 && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 700 }}>Nenhuma tarefa encontrada</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tente mudar os filtros ou criar uma nova tarefa.
                </Typography>
              </Box>
            )}

            <Stack spacing={1}>
              {data?.results.map((tarefa) => (
                <Box
                  key={tarefa.id}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid #ebedf2',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                    <Checkbox checked={selectedIds.includes(tarefa.id)} onChange={() => toggleSelection(tarefa.id)} />
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {tarefa.titulo}
                      </Typography>
                      <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }} flexWrap="wrap">
                        <Chip size="small" label={statusLabel[tarefa.status]} />
                        <Chip size="small" variant="outlined" label={prioridadeLabel[tarefa.prioridade]} />
                        {!!tarefa.data_limite && <Chip size="small" variant="outlined" label={`Prazo ${tarefa.data_limite}`} />}
                        {tarefa.arquivada && <Chip size="small" color="warning" label="Arquivada" />}
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.8}>
                    <Button size="small" variant="outlined" onClick={() => openEdit(tarefa)}>
                      Editar
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => concludeOrReopen(tarefa)}>
                      {tarefa.status === 'DONE' ? 'Reabrir' : 'Concluir'}
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => archiveOrRestore(tarefa)}>
                      {tarefa.arquivada ? 'Desarquivar' : 'Arquivar'}
                    </Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => remove(tarefa)}>
                      Excluir
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {!!data && data.total_pages > 1 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Pagina {page} de {data.total_pages} - {data.count} registros
              </Typography>
              <Pagination page={page} count={data.total_pages} onChange={(_, value) => setPage(value)} />
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Filtrar tarefas</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={filterDraft.status}
                onChange={(e) => setFilterDraft((prev) => ({ ...prev, status: e.target.value as TarefaStatus | '' }))}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="TODO">A fazer</MenuItem>
                <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
                <MenuItem value="DONE">Concluida</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                label="Prioridade"
                value={filterDraft.prioridade}
                onChange={(e) => setFilterDraft((prev) => ({ ...prev, prioridade: e.target.value as TarefaPrioridade | '' }))}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="LOW">Baixa</MenuItem>
                <MenuItem value="MEDIUM">Media</MenuItem>
                <MenuItem value="HIGH">Alta</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Arquivamento</InputLabel>
              <Select
                label="Arquivamento"
                value={filterDraft.arquivada}
                onChange={(e) => setFilterDraft((prev) => ({ ...prev, arquivada: e.target.value as ArquivadaFilter }))}
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="false">Somente ativas</MenuItem>
                <MenuItem value="true">Somente arquivadas</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Ordenacao</InputLabel>
              <Select
                label="Ordenacao"
                value={filterDraft.ordering}
                onChange={(e) => setFilterDraft((prev) => ({ ...prev, ordering: e.target.value }))}
              >
                <MenuItem value="-created_at">Mais recentes</MenuItem>
                <MenuItem value="created_at">Mais antigas</MenuItem>
                <MenuItem value="data_limite">Prazo mais proximo</MenuItem>
                <MenuItem value="-data_limite">Prazo mais distante</MenuItem>
                <MenuItem value="-prioridade">Maior prioridade</MenuItem>
                <MenuItem value="titulo">Titulo A-Z</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={clearFilters}>Limpar</Button>
          <Button variant="contained" onClick={applyFilters}>
            Aplicar filtros
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openTaskModal} onClose={() => setOpenTaskModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar tarefa' : 'Nova tarefa'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Titulo"
              value={form.titulo}
              onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Descricao"
              value={form.descricao}
              onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm((s) => ({ ...s, status: e.target.value as TarefaStatus }))}
                >
                  <MenuItem value="TODO">A fazer</MenuItem>
                  <MenuItem value="IN_PROGRESS">Em andamento</MenuItem>
                  <MenuItem value="DONE">Concluida</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  label="Prioridade"
                  value={form.prioridade}
                  onChange={(e) => setForm((s) => ({ ...s, prioridade: e.target.value as TarefaPrioridade }))}
                >
                  <MenuItem value="LOW">Baixa</MenuItem>
                  <MenuItem value="MEDIUM">Media</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Data limite"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={form.data_limite}
              onChange={(e) => setForm((s) => ({ ...s, data_limite: e.target.value }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTaskModal(false)}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TarefasPage;


import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
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
  FormHelperText,
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
import { parseApiError } from '../utils/apiError';
import { useCapabilities } from '../hooks/useCapabilities';
import {
  AssignableTeam,
  AssignableUser,
  AssignmentType,
  Paginated,
  Tarefa,
  TarefaMetrics,
  TarefaPrioridade,
  TarefaStatus,
  prioridadeLabel,
  statusLabel
} from '../types/tarefas';

type ArquivadaFilter = 'true' | 'false' | '';
type FormErrors = Record<string, string>;

const emptyForm = {
  titulo: '',
  descricao: '',
  status: 'TODO' as TarefaStatus,
  prioridade: 'MEDIUM' as TarefaPrioridade,
  data_limite: '',
  assignmentType: 'user' as AssignmentType,
  assigned_to: '' as number | '',
  assigned_team: '' as number | '',
  link: ''
};

const TarefasPage: React.FC = () => {
  const { capabilities } = useCapabilities();
  const canCreate = capabilities.can_create_tasks;
  const canManage = capabilities.can_manage_team;
  const canArchive = capabilities.can_archive_tasks;
  const canDelete = capabilities.can_delete_tasks;

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState<Paginated<Tarefa> | null>(null);
  const [metrics, setMetrics] = useState<TarefaMetrics | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [assignableTeams, setAssignableTeams] = useState<AssignableTeam[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

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

  const [form, setForm] = useState(emptyForm);

  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { page, page_size: pageSize, ordering };
    if (q) params.q = q;
    if (status) params.status = status;
    if (prioridade) params.prioridade = prioridade;
    if (arquivada) params.arquivada = arquivada;
    return params;
  }, [page, pageSize, ordering, q, status, prioridade, arquivada]);

  const loadAssignableOptions = useCallback(async () => {
    try {
      const [usersRes, teamsRes] = await Promise.all([
        api.get<AssignableUser[]>('/tarefas/assignable_users'),
        api.get<AssignableTeam[]>('/tarefas/assignable_teams')
      ]);
      setAssignableUsers(usersRes.data || []);
      setAssignableTeams(teamsRes.data || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  }, []);

  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Paginated<Tarefa>>('/tarefas', { params: queryParams });
      setData(res.data);
      setSelectedIds([]);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await api.get<TarefaMetrics>('/tarefas/metrics');
      setMetrics(res.data);
    } catch {
      // keep page usable if metrics fail
    }
  }, []);

  useEffect(() => {
    loadAssignableOptions();
  }, [loadAssignableOptions]);

  useEffect(() => {
    fetchTarefas();
    fetchMetrics();
  }, [fetchTarefas, fetchMetrics]);

  const resolveAssignmentType = (tarefa: Tarefa): AssignmentType => {
    if (tarefa.assigned_to) return 'user';
    if (tarefa.assigned_team) return 'team';
    return 'user';
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormErrors({});
    setOpenTaskModal(true);
  };

  const openEdit = (tarefa: Tarefa) => {
    setEditing(tarefa);
    setForm({
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || '',
      status: tarefa.status,
      prioridade: tarefa.prioridade,
      data_limite: tarefa.data_limite || '',
      assignmentType: resolveAssignmentType(tarefa),
      assigned_to: tarefa.assigned_to || '',
      assigned_team: tarefa.assigned_team || '',
      link: tarefa.link || ''
    });
    setFormErrors({});
    setOpenTaskModal(true);
  };

  const validateForm = () => {
    const errors: FormErrors = {};
    const titulo = form.titulo.trim();
    if (!titulo) {
      errors.titulo = 'O título é obrigatório.';
    } else if (titulo.length < 3) {
      errors.titulo = 'O título deve ter pelo menos 3 caracteres.';
    }
    if (!form.data_limite) {
      errors.data_limite = 'O prazo é obrigatório.';
    }
    if (form.assignmentType === 'user' && !form.assigned_to) {
      errors.assigned_to = 'Selecione um usuário responsável.';
    }
    if (form.assignmentType === 'team' && !form.assigned_team) {
      errors.assigned_team = 'Selecione uma equipe operacional.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const buildPayload = () => ({
    titulo: form.titulo.trim(),
    descricao: form.descricao.trim() || null,
    status: form.status,
    prioridade: form.prioridade,
    data_limite: form.data_limite || null,
    assigned_to: form.assignmentType === 'user' ? form.assigned_to : null,
    link: form.link.trim() || null,
    assigned_team: form.assignmentType === 'team' ? form.assigned_team : null
  });

  const save = async () => {
    if (!canCreate) {
      toast.error('Seu perfil não pode criar tarefas.');
      return;
    }
    if (!validateForm()) return;

    try {
      const payload = buildPayload();
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
    } catch (error) {
      const parsed = parseApiError(error);
      setFormErrors(parsed.fieldErrors);
      toast.error(parsed.message);
    }
  };

  const concludeOrReopen = async (tarefa: Tarefa) => {
    if (!tarefa.can_work) return;
    try {
      if (tarefa.status === 'DONE') {
        await api.post(`/tarefas/${tarefa.id}/reabrir`);
      } else {
        await api.post(`/tarefas/${tarefa.id}/concluir`);
      }
      await fetchTarefas();
      await fetchMetrics();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const archiveOrRestore = async (tarefa: Tarefa) => {
    if (!canArchive) return;
    try {
      if (tarefa.arquivada) {
        await api.post(`/tarefas/${tarefa.id}/desarquivar`);
      } else {
        await api.post(`/tarefas/${tarefa.id}/arquivar`);
      }
      await fetchTarefas();
      await fetchMetrics();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const remove = async (tarefa: Tarefa) => {
    if (!canDelete) return;
    if (!window.confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) return;
    try {
      await api.delete(`/tarefas/${tarefa.id}`);
      toast.success('Tarefa excluída.');
      await fetchTarefas();
      await fetchMetrics();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const bulkUpdate = async (updates: Record<string, unknown>, successMessage: string) => {
    if (!canManage) return;
    if (!selectedIds.length) {
      toast.info('Selecione ao menos uma tarefa.');
      return;
    }
    try {
      await api.post('/tarefas/bulk_update', { ids: selectedIds, updates });
      toast.success(successMessage);
      await fetchTarefas();
      await fetchMetrics();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
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

  const filterCount = [status, prioridade, arquivada].filter(Boolean).length;
  const kpis = [
    { label: 'Total', value: metrics?.total ?? 0 },
    { label: 'Abertas', value: metrics?.open ?? 0 },
    { label: 'Atribuídas a mim', value: metrics?.assigned_to_me ?? 0 },
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
                  Gestão de Tarefas
                </Typography>
                <Typography color="text.secondary">
                  Crie, atribua e acompanhe tarefas com notificações para os responsáveis.
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} alignItems="center">
                <Button variant="outlined" onClick={() => setOpenFilterModal(true)}>
                  Filtros {filterCount > 0 ? `(${filterCount})` : ''}
                </Button>
                {canCreate && (
                  <Button variant="contained" onClick={openCreate}>
                    Nova tarefa
                  </Button>
                )}
              </Stack>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar por título ou descrição..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
              />
              <FormControl sx={{ minWidth: 140 }}>
                <InputLabel>Página</InputLabel>
                <Select
                  label="Página"
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
          {canManage && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
              <Button variant="outlined" onClick={() => bulkUpdate({ status: 'DONE' }, 'Concluídas em lote.')}>
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
          )}
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
                    {canManage && (
                      <Checkbox checked={selectedIds.includes(tarefa.id)} onChange={() => toggleSelection(tarefa.id)} />
                    )}
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700 }} noWrap>
                        {tarefa.titulo}
                      </Typography>
                      <Stack direction="row" spacing={0.8} sx={{ mt: 0.5 }} flexWrap="wrap">
                        <Chip size="small" label={statusLabel[tarefa.status]} />
                        <Chip size="small" variant="outlined" label={prioridadeLabel[tarefa.prioridade]} />
                        {!!tarefa.data_limite && (
                          <Chip size="small" variant="outlined" label={`Prazo ${tarefa.data_limite}`} />
                        )}
                        {tarefa.is_assigned_to_me && <Chip size="small" color="info" label="Atribuída a mim" />}
                        {!!tarefa.assigned_to_name && (
                          <Chip size="small" variant="outlined" label={`Usuário: ${tarefa.assigned_to_name}`} />
                        )}
                        {!!tarefa.assigned_team_name && (
                          <Chip size="small" variant="outlined" label={`Equipe: ${tarefa.assigned_team_name}`} />
                        )}
                        {!!tarefa.link && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label="Abrir link"
                            component="a"
                            clickable
                            href={tarefa.link}
                            target="_blank"
                            rel="noreferrer"
                          />
                        )}
                        {!!tarefa.created_by_name && (
                          <Chip size="small" variant="outlined" label={`Criada por ${tarefa.created_by_name}`} />
                        )}
                        {tarefa.arquivada && <Chip size="small" color="warning" label="Arquivada" />}
                      </Stack>
                    </Box>
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={0.8}>
                    {tarefa.can_work && (
                      <Button size="small" variant="outlined" onClick={() => openEdit(tarefa)}>
                        Editar
                      </Button>
                    )}
                    {tarefa.can_work && (
                      <Button size="small" variant="outlined" onClick={() => concludeOrReopen(tarefa)}>
                        {tarefa.status === 'DONE' ? 'Reabrir' : 'Concluir'}
                      </Button>
                    )}
                    {canArchive && (
                      <Button size="small" variant="outlined" onClick={() => archiveOrRestore(tarefa)}>
                        {tarefa.arquivada ? 'Desarquivar' : 'Arquivar'}
                      </Button>
                    )}
                    {canDelete && (
                      <Button size="small" color="error" variant="outlined" onClick={() => remove(tarefa)}>
                        Excluir
                      </Button>
                    )}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          {!!data && data.total_pages > 1 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Página {page} de {data.total_pages} - {data.count} registros
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
                <MenuItem value="DONE">Concluída</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Prioridade</InputLabel>
              <Select
                label="Prioridade"
                value={filterDraft.prioridade}
                onChange={(e) =>
                  setFilterDraft((prev) => ({ ...prev, prioridade: e.target.value as TarefaPrioridade | '' }))
                }
              >
                <MenuItem value="">Todas</MenuItem>
                <MenuItem value="LOW">Baixa</MenuItem>
                <MenuItem value="MEDIUM">Média</MenuItem>
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
              <InputLabel>Ordenação</InputLabel>
              <Select
                label="Ordenação"
                value={filterDraft.ordering}
                onChange={(e) => setFilterDraft((prev) => ({ ...prev, ordering: e.target.value }))}
              >
                <MenuItem value="-created_at">Mais recentes</MenuItem>
                <MenuItem value="created_at">Mais antigas</MenuItem>
                <MenuItem value="data_limite">Prazo mais próximo</MenuItem>
                <MenuItem value="-data_limite">Prazo mais distante</MenuItem>
                <MenuItem value="-prioridade">Maior prioridade</MenuItem>
                <MenuItem value="titulo">Título A-Z</MenuItem>
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
              label="Título"
              value={form.titulo}
              onChange={(e) => setForm((s) => ({ ...s, titulo: e.target.value }))}
              fullWidth
              required
              error={!!formErrors.titulo}
              helperText={formErrors.titulo}
            />
            <TextField
              label="Descrição"
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
                  <MenuItem value="DONE">Concluída</MenuItem>
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
                  <MenuItem value="MEDIUM">Média</MenuItem>
                  <MenuItem value="HIGH">Alta</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <TextField
              label="Prazo"
              type="date"
              required
              InputLabelProps={{ shrink: true }}
              value={form.data_limite}
              onChange={(e) => setForm((s) => ({ ...s, data_limite: e.target.value }))}
              error={!!formErrors.data_limite}
              helperText={formErrors.data_limite || 'O prazo é obrigatório.'}
            />

            <TextField
              label="Link relacionado"
              value={form.link}
              onChange={(e) => setForm((s) => ({ ...s, link: e.target.value }))}
              placeholder="https://..."
              fullWidth
            />

            <Divider />
            <Typography sx={{ fontWeight: 700 }}>Atribuição operacional</Typography>
            <Alert severity="info">
              Atribua a um funcionário ou a uma equipe operacional (ex: Time Comercial 1). Grupos de permissão (Admin, Gerente) são apenas para controle de acesso.
            </Alert>

            <FormControl fullWidth>
              <InputLabel>Tipo de atribuição</InputLabel>
              <Select
                label="Tipo de atribuição"
                value={form.assignmentType}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    assignmentType: e.target.value as AssignmentType,
                    assigned_to: '',
                    assigned_team: ''
                  }))
                }
              >
                <MenuItem value="user">Funcionário</MenuItem>
                <MenuItem value="team">Equipe operacional</MenuItem>
              </Select>
            </FormControl>

            {form.assignmentType === 'user' && (
              <FormControl fullWidth error={!!formErrors.assigned_to}>
                <InputLabel>Usuário responsável</InputLabel>
                <Select
                  label="Usuário responsável"
                  value={form.assigned_to}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      assigned_to: e.target.value === '' ? '' : Number(e.target.value)
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>Selecione um usuário</em>
                  </MenuItem>
                  {assignableUsers.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.name || item.username} ({item.email})
                    </MenuItem>
                  ))}
                </Select>
                {!!formErrors.assigned_to && <FormHelperText>{formErrors.assigned_to}</FormHelperText>}
              </FormControl>
            )}

            {form.assignmentType === 'team' && (
              <FormControl fullWidth error={!!formErrors.assigned_team}>
                <InputLabel>Equipe operacional</InputLabel>
                <Select
                  label="Equipe operacional"
                  value={form.assigned_team}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      assigned_team: e.target.value === '' ? '' : Number(e.target.value)
                    }))
                  }
                >
                  <MenuItem value="">
                    <em>Selecione uma equipe</em>
                  </MenuItem>
                  {assignableTeams.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.nome} ({item.membros_count || 0} membro(s))
                    </MenuItem>
                  ))}
                </Select>
                {!!formErrors.assigned_team && <FormHelperText>{formErrors.assigned_team}</FormHelperText>}
                {!assignableTeams.length && (
                  <FormHelperText>Cadastre equipes em Equipes Operacionais antes de atribuir.</FormHelperText>
                )}
              </FormControl>
            )}
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

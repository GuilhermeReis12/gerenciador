import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Chip, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { api, parseApiError } from 'api/client';
import { useCapabilities } from 'hooks/useCapabilities';
import { usePagination } from 'hooks/usePagination';
import { useTarefaMetrics } from 'hooks/useTarefaMetrics';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { MetricsGrid } from 'components/ui/MetricsGrid';
import { LoadingState } from 'components/feedback/LoadingState';
import { EmptyState } from 'components/feedback/EmptyState';
import { DataPagination } from 'components/tables/DataPagination';
import { TaskListItem } from 'features/tarefas/components/TaskListItem';
import { TaskFormDialog, TaskFormState } from 'features/tarefas/components/TaskFormDialog';
import { TaskFilterDialog, TaskFilterState } from 'features/tarefas/components/TaskFilterDialog';
import { ArquivadaFilter } from 'constants/tarefas';
import {
  AssignableTeam,
  AssignableUser,
  AssignmentType,
  Paginated,
  Tarefa,
  TarefaPrioridade,
  TarefaStatus
} from 'types/tarefas';

const emptyForm: TaskFormState = {
  titulo: '',
  descricao: '',
  status: 'TODO',
  prioridade: 'MEDIUM',
  data_limite: '',
  assignmentType: 'user',
  assigned_to: '',
  assigned_team: '',
  link: ''
};

const TarefasPage: React.FC = () => {
  const { capabilities } = useCapabilities();
  const canCreate = capabilities.can_create_tasks;
  const canManage = capabilities.can_manage_team;
  const canArchive = capabilities.can_archive_tasks;
  const canDelete = capabilities.can_delete_tasks;

  const { page, pageSize, setPage, handlePageSizeChange } = usePagination();
  const { metrics, refresh: refreshMetrics } = useTarefaMetrics();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Paginated<Tarefa> | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
  const [assignableTeams, setAssignableTeams] = useState<AssignableTeam[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [q, setQ] = useState('');
  const [status, setStatus] = useState<TarefaStatus | ''>('');
  const [prioridade, setPrioridade] = useState<TarefaPrioridade | ''>('');
  const [arquivada, setArquivada] = useState<ArquivadaFilter>('');
  const [ordering, setOrdering] = useState('-created_at');

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [editing, setEditing] = useState<Tarefa | null>(null);
  const [form, setForm] = useState<TaskFormState>(emptyForm);

  const [filterDraft, setFilterDraft] = useState<TaskFilterState>({
    status: '',
    prioridade: '',
    arquivada: '',
    ordering: '-created_at'
  });

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

  useEffect(() => {
    loadAssignableOptions();
  }, [loadAssignableOptions]);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

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
    const errors: Record<string, string> = {};
    const titulo = form.titulo.trim();
    if (!titulo) errors.titulo = 'O título é obrigatório.';
    else if (titulo.length < 3) errors.titulo = 'O título deve ter pelo menos 3 caracteres.';
    if (!form.data_limite) errors.data_limite = 'O prazo é obrigatório.';
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

  const refreshAll = async () => {
    await fetchTarefas();
    await refreshMetrics();
  };

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
      await refreshAll();
    } catch (error) {
      const parsed = parseApiError(error);
      setFormErrors(parsed.fieldErrors);
      toast.error(parsed.message);
    }
  };

  const concludeOrReopen = async (tarefa: Tarefa) => {
    if (!tarefa.can_work) return;
    try {
      if (tarefa.status === 'DONE') await api.post(`/tarefas/${tarefa.id}/reabrir`);
      else await api.post(`/tarefas/${tarefa.id}/concluir`);
      await refreshAll();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const archiveOrRestore = async (tarefa: Tarefa) => {
    if (!canArchive) return;
    try {
      if (tarefa.arquivada) await api.post(`/tarefas/${tarefa.id}/desarquivar`);
      else await api.post(`/tarefas/${tarefa.id}/arquivar`);
      await refreshAll();
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
      await refreshAll();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
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
      await refreshAll();
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
    const clean: TaskFilterState = { status: '', prioridade: '', arquivada: '', ordering: '-created_at' };
    setFilterDraft(clean);
    setStatus('');
    setPrioridade('');
    setArquivada('');
    setOrdering('-created_at');
    setPage(1);
    setOpenFilterModal(false);
  };

  const filterCount = [status, prioridade, arquivada].filter(Boolean).length;

  return (
    <PageContainer>
      <PageHeader
        title="Gestão de Tarefas"
        description="Crie, atribua e acompanhe tarefas com notificações para os responsáveis."
        actions={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setOpenFilterModal(true)}>
              Filtros {filterCount > 0 ? `(${filterCount})` : ''}
            </Button>
            {canCreate && (
              <Button variant="contained" onClick={openCreate}>
                Nova tarefa
              </Button>
            )}
          </Stack>
        }
      />

      <ContentCard>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5}>
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
            <InputLabel>Por página</InputLabel>
            <Select
              label="Por página"
              value={String(pageSize)}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            >
              <MenuItem value="10">10</MenuItem>
              <MenuItem value="20">20</MenuItem>
              <MenuItem value="50">50</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </ContentCard>

      <MetricsGrid
        items={[
          { label: 'Total', value: metrics?.total ?? 0 },
          { label: 'Abertas', value: metrics?.open ?? 0 },
          { label: 'Atribuídas a mim', value: metrics?.assigned_to_me ?? 0 },
          { label: 'Atrasadas', value: metrics?.overdue ?? 0 }
        ]}
      />

      <ContentCard>
        {canManage && (
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ mb: 1.5 }} useFlexGap flexWrap="wrap">
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
        <Divider sx={{ mb: 1.5 }} />

        {loading && <LoadingState />}
        {!loading && (data?.results.length || 0) === 0 && (
          <EmptyState
            title="Nenhuma tarefa encontrada"
            description="Tente mudar os filtros ou criar uma nova tarefa."
            action={canCreate ? <Button variant="contained" onClick={openCreate}>Nova tarefa</Button> : undefined}
          />
        )}

        <Stack spacing={1}>
          {data?.results.map((tarefa) => (
            <TaskListItem
              key={tarefa.id}
              tarefa={tarefa}
              selectable={canManage}
              selected={selectedIds.includes(tarefa.id)}
              onToggleSelect={toggleSelection}
              actions={
                <>
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
                </>
              }
            />
          ))}
        </Stack>

        {!!data && (
          <DataPagination
            page={page}
            totalPages={data.total_pages}
            count={data.count}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
            showPageSize
          />
        )}
      </ContentCard>

      <TaskFilterDialog
        open={openFilterModal}
        draft={filterDraft}
        onClose={() => setOpenFilterModal(false)}
        onApply={applyFilters}
        onClear={clearFilters}
        onChange={setFilterDraft}
      />

      <TaskFormDialog
        open={openTaskModal}
        editing={editing}
        form={form}
        formErrors={formErrors}
        assignableUsers={assignableUsers}
        assignableTeams={assignableTeams}
        onClose={() => setOpenTaskModal(false)}
        onSave={save}
        onChange={setForm}
      />
    </PageContainer>
  );
};

export default TarefasPage;

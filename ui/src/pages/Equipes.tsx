import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api, parseApiError } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { EmptyState } from 'components/feedback/EmptyState';
import { DataPagination } from 'components/tables/DataPagination';
import { usePagination } from 'hooks/usePagination';
import { AssignableUser, Paginated } from 'types/tarefas';
import { Equipe } from 'types/equipe';

const EquipesPage: React.FC = () => {
  const { page, pageSize, setPage } = usePagination(20);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipe | null>(null);
  const [form, setForm] = useState({ nome: '', descricao: '', membros: [] as number[] });

  const load = useCallback(async () => {
    try {
      const [equipesRes, usersRes] = await Promise.all([
        api.get<Paginated<Equipe>>('/equipes', { params: { page, page_size: pageSize } }),
        api.get<AssignableUser[]>('/tarefas/assignable_users')
      ]);
      setEquipes(equipesRes.data.results || []);
      setTotalPages(equipesRes.data.total_pages);
      setCount(equipesRes.data.count);
      setUsers(usersRes.data || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  }, [page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm({ nome: '', descricao: '', membros: [] });
    setOpen(true);
  };

  const openEdit = (equipe: Equipe) => {
    setEditing(equipe);
    setForm({ nome: equipe.nome, descricao: equipe.descricao || '', membros: equipe.membros || [] });
    setOpen(true);
  };

  const save = async () => {
    if (!form.nome.trim()) {
      toast.error('Informe o nome da equipe.');
      return;
    }
    try {
      const payload = {
        nome: form.nome.trim(),
        descricao: form.descricao.trim() || null,
        membros: form.membros
      };
      if (editing) {
        await api.patch(`/equipes/${editing.id}`, payload);
        toast.success('Equipe atualizada.');
      } else {
        await api.post('/equipes', payload);
        toast.success('Equipe criada.');
      }
      setOpen(false);
      await load();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Equipes Operacionais"
        description='Crie times como "Time Comercial 1" para atribuir tarefas. Diferente dos grupos de permissão (Admin, Gerente).'
        gradient
        actions={
          <Button variant="contained" color="inherit" sx={{ color: '#312e81' }} onClick={openCreate}>
            Nova equipe
          </Button>
        }
      />

      <Stack spacing={1.5}>
        {equipes.map((equipe) => (
          <ContentCard key={equipe.id}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <div>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {equipe.nome}
                </Typography>
                {!!equipe.descricao && (
                  <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                    {equipe.descricao}
                  </Typography>
                )}
                <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                  <Chip label={`${equipe.membros_count} membro(s)`} size="small" />
                  {(equipe.membros_detail || []).map((member) => (
                    <Chip key={member.id} label={member.name} size="small" variant="outlined" />
                  ))}
                </Stack>
              </div>
              <Button variant="outlined" onClick={() => openEdit(equipe)}>
                Editar
              </Button>
            </Stack>
          </ContentCard>
        ))}

        {!equipes.length && (
          <EmptyState
            title="Nenhuma equipe cadastrada"
            description="Crie a primeira equipe operacional para a empresa ativa."
            action={<Button variant="contained" onClick={openCreate}>Nova equipe</Button>}
          />
        )}
      </Stack>

      {totalPages > 1 && (
        <DataPagination page={page} totalPages={totalPages} count={count} onPageChange={setPage} />
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? 'Editar equipe' : 'Nova equipe operacional'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da equipe"
              value={form.nome}
              onChange={(e) => setForm((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Ex: Time Comercial 1"
              fullWidth
              required
            />
            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
              fullWidth
              multiline
              minRows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Membros</InputLabel>
              <Select
                multiple
                label="Membros"
                value={form.membros}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, membros: (e.target.value as number[]) || [] }))
                }
                renderValue={(selected) =>
                  users
                    .filter((user) => selected.includes(user.id))
                    .map((user) => user.name || user.username)
                    .join(', ')
                }
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.username} ({user.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={save}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default EquipesPage;

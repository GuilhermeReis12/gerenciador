import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { api } from '../utils/axios';
import { parseApiError } from '../utils/apiError';
import { AssignableUser, Paginated } from '../types/tarefas';

type Equipe = {
  id: number;
  nome: string;
  descricao?: string | null;
  ativo: boolean;
  membros: number[];
  membros_count: number;
  membros_detail?: Array<{ id: number; name: string; email: string }>;
};

const EquipesPage: React.FC = () => {
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Equipe | null>(null);
  const [form, setForm] = useState({ nome: '', descricao: '', membros: [] as number[] });

  const load = useCallback(async () => {
    try {
      const [equipesRes, usersRes] = await Promise.all([
        api.get<Paginated<Equipe>>('/equipes', { params: { page_size: 100 } }),
        api.get<AssignableUser[]>('/tarefas/assignable_users')
      ]);
      setEquipes(equipesRes.data.results || []);
      setUsers(usersRes.data || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  }, []);

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
    setForm({
      nome: equipe.nome,
      descricao: equipe.descricao || '',
      membros: equipe.membros || []
    });
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
    <Box sx={{ mt: 2 }}>
      <Card sx={{ mb: 2, background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)', color: 'white' }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Equipes Operacionais
              </Typography>
              <Typography sx={{ opacity: 0.9, mt: 0.5 }}>
                Crie times como &quot;Time Comercial 1&quot; para atribuir tarefas. Isso é diferente dos grupos de permissão (Admin, Gerente, Funcionário).
              </Typography>
            </Box>
            <Button variant="contained" color="inherit" sx={{ color: '#312e81' }} onClick={openCreate}>
              Nova equipe
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        {equipes.map((equipe) => (
          <Card key={equipe.id}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {equipe.nome}
                  </Typography>
                  {!!equipe.descricao && (
                    <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                      {equipe.descricao}
                    </Typography>
                  )}
                  <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                    <Chip label={`${equipe.membros_count} membro(s)`} size="small" />
                    {(equipe.membros_detail || []).map((member) => (
                      <Chip key={member.id} label={member.name} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
                <Button variant="outlined" onClick={() => openEdit(equipe)}>
                  Editar
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {!equipes.length && (
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Nenhuma equipe cadastrada para a empresa ativa. Crie a primeira equipe operacional.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>

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
                  setForm((prev) => ({
                    ...prev,
                    membros: (e.target.value as number[]) || []
                  }))
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
    </Box>
  );
};

export default EquipesPage;

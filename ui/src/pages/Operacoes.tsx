import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
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

type Registro = {
  id: number;
  tipo: 'TASK' | 'PRODUCT' | 'STOCK';
  titulo: string;
  descricao?: string | null;
  sku?: string | null;
  quantidade: string;
  unidade: string;
  ativo: boolean;
};

type Paginated<T> = {
  results: T[];
};

const OperacoesPage: React.FC = () => {
  const [tipo, setTipo] = useState('');
  const [q, setQ] = useState('');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    tipo: 'PRODUCT',
    titulo: '',
    descricao: '',
    sku: '',
    quantidade: '0',
    unidade: 'UN'
  });

  const load = async () => {
    try {
      const response = await api.get<Paginated<Registro>>('/operacoes', {
        params: { tipo: tipo || undefined, q: q || undefined }
      });
      setRegistros(response.data.results || []);
    } catch {
      toast.error('Não foi possível carregar operações.');
    }
  };

  useEffect(() => {
    load();
  }, [tipo, q]);

  const create = async () => {
    if (!form.titulo.trim()) {
      toast.error('Título é obrigatório.');
      return;
    }
    try {
      await api.post('/operacoes', {
        ...form,
        quantidade: Number(form.quantidade)
      });
      toast.success('Registro criado com sucesso.');
      setOpen(false);
      setForm({
        tipo: 'PRODUCT',
        titulo: '',
        descricao: '',
        sku: '',
        quantidade: '0',
        unidade: 'UN'
      });
      load();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || 'Não foi possível criar o registro.');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Operações (Produto / Estoque / Tarefa)
          </Typography>
          <Typography color="text.secondary">
            Base única para gerenciamento multipropósito por empresa.
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Novo registro
        </Button>
      </Stack>

      <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Buscar"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Tipo</InputLabel>
          <Select label="Tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="PRODUCT">Produto</MenuItem>
            <MenuItem value="STOCK">Estoque</MenuItem>
            <MenuItem value="TASK">Tarefa</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack spacing={1.2} sx={{ mt: 2 }}>
        {registros.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <Typography sx={{ fontWeight: 700 }}>
                  {item.titulo}
                </Typography>
                <Typography color="text.secondary">
                  {item.tipo} {item.sku ? `- SKU ${item.sku}` : ''}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Quantidade: {item.quantidade} {item.unidade}
              </Typography>
              {!!item.descricao && (
                <Typography variant="body2" sx={{ mt: 0.7 }}>
                  {item.descricao}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
        {!registros.length && (
          <Card>
            <CardContent>
              <Typography sx={{ fontWeight: 700 }}>Nenhum registro encontrado</Typography>
            </CardContent>
          </Card>
        )}
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Novo registro operacional</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                label="Tipo"
                value={form.tipo}
                onChange={(e) => setForm((prev) => ({ ...prev, tipo: e.target.value }))}
              >
                <MenuItem value="PRODUCT">Produto</MenuItem>
                <MenuItem value="STOCK">Estoque</MenuItem>
                <MenuItem value="TASK">Tarefa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Título"
              value={form.titulo}
              onChange={(e) => setForm((prev) => ({ ...prev, titulo: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Descrição"
              value={form.descricao}
              onChange={(e) => setForm((prev) => ({ ...prev, descricao: e.target.value }))}
              fullWidth
              multiline
              minRows={3}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="SKU"
                value={form.sku}
                onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Quantidade"
                type="number"
                value={form.quantidade}
                onChange={(e) => setForm((prev) => ({ ...prev, quantidade: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Unidade"
                value={form.unidade}
                onChange={(e) => setForm((prev) => ({ ...prev, unidade: e.target.value }))}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={create}>Salvar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OperacoesPage;


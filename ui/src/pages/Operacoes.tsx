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
import { parseApiError } from '../utils/apiError';

type Empresa = {
  id: number;
  nome: string;
  cnpj: string;
};

type Registro = {
  id: number;
  tipo: 'TASK' | 'PRODUCT' | 'STOCK';
  titulo: string;
  descricao?: string | null;
  sku?: string | null;
  quantidade: string;
  unidade: string;
  ativo: boolean;
  empresa?: number;
};

type Paginated<T> = {
  results: T[];
};

const OperacoesPage: React.FC = () => {
  const [tipo, setTipo] = useState('');
  const [q, setQ] = useState('');
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [userEmpresaId, setUserEmpresaId] = useState<number | ''>('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    empresa: '' as number | '',
    tipo: 'PRODUCT',
    titulo: '',
    descricao: '',
    sku: '',
    quantidade: '0',
    unidade: 'UN'
  });

  const loadEmpresas = async () => {
    try {
      const [empresasResponse, minhaEmpresaResponse] = await Promise.allSettled([
        api.get<Paginated<Empresa> | Empresa[]>('/empresas'),
        api.get<Empresa>('/empresas/minha_empresa')
      ]);

      if (empresasResponse.status === 'fulfilled') {
        const data = empresasResponse.value.data;
        const list = Array.isArray(data) ? data : data.results || [];
        setEmpresas(list);
      }

      if (minhaEmpresaResponse.status === 'fulfilled') {
        const empresaId = minhaEmpresaResponse.value.data.id;
        setUserEmpresaId(empresaId);
        setForm((prev) => ({ ...prev, empresa: empresaId }));
      }
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const load = async () => {
    try {
      const response = await api.get<Paginated<Registro>>('/operacoes', {
        params: { tipo: tipo || undefined, q: q || undefined }
      });
      setRegistros(response.data.results || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  useEffect(() => {
    loadEmpresas();
  }, []);

  useEffect(() => {
    load();
  }, [tipo, q]);

  const create = async () => {
    if (!form.titulo.trim()) {
      toast.error('Título é obrigatório.');
      return;
    }
    if (!form.empresa) {
      toast.error('Selecione uma empresa.');
      return;
    }
    try {
      await api.post('/operacoes', {
        ...form,
        empresa: form.empresa,
        quantidade: Number(form.quantidade)
      });
      toast.success('Registro criado com sucesso.');
      setOpen(false);
      setForm({
        empresa: userEmpresaId || '',
        tipo: 'PRODUCT',
        titulo: '',
        descricao: '',
        sku: '',
        quantidade: '0',
        unidade: 'UN'
      });
      load();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const openCreateModal = () => {
    setForm((prev) => ({
      ...prev,
      empresa: userEmpresaId || prev.empresa || ''
    }));
    setOpen(true);
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
        <Button variant="contained" onClick={openCreateModal}>
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
            <FormControl fullWidth required>
              <InputLabel>Empresa</InputLabel>
              <Select
                label="Empresa"
                value={form.empresa}
                disabled={!!userEmpresaId}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    empresa: e.target.value === '' ? '' : Number(e.target.value)
                  }))
                }
              >
                <MenuItem value="">
                  <em>Selecione uma empresa</em>
                </MenuItem>
                {empresas.map((empresa) => (
                  <MenuItem key={empresa.id} value={empresa.id}>
                    {empresa.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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


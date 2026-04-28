import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';

type AuditLog = {
  id: number;
  action: string;
  payload_json: Record<string, any> | null;
  created_at: string;
  user_name: string;
  tarefa: number | null;
};

type Paginated<T> = {
  results: T[];
  total_pages: number;
  count: number;
};

const actionLabel: Record<string, string> = {
  CREATED: 'Criada',
  UPDATED: 'Atualizada',
  DELETED: 'Excluída',
  STATUS_CHANGED: 'Status alterado',
  ARCHIVED: 'Arquivada',
  RESTORED: 'Desarquivada',
  BULK_UPDATED: 'Atualização em lote'
};

const AuditoriaPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [data, setData] = useState<Paginated<AuditLog> | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get<Paginated<AuditLog>>('/tarefas/audit_logs', {
          params: {
            page,
            action: action || undefined
          }
        });
        setData(response.data);
      } catch (e: any) {
        const detail = e?.response?.data?.detail;
        toast.error(detail || 'Não foi possível carregar os logs de auditoria.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, action]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>
        Auditoria
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Trilhas de alteração para governança e compliance.
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <FormControl sx={{ minWidth: 260 }}>
            <InputLabel>Ação</InputLabel>
            <Select
              label="Ação"
              value={action}
              onChange={(e) => {
                setAction(e.target.value);
                setPage(1);
              }}
            >
              <MenuItem value="">Todas</MenuItem>
              <MenuItem value="CREATED">Criada</MenuItem>
              <MenuItem value="UPDATED">Atualizada</MenuItem>
              <MenuItem value="DELETED">Excluída</MenuItem>
              <MenuItem value="STATUS_CHANGED">Status alterado</MenuItem>
              <MenuItem value="ARCHIVED">Arquivada</MenuItem>
              <MenuItem value="RESTORED">Desarquivada</MenuItem>
              <MenuItem value="BULK_UPDATED">Atualização em lote</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {loading && (
        <Stack spacing={1}>
          <Skeleton height={70} />
          <Skeleton height={70} />
          <Skeleton height={70} />
        </Stack>
      )}

      {!loading && (
        <Stack spacing={1.2}>
          {data?.results.map((log) => (
            <Card key={log.id}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                  <Typography sx={{ fontWeight: 700 }}>
                    {actionLabel[log.action] || log.action}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(log.created_at).toLocaleString('pt-BR')}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Usuário: {log.user_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tarefa: {log.tarefa || '-'}
                </Typography>
                {!!log.payload_json && (
                  <Typography variant="body2" sx={{ mt: 0.8 }}>
                    Detalhes: {JSON.stringify(log.payload_json)}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
          {!data?.results?.length && (
            <Card>
              <CardContent>
                <Typography sx={{ fontWeight: 700 }}>Nenhum log encontrado</Typography>
              </CardContent>
            </Card>
          )}
        </Stack>
      )}

      {!!data && data.total_pages > 1 && (
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {data.count} registro(s)
          </Typography>
          <Pagination page={page} count={data.total_pages} onChange={(_, value) => setPage(value)} />
        </Stack>
      )}
    </Box>
  );
};

export default AuditoriaPage;


import React, { useEffect, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api, parseApiError } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { LoadingState } from 'components/feedback/LoadingState';
import { EmptyState } from 'components/feedback/EmptyState';
import { DataPagination } from 'components/tables/DataPagination';
import { usePagination } from 'hooks/usePagination';
import { Paginated } from 'types/api';
import { AuditLog, auditActionLabel } from 'types/auditoria';

const AuditoriaPage: React.FC = () => {
  const { page, setPage } = usePagination();
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [data, setData] = useState<Paginated<AuditLog> | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get<Paginated<AuditLog>>('/tarefas/audit_logs', {
          params: { page, action: action || undefined }
        });
        setData(response.data);
      } catch (error) {
        toast.error(parseApiError(error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, action]);

  return (
    <PageContainer>
      <PageHeader
        title="Auditoria"
        description="Trilhas de alteração para governança e compliance."
      />

      <ContentCard>
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
            {Object.entries(auditActionLabel).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ContentCard>

      {loading && (
        <Box sx={{ mt: 2 }}>
          <LoadingState />
        </Box>
      )}

      {!loading && (
        <Stack spacing={1.2} sx={{ mt: 2 }}>
          {data?.results.map((log) => (
            <ContentCard key={log.id}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
                <Typography sx={{ fontWeight: 700 }}>
                  {auditActionLabel[log.action] || log.action}
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
            </ContentCard>
          ))}

          {!data?.results?.length && (
            <EmptyState title="Nenhum log encontrado" description="Não há registros para os filtros selecionados." />
          )}
        </Stack>
      )}

      {!!data && (
        <DataPagination
          page={page}
          totalPages={data.total_pages}
          count={data.count}
          onPageChange={setPage}
        />
      )}
    </PageContainer>
  );
};

export default AuditoriaPage;

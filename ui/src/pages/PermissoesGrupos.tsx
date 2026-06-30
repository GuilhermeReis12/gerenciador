import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  FormControlLabel,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api, parseApiError } from 'api/client';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { ContentCard } from 'components/ui/ContentCard';
import { EmptyState } from 'components/feedback/EmptyState';
import { LoadingState } from 'components/feedback/LoadingState';
import { capabilityLabels, GroupPermission } from 'types/tarefas';
import { Paginated } from 'types/api';
import { MAX_PAGE_SIZE } from 'constants/pagination';

const permissionKeys = Object.keys(capabilityLabels) as Array<keyof typeof capabilityLabels>;

const PermissoesGruposPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<GroupPermission[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Paginated<GroupPermission>>('/group-permissions', {
        params: { page_size: MAX_PAGE_SIZE }
      });
      setPermissions(response.data.results || []);
    } catch (error) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updatePermission = (item: GroupPermission, key: keyof typeof capabilityLabels, value: boolean) => {
    setPermissions((prev) =>
      prev.map((entry) => (entry.id === item.id ? { ...entry, [key]: value } : entry))
    );
  };

  const save = async (item: GroupPermission) => {
    try {
      await api.patch(`/group-permissions/${item.id}`, item);
      toast.success(`Permissões do grupo ${item.group_name} atualizadas.`);
    } catch (error) {
      toast.error(parseApiError(error).message);
      await load();
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Permissões de Acesso"
        description="Configure o que cada grupo de permissão pode fazer. Diferente das equipes operacionais."
      />

      {loading && <LoadingState />}

      <Stack spacing={2}>
        {permissions.map((item) => (
          <ContentCard key={item.id}>
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
              <div style={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {item.group_name}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1.5 }}>
                  {permissionKeys.map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Switch
                          checked={item[key]}
                          onChange={(e) => updatePermission(item, key, e.target.checked)}
                        />
                      }
                      label={capabilityLabels[key]}
                    />
                  ))}
                </Stack>
              </div>
              <Button variant="contained" onClick={() => save(item)} disabled={loading}>
                Salvar grupo
              </Button>
            </Stack>
          </ContentCard>
        ))}

        {!permissions.length && !loading && (
          <EmptyState
            title="Nenhum grupo encontrado"
            description="Crie grupos no Django Admin e associe usuários a eles."
          />
        )}
      </Stack>
    </PageContainer>
  );
};

export default PermissoesGruposPage;

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Stack,
  Switch,
  Typography
} from '@mui/material';
import { toast } from 'react-toastify';
import { api } from '../utils/axios';
import { parseApiError } from '../utils/apiError';
import { capabilityLabels, GroupPermission, Paginated } from '../types/tarefas';

const permissionKeys = Object.keys(capabilityLabels) as Array<keyof typeof capabilityLabels>;

const PermissoesGruposPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<GroupPermission[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<Paginated<GroupPermission>>('/group-permissions', {
        params: { page_size: 100 }
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
    <Box sx={{ mt: 2 }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Permissões de Acesso (RBAC)
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Configure o que cada grupo de permissão do sistema pode fazer. Isso é diferente das equipes operacionais (Time 1, Time 2).
          </Typography>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {permissions.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                <Box sx={{ flex: 1 }}>
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
                </Box>
                <Button variant="contained" onClick={() => save(item)} disabled={loading}>
                  Salvar grupo
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
        {!permissions.length && !loading && (
          <Card>
            <CardContent>
              <Typography color="text.secondary">
                Nenhum grupo encontrado. Crie grupos no Django Admin e associe usuários a eles.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default PermissoesGruposPage;

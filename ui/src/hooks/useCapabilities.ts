import { useCallback, useEffect, useState } from 'react';
import { api } from 'api/client';
import { UserCapabilities } from 'types/tarefas';

const defaultCapabilities: UserCapabilities = {
  role: 'OPERATOR',
  groups: [],
  can_create_tasks: false,
  can_assign_tasks: false,
  can_view_all_tasks: false,
  can_manage_team: false,
  can_complete_assigned: true,
  can_archive_tasks: false,
  can_delete_tasks: false,
  can_manage_permissions: false,
  can_manage_equipes: false
};

export function useCapabilities() {
  const [capabilities, setCapabilities] = useState<UserCapabilities>(defaultCapabilities);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await api.get<UserCapabilities>('/tarefas/my_capabilities');
      setCapabilities(response.data);
    } catch {
      setCapabilities(defaultCapabilities);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { capabilities, loading, refresh };
}

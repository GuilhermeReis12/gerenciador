import { useCallback, useEffect, useState } from 'react';
import { api } from 'api/client';
import { CurrentUser } from 'types/tarefas';
import { getStoredUser, setStoredUser } from 'utils/auth';

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(getStoredUser());
  const [loading, setLoading] = useState(!getStoredUser());

  const refresh = useCallback(async () => {
    try {
      const response = await api.get<CurrentUser[]>('/me');
      const profile = response.data[0];
      if (profile) {
        const current: CurrentUser = {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          link_img: profile.link_img
        };
        setStoredUser(current);
        setUser(current);
      }
    } catch {
      setUser(getStoredUser());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh };
}

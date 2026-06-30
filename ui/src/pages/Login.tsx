import React, { useState } from 'react';
import { api } from 'api/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginForm } from 'components/forms/LoginForm';
import { setStoredUser, setStoredEmpresas, setActiveEmpresaId } from 'utils/auth';
import { parseApiError } from 'api/client';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (value: { user: string; password: string }) => {
    setLoading(true);
    try {
      const response = await api.post('/login', {
        password: value.password,
        username: value.user
      });
      localStorage.setItem('token', response.data.user.token);

      const meResponse = await api.get('/me');
      const profile = meResponse.data[0];
      if (profile) {
        setStoredUser({
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          link_img: profile.link_img
        });
      }

      const empresasResponse = await api.get('/empresas/minhas');
      const empresas = empresasResponse.data.empresas || [];
      setStoredEmpresas(empresas);
      const activeId = empresasResponse.data.active_empresa_id || empresas[0]?.id;
      if (activeId) {
        setActiveEmpresaId(activeId);
      }

      navigate('/home');
    } catch (error: unknown) {
      toast.error(parseApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={loading} />;
};

export default LoginPage;

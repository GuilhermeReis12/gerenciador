import React from 'react';
import LoginCard from '../components/login/LoginCard';
import { api } from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import '../components/login/BackgroundImage.css';
import { TFormLogin } from '../types/Login/LoginTypes';
import { toast } from 'react-toastify';
import { setStoredUser, setStoredEmpresas, setActiveEmpresaId } from '../utils/auth';
import { parseApiError } from '../utils/apiError';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (value: TFormLogin) => {
    try {
      const payload = {
        password: value.password,
        username: value.user
      };

      const response = await api.post('/login', payload);
      localStorage.setItem('token', response.data.user.token);

      const meResponse = await api.get('/me');
      const profile = meResponse.data[0];
      if (profile) {
        setStoredUser({
          id: profile.id,
          username: profile.username,
          name: profile.name,
          email: profile.email,
          role: profile.role
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
    }
  };

  return (
    <div className="background-image-container">
      <LoginCard onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;

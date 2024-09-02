import React from 'react';
import LoginCard from '../components/login/LoginCard';
import { api } from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import '../components/login/BackgroundImage.css';
import { TFormLogin } from '../types/Login/LoginTypes';
import { toast } from 'react-toastify';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = async (value: TFormLogin) => {
    try {
      const payload = {
        password: value.password,
        username: value.user
      };

      const response = await api.post('/api/login', payload);
      localStorage.setItem('token', response.data.user.token);
      navigate('/home');
    } catch (error: any) {
      console.error('Error details:', error);

      if (error.response) {
        const errorMessage = error.response.data?.message || 'Ocorreu um erro durante o processo de autenticação.';
        toast.error(errorMessage);
      } else if (error.request) {
        toast.error('Erro de conexão. Verifique sua conexão com a internet.');
      } else {
        toast.error('Ocorreu um erro desconhecido.');
      }
    }
  };

  return (
    <div className="background-image-container">
      <LoginCard onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;

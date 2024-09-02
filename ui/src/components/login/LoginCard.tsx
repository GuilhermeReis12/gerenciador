import React, { useState } from 'react';
import Input from '../StoryBook/Input/Input';
import { TFormLogin } from '../../types/Login/LoginTypes';
import imagem from '../../assets/images/logoEducatAzul.png';
import Button from '../StoryBook/Button/Button';
import { Label } from '../Typography/Label';
import { loginCardStyle, imageContainerStyle, imageStyle } from './LoginCard.style.tsx';

interface LoginCardProps {
  onLogin: any;
}

const LoginCard: React.FC<LoginCardProps> = ({ onLogin }) => {
  const [form, setForm] = useState<TFormLogin>({
    user: '',
    password: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(form);
  };

  const handleChange = (name: 'user' | 'password', value: string) => {
    setForm((prevState: any) => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={loginCardStyle}>
      <div style={imageContainerStyle}>
        <img src={imagem} alt="Imagem de login" style={imageStyle} />
      </div>
      <form onSubmit={handleLogin} style={{ marginTop: "-20px" }}>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            type="text"
            placeholder="Usuário/E-mail"
            onChange={(e: any) => {
              handleChange('user', e.target.value);
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            type="password"
            placeholder="Senha"
            onChange={(e: any) => {
              handleChange('password', e.target.value);
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button type="submit" style={{ width: '300px', height: "40px" }}>
            <Label label='Entrar' />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginCard;

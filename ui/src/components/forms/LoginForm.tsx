import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from 'assets/images/logoEducatAzul.png';

type LoginFormValues = {
  user: string;
  password: string;
};

type LoginFormProps = {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  loading?: boolean;
};

export function LoginForm({ onSubmit, loading }: LoginFormProps) {
  const [values, setValues] = useState<LoginFormValues>({ user: '', password: '' });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #2563eb 100%)',
        p: 2
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.25)'
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3} alignItems="center">
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ maxWidth: 180, height: 'auto' }}
            />

            <Box textAlign="center">
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Bem-vindo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Acesse o gerenciador de tarefas
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="Usuário ou e-mail"
                  value={values.user}
                  onChange={(e) => setValues((prev) => ({ ...prev, user: e.target.value }))}
                  fullWidth
                  required
                  autoComplete="username"
                />
                <TextField
                  label="Senha"
                  type="password"
                  value={values.password}
                  onChange={(e) => setValues((prev) => ({ ...prev, password: e.target.value }))}
                  fullWidth
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={<LockOutlinedIcon />}
                  sx={{ mt: 1, py: 1.2 }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

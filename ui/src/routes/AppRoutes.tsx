import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ErrorBoundary from 'error/ErrorBoundary';
import NotFound from 'error/NotFound';
import Login from 'pages/Login';
import Erro from 'pages/Erro';
import PrivateRoute from 'routes/PrivateRoute';
import CapabilityRoute from 'routes/CapabilityRoute';

const Home = lazy(() => import('pages/Home'));
const MeuPerfil = lazy(() => import('pages/MeuPerfil'));
const Tarefas = lazy(() => import('pages/Tarefas'));
const MinhasTarefas = lazy(() => import('pages/MinhasTarefas'));
const EquipeTarefas = lazy(() => import('pages/EquipeTarefas'));
const Equipes = lazy(() => import('pages/Equipes'));
const PermissoesGrupos = lazy(() => import('pages/PermissoesGrupos'));
const Agenda = lazy(() => import('pages/Agenda'));
const Relatorios = lazy(() => import('pages/Relatorios'));
const Auditoria = lazy(() => import('pages/Auditoria'));
const Operacoes = lazy(() => import('pages/Operacoes'));

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
      <CircularProgress />
    </Box>
  );
}

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route path="/meu-perfil" element={<MeuPerfil />} />
              <Route path="/home" element={<Home />} />
              <Route path="/minhas-tarefas" element={<MinhasTarefas />} />
              <Route element={<CapabilityRoute check={(c) => c.can_create_tasks} redirectTo="/minhas-tarefas" />}>
                <Route path="/tarefas" element={<Tarefas />} />
              </Route>
              <Route element={<CapabilityRoute check={(c) => c.can_manage_team} />}>
                <Route path="/equipe-tarefas" element={<EquipeTarefas />} />
              </Route>
              <Route element={<CapabilityRoute check={(c) => !!c.can_manage_equipes || c.can_manage_team} />}>
                <Route path="/equipes" element={<Equipes />} />
              </Route>
              <Route element={<CapabilityRoute check={(c) => c.can_manage_permissions} />}>
                <Route path="/permissoes-grupos" element={<PermissoesGrupos />} />
              </Route>
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/operacoes" element={<Operacoes />} />
              <Route element={<CapabilityRoute check={(c) => c.can_manage_team} />}>
                <Route path="/auditoria" element={<Auditoria />} />
              </Route>
              <Route path="/erro" element={<Erro />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;

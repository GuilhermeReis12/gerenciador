import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../error/ErrorBoundary";
import NotFound from "../error/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Erro from "../pages/Erro";
import PrivateRoute from "./PrivateRoute";
import CapabilityRoute from "./CapabilityRoute";
import MeuPerfil from "../pages/MeuPerfil";
import Tarefas from "../pages/Tarefas";
import MinhasTarefas from "../pages/MinhasTarefas";
import EquipeTarefas from "../pages/EquipeTarefas";
import Equipes from "../pages/Equipes";
import PermissoesGrupos from "../pages/PermissoesGrupos";
import Agenda from "../pages/Agenda";
import Relatorios from "../pages/Relatorios";
import Auditoria from "../pages/Auditoria";
import Operacoes from "../pages/Operacoes";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
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
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;

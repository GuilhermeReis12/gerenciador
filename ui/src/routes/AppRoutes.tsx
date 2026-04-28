import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../error/ErrorBoundary";
import NotFound from "../error/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Erro from "../pages/Erro";
import PrivateRoute from "./PrivateRoute";
import MeuPerfil from "../pages/MeuPerfil";
import Tarefas from "../pages/Tarefas";
import Agenda from "../pages/Agenda";
import Relatorios from "../pages/Relatorios";

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
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/agenda" element={<Agenda />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/erro" element={<Erro />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;

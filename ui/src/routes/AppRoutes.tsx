import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ErrorBoundary from "../error/ErrorBoundary";
import NotFound from "../error/NotFound";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Erro from "../pages/Erro";
import PrivateRoute from "./PrivateRoute";
import MeuPerfil from "../pages/MeuPerfil";

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
            <Route path="/erro" element={<Erro />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default AppRoutes;

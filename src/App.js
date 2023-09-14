
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from "./theme";
import './App.scss';
import Signin from 'components/auth/Signin/Signin';
import Signup from 'components/auth/Signup/Signup';
import ForgotPassword from 'components/auth/ForgotPassword/ForgotPassword';
import GastosHistorial from 'components/pages/gastos/GastosHistorial';
import GastosRegistro from 'components/pages/gastos/registro/GastosRegistro';

export default function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* GASTOS */}
          <Route path="/gastos-historial" element={<GastosHistorial />} />
          <Route path="/gastos-registro" element={<GastosRegistro />} />

          {/*
          <Route path="/404" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
          */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

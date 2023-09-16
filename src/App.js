
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from "./theme";
import './App.scss';
import Signin from 'components/auth/Signin/Signin';
import Signup from 'components/auth/Signup/Signup';
import ForgotPassword from 'components/auth/ForgotPassword/ForgotPassword';
import GastosHistorial from 'components/pages/gastos/historial/GastosHistorial';
import GastosRegistro from 'components/pages/gastos/registro/GastosRegistro';
import GastosEdicion from 'components/pages/gastos/edicion/GastoEdicion';
import IngresosHistorial from 'components/pages/ingresos/historial/IngresosHistorial';
import IngresosRegistro from 'components/pages/ingresos/registro/IngresosRegistro';
import IngresosEdicion from 'components/pages/ingresos/edicion/IngresoEdicion';
import PrestamosHistorial from 'components/pages/prestamos/historial/PrestamosHistorial';
import PrestamosRegistro from 'components/pages/prestamos/registro/PrestamosRegistro';
import PrestamosEdicion from 'components/pages/prestamos/edicion/PrestamosEdicion';

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
          <Route path="/gastos-edicion/:id" element={<GastosEdicion />} />

          {/* INGRESOS */}
          <Route path="/ingresos-historial" element={<IngresosHistorial />} />
          <Route path="/ingresos-registro" element={<IngresosRegistro />} />
          <Route path="/ingresos-edicion/:id" element={<IngresosEdicion />} />

          {/* INGRESOS */}
          <Route path="/prestamos-historial" element={<PrestamosHistorial />} />
          <Route path="/prestamos-registro" element={<PrestamosRegistro />} />
          <Route path="/prestamos-edicion/:id" element={<PrestamosEdicion />} />

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

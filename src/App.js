
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import theme from "./theme";
import './App.scss';
import Signin from 'components/auth/Signin/Signin';
import Signup from 'components/auth/Signup/Signup';
import ForgotPassword from 'components/auth/ForgotPassword/ForgotPassword';

export default function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/404" component={ErrorPage} />
          <Route path="*" component={ErrorPage} /> */}
          <Route path="/" element={<Navigate to="/signin" replace />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

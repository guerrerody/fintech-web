import React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import AuthLayout from 'components/layouts/AuthLayout/AuthLayout';
import Copyright from 'components/Copyright';
import './Signup.scss';

const Signup = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      name: data.get('name'),
      phone: data.get('phone'),
      password: data.get('newPassword'),
    });
  };

  return (
    <AuthLayout title="Bienvenido a Fintech">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <AppRegistrationIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Registro</Typography>
      </Box>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <Grid container rowSpacing={0.5} spacing={1}>
          <Grid item xs={12}>
          <TextField margin="normal" required fullWidth autoFocus id="email" name="email"
              label="Correo electrónico" autoComplete="email"/>
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="name" name="name"
              label="Nombre completo" autoComplete="name"/>
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="phone" name="phone"
              label="Nro. Telefónico" autoComplete="phone"/>
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="newPassword" name="newPassword"
              label="Contraseña" type="password" autoComplete="new-password"/>
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="confirmPassword" name="confirmPassword"
              label="Confirmación de contraseña" type="password" autoComplete="confirm-password"/>
          </Grid>
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Registrar
        </Button>
        <Grid container>
          <Grid item xs>
          </Grid>
          <Grid item>
            <Link to="/signin" component={RouterLink} variant="body2">¿Ya tienes cuenta? Iniciar Sesión</Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </AuthLayout>
  );
};

export default Signup;

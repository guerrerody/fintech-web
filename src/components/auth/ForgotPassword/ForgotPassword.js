import React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PasswordIcon from '@mui/icons-material/Password';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import AuthLayout from 'components/layouts/AuthLayout/AuthLayout';
import Copyright from 'components/Copyright';
import './ForgotPassword.scss';

const ForgotPassword = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
    });
  };

  return (
    <AuthLayout>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PasswordIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Recuperar Contraseña</Typography>
      </Box>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth autoFocus id="email" name="email"
          label="Correo electrónico" autoComplete="email"/>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Enviar
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

export default ForgotPassword;

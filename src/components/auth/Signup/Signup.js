import React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import AuthLayout from 'components/layouts/AuthLayout/AuthLayout';
import Copyright from 'components/Copyright';
import './Signup.scss';
import axios from 'axios';
import Swal from 'sweetalert2';

const Signup = () => {

  const navigate = useNavigate();

  const setLocalStorage = value => {
    try {
      window.localStorage.setItem("token-e", value);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await axios.post('http://localhost:8080/api/usuario', {
      nombre_usuario: data.get('nombre_usuario'),
      correo: data.get('email'),
      nombre: data.get('name'),
      apellido: data.get('last_name'),
      telefono: data.get('phone'),
      contrasenna: data.get('newPassword')
    }).then(respuesta => {
      if (respuesta != null && respuesta.data.usuario.idusuario > 0) {
        setLocalStorage(respuesta.data.token);

        Swal.fire(
          'Good job!',
          'Inicio de sesion correcto!',
          'success'
        );

        navigate("/signin");
      }
    }).catch(function (error) {

      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx

        Swal.fire({
          icon: 'error',
          title: 'DATOS INCORRECTOS O FALTA INFORMACION',
          text: error.response.data.errors.reduce((total, msg) => {
            return total + msg.msg + "<br></br>";
          }, '')
        });

        //console.log(error.response.data);
        console.log(error.response.status);
        //console.log(error.response.headers);
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
        // `error.request` es una instancia de XMLHttpRequest en el navegador y una instancia de
        // http.ClientRequest en node.js

        Swal.fire({
          icon: 'error',
          title: 'Error con el servidor',
          text: "Error al intentar comunicarse con el servidor. Revise su consola para mas informacion."
        })

        console.log(error.request);
      } else {
        // Algo paso al preparar la petición que lanzo un Error

        Swal.fire({
          icon: 'error',
          title: 'Error interno',
          text: 'Ocurrio un error al intentar enviar la peticion al servidor.'
        })
      }
    });
  }

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
            <TextField margin="normal" required fullWidth autoFocus id="nombre_usuario" name="nombre_usuario"
              label="Nombre de usuario" autoComplete="nombre_usuario" />
          </Grid>
          <Grid item xs={12}>
            <TextField margin="normal" required fullWidth autoFocus id="email" name="email"
              label="Correo electrónico" autoComplete="email" />
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="name" name="name"
              label="Nombre" autoComplete="name" />
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="last_name" name="last_name"
              label="Apellido" autoComplete="last_name" />
          </Grid>
          <Grid item xs={12}>
            <TextField margin="normal" required fullWidth id="phone" name="phone"
              label="Nro. Telefónico" autoComplete="phone" />
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="newPassword" name="newPassword"
              label="Contraseña" type="password" autoComplete="new-password" />
          </Grid>
          <Grid item xs={6}>
            <TextField margin="normal" required fullWidth id="confirmPassword" name="confirmPassword"
              label="Confirmación de contraseña" type="password" autoComplete="confirm-password" />
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

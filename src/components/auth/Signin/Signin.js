import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import AuthLayout from 'components/layouts/AuthLayout/AuthLayout';
import Copyright from 'components/Copyright';

import './Signin.scss';

const Signin = () => {

  const navigate = useNavigate();

  const setLocalStorage = value => {
    try{
      window.localStorage.setItem("token-e", value);
    } catch(error){
      console.error(error);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);

    await axios.post('http://localhost:8080/api/auth/login', {
      identificador: datos.get('email'),
      contrasenna: datos.get('password')
    }).then(respuesta => {
      if(respuesta != null && respuesta.data.usuario.idusuario > 0){
        setLocalStorage(respuesta.data.token);
        navigate("/gastos-historial");
      }
    }).catch(function (error) {

      if (error.response) {
        // La respuesta fue hecha y el servidor respondió con un código de estado
        // que esta fuera del rango de 2xx

        Swal.fire({
          icon: 'error',
          title: 'CREDENCIALES INCORRECTAS',
          text: error.response.data.msg
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

  };

  return (
    <AuthLayout title="Bienvenido a Fintech">
      <Box display="flex" flexDirection="column" alignItems="center">
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">Iniciar Sesión</Typography>
      </Box>
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth autoFocus id="email" name="email"
          label="Usuario o correo electrónico" autoComplete="email" />
        <TextField margin="normal" required fullWidth id="password" name="password"
          label="Contraseña" type="password" autoComplete="current-password" />
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Recuérdame" />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Iniciar Sesión
        </Button>
        <Grid container>
          <Grid item xs>
            <Link to="/forgot-password" component={RouterLink} variant="body2">¿Has olvidado tu contraseña?</Link>
          </Grid>
          <Grid item>
            <Link to="/signup" component={RouterLink} variant="body2">¿No tienes cuenta? Registrate</Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </AuthLayout>
  );
}

export default Signin;

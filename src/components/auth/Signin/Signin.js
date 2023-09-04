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
import { Link as RouterLink } from 'react-router-dom';

import AuthLayout from 'components/layouts/AuthLayout/AuthLayout';
import Copyright from 'components/Copyright';

import './Signin.scss';

const Signin = () => {

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
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
          label="Usuario o correo electrónico" autoComplete="email"/>
        <TextField margin="normal" required fullWidth id="password" name="password"
          label="Contraseña" type="password" autoComplete="current-password"/>
        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Recuérdame"/>
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

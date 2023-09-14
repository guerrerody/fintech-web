import { useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Select, TextField } from "@mui/material";
import Copyright from "components/Copyright";


const GastosRegistro = () => {

  const navigate = useNavigate();

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async () => {

    await axios.get('http://localhost:8080/api/auth/auth', {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) { return exito.status }).catch(function (error) { navigate('/signin') });
  }

  return (
    <>
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>GASTOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton focus__button">REGISTRO</button>
          <button className="boton" onClick={() => { navigate('/gastos-historial') }}>HISTORIAL</button>
        </div>
      </div>
      {/* onSubmit={handleSubmit} */}
      <div className="container" style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <Box component="form" noValidate sx={{ mt: 2 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
            <TextField margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
              label="Nombre" autoComplete="nombre" />

            <TextField margin="normal" required fullWidth autoFocus id="categoria" name="categoria"
              label="Categoria" autoComplete="categoria" />
            <TextField margin="normal" required fullWidth autoFocus id="metodo_pago" name="metodo_pago"
              label="Metodo de pago" autoComplete="metodo_pago" />
            <TextField margin="normal" required fullWidth autoFocus id="modalidad" name="modalidad"
              label="Modalidad" autoComplete="modalidad" />
            <TextField margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
              label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} />
            <TextField margin="normal" required fullWidth autoFocus id="impuesto" name="impuesto"
              label="Impuesto" autoComplete="impuesto" />
            <TextField margin="normal" required fullWidth autoFocus id="monto" name="monto"
              label="Monto" autoComplete="monto" />


            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} style={{ gridColumn: '1 / 3' }}>
              Iniciar Sesión
            </Button>
          </Box>
        </div>

        <div>
          <TextField margin="normal" required fullWidth autoFocus id="fecha" name="fecha"
            label="Fecha" autoComplete="fecha" />
          <h2>text</h2>
          <h3>imagen</h3>
        </div>
      </div>

      <Footer></Footer>
    </>
  )
}

export default GastosRegistro;

import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";


const PresupuestoRegistro = () => {

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.post('http://localhost:8080/api/presupuesto', {
      fecha: datos.get('fecha'),
      fecha_culminacion: datos.get('fecha_culminacion'),
      nombre: datos.get('nombre'),
      descripcion: datos.get('descripcion'),
      monto: datos.get('monto')
    }, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'PRESUPUESTO CREADO',
        text: 'Presupuesto creado correctamente!'
      });

      navigate('/presupuestos-historial');
    }).catch(function (error) {

      const errores = error.response.data.errors.map(errores => '\n\n' + errores.msg);

      Swal.fire({
        icon: 'error',
        title: 'NO SE CUMPLEN LOS PARAMETROS',
        text: errores
      });

    });

  }

  return (
    <>
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTO</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton focus__button">REGISTRO</button>
          <button className="boton" onClick={() => { navigate('/Presupuestos-historial') }}>HISTORIAL</button>
        </div>
      </div>
      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }} style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField margin="normal" required fullWidth autoFocus id="fecha" name="fecha"
                label="Fecha" autoComplete="fecha" />

              <TextField margin="normal" required fullWidth autoFocus id="fecha_culminacion" name="fecha_culminacion"
                label="fecha culminacion" autoComplete="" />

              <TextField margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre"/>

              <TextField margin="normal" required fullWidth autoFocus id="monto" name="monto"
                label="monto" autoComplete="0.00" />

              <TextField margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} style={{ gridColumn: '2 / 3' }}>
                REGISTRAR
              </Button>
            </div>
          </div>

          <div>
            <h2>text</h2>
            <h3>imagen</h3>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default PresupuestoRegistro;

import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Swal from "sweetalert2";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import presupuestos from 'assets/images/presupuestos.jpeg';
import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


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
      <MenuApp />
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <img src={logo} alt="Logo" style={{ width: 150 }}/>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTO</h1>
      </div>

      <Box sx={{ display:'flex', justifyContent:'center', marginBottom: 5 }}>
        <div>
          <Button variant="contained" className="boton focus__button">REGISTRO</Button>
          <Button className="boton" onClick={() => { navigate('/Presupuestos-historial') }}>HISTORIAL</Button>
        </div>
      </Box>

      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, mx: 5, p: 3, backgroundColor:"#f7f7f7" }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{width: '55%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField type="date" sx={{my: 3}} margin="normal" fullWidth autoFocus id="fecha" name="fecha"
                label="Fecha" autoComplete="fecha" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField type="date" sx={{my: 3}} margin="normal" fullWidth id="fecha_culminacion" name="fecha_culminacion"
                label="fecha culminacion" autoComplete="" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField sx={{my: 3}} margin="normal" required fullWidth id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre" variant="standard"/>

              <TextField type="number" sx={{my: 3}} margin="normal" fullWidth autoFocus id="monto" name="monto"
                label="monto" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField sx={{my: 3}} margin="normal" required fullWidth id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard" />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: "8px" }} style={{ gridColumn: '2 / 3' }}>
                REGISTRAR
              </Button>
            </div>
          </div>

          <div style={{ width: '35%'}}>
            <h3 >
            ¡UN PRESUPUESTO ES LA GUÍA QUE DEBE DICTAR COMO GASTAR TU DINERO Y TE DIRÁ CON PRECISIÓN EN CUANTO DISPONES PARA CADA DÍA Y PARA CADA ACTIVIDAD!
            </h3>
            <Box>
            <img src={presupuestos} alt="gastos" style={{ width: '90%', borderRadius:'15px' }}/>
            </Box>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default PresupuestoRegistro;

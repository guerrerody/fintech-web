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
import prestamos from 'assets/images/prestamos.jpeg';
import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const PrestamosRegistro = () => {

  const navigate = useNavigate();

  const [metodos_pago, setMetodos_pago] = useState([]);

  useEffect(() => {
    verificarSesion();
    rellenarOptions();
  }, []);

  const verificarSesion = async () => {

    await axios.get('http://localhost:8080/api/auth/auth', {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) { return exito.status }).catch(function (error) { navigate('/signin') });
  }

  const rellenarOptions = async () => {
    await axios.get('http://localhost:8080/api/generales/registrar-gastos', {
      headers: {
        'token-e': getJWT()
      }
    })
      .then(function (arreglo) {
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <MenuItem value={metPag[1]}>{metPag[0]}</MenuItem>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.post('http://localhost:8080/api/prestamo', {
      fecha: datos.get('fecha'),
      fecha_cumplimiento: datos.get('fecha_cumplimiento'),
      descripcion: datos.get('descripcion'),
      total: datos.get('total'),
      metodo_pago_id: datos.get('metodo_pago')
    }, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'PRESTAMO CREADO',
        text: 'Prestamo creado correctamente!'
      });

      navigate('/prestamos-historial');
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESTAMOS</h1>
      </div>

      <Box sx={{ display:'flex', justifyContent:'center', marginBottom: 5 }}>
        <div>
          <Button variant="contained" className="boton focus__button">REGISTRO</Button>
          <Button className="boton" onClick={() => { navigate('/prestamos-historial') }}>HISTORIAL</Button>
        </div>
      </Box>

      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, mx: 5, p: 3, backgroundColor:"#f7f7f7" }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{width: '55%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField type="date" sx={{my: 3 }} margin="normal" fullWidth autoFocus id="fecha" name="fecha"
                label="Fecha" autoComplete="fecha" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField type="date" sx={{my: 3}} margin="normal" fullWidth id="fecha_cumplimiento" name="fecha_cumplimiento"
                label="fecha cumplimiento" autoComplete="" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField sx={{my: 3}} margin="normal" required fullWidth id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard"/>

              <FormControl variant="standard" sx={{ ml: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="metodo_pago-label">METODO DE PAGO</InputLabel>
                <Select labelId="metodo_pago-label" className="browser-default" defaultValue={999} id="metodo_pago" name="metodo_pago">
                  <MenuItem value="999" disabled selected>-- SELECCIONE --</MenuItem>
                  {metodos_pago}
                </Select>
              </FormControl>

              <TextField type="number" sx={{my: 3}} margin="normal" fullWidth id="total" name="total"
                label="Total" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: "8px" }} style={{ gridColumn: '2 / 3' }}>
                REGISTRAR
              </Button>
            </div>
          </div>

          <div style={{ width: '35%'}}>
            <h3 >
            ¡CONSIDERA SIEMPRE A QUIEN PRESTAR DINERO, PUEDE QUE NO TE LO DEVUELVAN!
            </h3>
            <Box>
            <img src={prestamos} alt="prestamos" style={{ width: '90%', borderRadius:'15px' }}/>
            </Box>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default PrestamosRegistro;

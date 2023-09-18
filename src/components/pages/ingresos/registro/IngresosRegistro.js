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
import ingresos from 'assets/images/ingresos.jpeg';
import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const IngresosRegistro = () => {

  const navigate = useNavigate();

  const [categoria_ingresos, setCategoria_ingresos] = useState([]);
  const [metodos_pago, setMetodos_pago] = useState([]);
  const [modalidad, setModalidad] = useState([]);
  const [impuesto, setImpuesto] = useState([]);

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
        setCategoria_ingresos(arreglo.data.nombresCatIng.map(catIng => <MenuItem value={catIng[1]}>{catIng[0]}</MenuItem>));
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <MenuItem value={metPag[1]}>{metPag[0]}</MenuItem>));
        setModalidad(arreglo.data.nombresModPag.map(modPag => <MenuItem value={modPag[1]}>{modPag[0]}</MenuItem>));
        setImpuesto(arreglo.data.nombresImp.map(imp => <MenuItem value={imp[1]}>{imp[0]}</MenuItem>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.post('http://localhost:8080/api/ingreso', {
      fecha: datos.get('fecha'),
      nombre: datos.get('nombre'),
      descripcion: datos.get('descripcion'),
      monto: datos.get('monto'),
      categoria_ingreso_id: datos.get('categoria_ingreso'),
      modalidad_pago_id: datos.get('modalidad_pago'),
      metodo_pago_id: datos.get('metodo_pago'),
      impuesto_id: datos.get('impuesto')
    }, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'INGRESO CREADO',
        text: 'Ingreso creado correctamente!'
      });

      navigate('/ingresos-historial');
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>INGRESOS</h1>
      </div>

      <Box sx={{ display:'flex', justifyContent:'center', marginBottom: 5 }}>
        <div>
          <Button variant="contained" className="boton focus__button">REGISTRO</Button>
          <Button className="boton" onClick={() => { navigate('/ingresos-historial') }}>HISTORIAL</Button>
        </div>
      </Box>

      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, mx: 5, p: 3, backgroundColor:"#f7f7f7" }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{width: '55%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField sx={{my: 3}} margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre" variant="standard" />
              <FormControl variant="standard" sx={{ ml: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="categoria_ingreso-label">CATEGORIA INGRESO</InputLabel>
                <Select labelId="categoria_ingreso-label" className="browser-default" defaultValue={999} id="categoria_ingreso" name="categoria_ingreso">
                  <MenuItem value="999" disabled selected>-- SELECCIONE --</MenuItem>
                  {categoria_ingresos}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ ml: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="metodo_pago-label">METODO DE PAGO</InputLabel>
                <Select labelId="metodo_pago-label" className="browser-default" defaultValue={999} id="metodo_pago" name="metodo_pago">
                  <MenuItem value="999" disabled selected>-- SELECCIONE --</MenuItem>
                  {metodos_pago}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ ml: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="modalidad_pago-label">MODALIDAD DE PAGO</InputLabel>
                <Select labelId="modalidad_pago-label" className="browser-default" defaultValue={999} id="modalidad_pago" name="modalidad_pago">
                  <MenuItem value="999" disabled selected>-- SELECCIONE --</MenuItem>
                  {modalidad}
                </Select>
              </FormControl>
              <TextField sx={{my: 3}} margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard" />
              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="impuesto-label">IMPUESTO</InputLabel>
                <Select labelId="impuesto-label" className="browser-default" defaultValue={999} id="impuesto" name="impuesto">
                  <MenuItem value="999" disabled selected>-- SELECCIONE --</MenuItem>
                  {impuesto}
                </Select>
              </FormControl>
              <TextField type="number" sx={{my: 3}} margin="normal" fullWidth autoFocus id="monto" name="monto"
                label="Monto" autoComplete="monto" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, borderRadius: "8px" }} style={{ gridColumn: '2 / 3' }}>
                REGISTRAR
              </Button>
            </div>
          </div>

          <div style={{ width: '35%'}}>
            <TextField type="date" margin="normal" fullWidth autoFocus id="fecha" name="fecha"
              label="Fecha" autoComplete="fecha" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>
            <h3 >
            !RECUERDA AHORRAR UNA PARTE DE TUS INGRESOS Y VERÁS QUE LOGRARÁS MUY PRONTO TUS METAS!
            </h3>
            <Box>
            <img src={ingresos} alt="ingresos" style={{ width: '90%', borderRadius:'15px' }}/>
            </Box>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default IngresosRegistro;

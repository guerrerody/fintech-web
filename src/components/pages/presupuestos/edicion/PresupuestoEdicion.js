import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Copyright from "components/Copyright";
import Swal from "sweetalert2";
import presupuestos from 'assets/images/presupuestos.jpeg';

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const PresupuestoEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    verificarSesion();
    obtenerPresupuesto();
  }, []);

  const eliminarPresupuestos = async (id) => {
    await axios.delete('http://localhost:8080/api/presupuesto/' + id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'PRESUPUESTO ELIMINADO',
        text: 'El presupuestos' + id + 'fue eliminado correctamente.'
      });

      navigate('/presupuestos-historial');
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR AL INTENTAR ELIMINAR EL PRESUPUESTO'
      });

      console.error(error);
    });
  }

  const verificarSesion = async () => {

    await axios.get('http://localhost:8080/api/auth/auth', {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) { return exito.status }).catch(function (error) {
      if (error.response) {
        Swal.fire({
          icon: 'error',
          title: 'No estas autorizado a estar aqui',
          text: error.response.data.msg
        });
        console.log(error.response.status);
        navigate('/signin');
      } else if (error.request) {
        Swal.fire({
          icon: 'error',
          title: 'Error con el servidor',
          text: "Error al intentar comunicarse con el servidor. Revise su consola para mas informacion."
        });

        console.log(error.request);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error interno',
          text: 'Ocurrio un error al intentar enviar la peticion al servidor.'
        });
      }
    });
  }

  const obtenerPresupuesto = async () => {

    await axios.get('http://localhost:8080/api/presupuesto/' + params.id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) {


      let fecha = document.getElementById("fecha");
      fecha.value = exito.data.presupuesto.fecha.substring(0,10);

      const fecha_culminacion = document.getElementById("fecha_culminacion");
      fecha_culminacion.value = exito.data.presupuesto.fecha_culminacion.substring(0,10);

      const nombre = document.getElementById("nombre");
      nombre.value = exito.data.presupuesto.nombre;

      const monto = document.getElementById("monto");
      monto.value = exito.data.presupuesto.monto;

      const descripcion = document.getElementById("descripcion");
      descripcion.value = exito.data.presupuesto.descripcion;

    }).catch(function (error) { console.log(error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.put('http://localhost:8080/api/presupuesto/' + params.id, {
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
        title: 'GASTO EDITADO',
        text: 'Gasto editado correctamente!'
      });
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

      <Box sx={{ display: 'flex', justifyContent:'center', textAlign: 'center'}}>
        <div style={{ backgroundColor:'#FF570C', borderRadius:'15px', width: '50%', height: '10%'}}>
          <h2 style={{ color: '#ffffff', fontWeight: 'bold', margin: 0 }}>PRESUPUESTO - {params.id}</h2>
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

              <TextField type="number" sx={{my: 3}} margin="normal" fullWidth id="monto" name="monto"
                label="monto" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <TextField sx={{my: 3}} margin="normal" required fullWidth id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard"/>

              <div style={{ display:'flex', justifyContent:'flex-end', gridColumn: '2 / 3'}}>
              <Button type="submit"  variant="contained" sx={{ mt: 3, mb: 2, borderRadius: "8px", width: '70%' }} >
                Editar
              </Button>
              <Button onClick={() => {eliminarPresupuestos(params.id)}} variant="contained" sx={{ mt: 3, mb: 2, mx: 1, backgroundColor:"#606470", borderRadius: "8px", width: '70%' }}>
                Eliminar
              </Button>
              </div>
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

export default PresupuestoEdicion;


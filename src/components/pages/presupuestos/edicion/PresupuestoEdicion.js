import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Select, TextField } from "@mui/material";
import Copyright from "components/Copyright";
import Swal from "sweetalert2";


const PresupuestoEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  useEffect(() => {
    verificarSesion();
    obtenerPresupuesto();
  }, []);

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
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTO</h1>
      </div>

      <div className="center">
        <div>
          <h2 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTO - {params.id}</h2>
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
                EDITAR
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

export default PresupuestoEdicion;


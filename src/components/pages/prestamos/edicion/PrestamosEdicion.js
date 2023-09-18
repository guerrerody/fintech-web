import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Select, TextField } from "@mui/material";
import Copyright from "components/Copyright";
import Swal from "sweetalert2";


const PrestamosEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  const [metodos_pago, setMetodos_pago] = useState([]);

  useEffect(() => {
    verificarSesion();
    rellenarOptions();
    obtenerGasto();
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

  const rellenarOptions = async () => {
    await axios.get('http://localhost:8080/api/generales/registrar-gastos', {
      headers: {
        'token-e': getJWT()
      }
    })
      .then(function (arreglo) {
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <option value={metPag[1]}>{metPag[0]}</option>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const obtenerGasto = async () => {

    await axios.get('http://localhost:8080/api/prestamo/' + params.id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) {

      console.log(exito);
      let fecha = document.getElementById("fecha");
      fecha.value = exito.data.prestamo.fecha.substring(0,10);

      const fecha_cumplimiento = document.getElementById("fecha_cumplimiento");
      fecha_cumplimiento.value = exito.data.prestamo.fecha_cumplimiento.substring(0,10);

      const descripcion = document.getElementById("descripcion");
      descripcion.value = exito.data.prestamo.descripcion;

      const metodo_pago = document.getElementById("metodo_pago");
      metodo_pago.value = exito.data.prestamo.metodo_pago_id;

      const total = document.getElementById("total");
      total.value = exito.data.prestamo.total;

      console.log(total);
    }).catch(function (error) { console.log(error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.put('http://localhost:8080/api/prestamo/' + params.id, {
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESTAMOS</h1>
      </div>

      <div className="center">
        <div>
          <h2 style={{ color: '#FF570C', fontWeight: 'bold' }}>INGRESO - {params.id}</h2>
        </div>
      </div>
      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }} style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField margin="normal" required fullWidth autoFocus id="fecha" name="fecha"
                label="Fecha" autoComplete="fecha" />

              <TextField margin="normal" required fullWidth autoFocus id="fecha_cumplimiento" name="fecha_cumplimiento"
                label="fecha cumplimiento" autoComplete="" />

              <TextField margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} />

              <div>
                <label>METODO DE PAGO</label>
                <select className="browser-default" defaultValue={999} id="metodo_pago" name="metodo_pago">
                  <option value="999" disabled selected>-- SELECCIONE --</option>
                  {metodos_pago}
                </select>
              </div>

              <TextField margin="normal" required fullWidth autoFocus id="total" name="total"
                label="Total" autoComplete="0.00" />

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

export default PrestamosEdicion;


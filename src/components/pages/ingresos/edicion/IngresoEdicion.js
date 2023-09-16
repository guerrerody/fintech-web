import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, Checkbox, FormControlLabel, Grid, Link, Select, TextField } from "@mui/material";
import Copyright from "components/Copyright";
import Swal from "sweetalert2";


const IngresosEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  const [categoria_ingresos, setCategoria_ingresos] = useState([]);
  const [metodos_pago, setMetodos_pago] = useState([]);
  const [modalidad, setModalidad] = useState([]);
  const [impuesto, setImpuesto] = useState([]);

  useEffect(() => {
    verificarSesion();
    rellenarOptions();
    obtenerIngreso();
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
        setCategoria_ingresos(arreglo.data.nombresCatIng.map(catIng => <option value={catIng[1]}>{catIng[0]}</option>));
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <option value={metPag[1]}>{metPag[0]}</option>));
        setModalidad(arreglo.data.nombresModPag.map(modPag => <option value={modPag[1]}>{modPag[0]}</option>));
        setImpuesto(arreglo.data.nombresImp.map(imp => <option value={imp[1]}>{imp[0]}</option>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const obtenerIngreso = async () => {

    await axios.get('http://localhost:8080/api/ingreso/' + params.id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) {
      const fecha = document.getElementById("fecha");
      fecha.value = exito.data.ingreso.fecha.substring(0,10);

      const nombre = document.getElementById("nombre");
      nombre.value = exito.data.ingreso.nombre;

      const categoria_ingresos = document.getElementById("categoria_ingreso");
      categoria_ingresos.value = exito.data.ingreso.categoria_ingreso_id;

      const metodo_pago = document.getElementById("metodo_pago");
      metodo_pago.value = exito.data.ingreso.metodo_pago_id;

      const modalidad_pago = document.getElementById("modalidad_pago");
      modalidad_pago.value = exito.data.ingreso.modalidad_pago_id;

      const descripcion = document.getElementById("descripcion");
      descripcion.value = exito.data.ingreso.descripcion;

      const impuesto = document.getElementById("impuesto");
      impuesto.value = exito.data.ingreso.impuesto_id;

      const monto = document.getElementById("monto");
      monto.value = exito.data.ingreso.monto;
    }).catch(function (error) { console.log(error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.put('http://localhost:8080/api/ingreso/' + params.id, {
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
        title: 'INGRESOS EDITADO',
        text: 'Ingresos editado correctamente!'
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>INGRESOS</h1>
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
              <TextField margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre" />
              <div>
                <label>CATEGORIA INGRESOS</label>
                <select className="browser-default" defaultValue={0} id="categoria_ingreso" name="categoria_ingreso">
                  <option value="0" disabled selected>-- SELECCIONE --</option>
                  {categoria_ingresos}
                </select>
              </div>
              <div>
                <label>METODO DE PAGO</label>
                <select className="browser-default" defaultValue={0} id="metodo_pago" name="metodo_pago">
                  <option value="0" disabled selected>-- SELECCIONE --</option>
                  {metodos_pago}
                </select>
              </div>
              <div>
                <label>MODALIDAD DE PAGO</label>
                <select className="browser-default" defaultValue={0} id="modalidad_pago" name="modalidad_pago">
                  <option value="0" disabled selected>-- SELECCIONE --</option>
                  {modalidad}
                </select>
              </div>
              <TextField margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} />
              <div>
                <label>IMPUESTO</label>
                <select className="browser-default" defaultValue={0} id="impuesto" name="impuesto">
                  <option value="0" disabled selected>-- SELECCIONE --</option>
                  {impuesto}
                </select>
              </div>
              <TextField margin="normal" required fullWidth autoFocus id="monto" name="monto"
                label="Monto" autoComplete="monto" />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} style={{ gridColumn: '2 / 3' }}>
                EDITAR
              </Button>
            </div>
          </div>

          <div>
            <TextField margin="normal" required fullWidth autoFocus id="fecha" name="fecha"
              label="Fecha" autoComplete="fecha" />
            <h2>text</h2>
            <h3>imagen</h3>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default IngresosEdicion;


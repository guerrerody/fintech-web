import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";


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
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <option value={metPag[1]}>{metPag[0]}</option>));
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
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESTAMOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton focus__button">REGISTRO</button>
          <button className="boton" onClick={() => { navigate('/prestamos-historial') }}>HISTORIAL</button>
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

export default PrestamosRegistro;

import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, TextField } from "@mui/material";
import Swal from "sweetalert2";


const GastosRegistro = () => {

  const navigate = useNavigate();

  const [categoria_gastos, setCategoria_gastos] = useState([]);
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
        setCategoria_gastos(arreglo.data.nombresCatGas.map(catGas => <option value={catGas[1]}>{catGas[0]}</option>));
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <option value={metPag[1]}>{metPag[0]}</option>));
        setModalidad(arreglo.data.nombresModPag.map(modPag => <option value={modPag[1]}>{modPag[0]}</option>));
        setImpuesto(arreglo.data.nombresImp.map(imp => <option value={imp[1]}>{imp[0]}</option>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.post('http://localhost:8080/api/gasto', {
      fecha: datos.get('fecha'),
      nombre: datos.get('nombre'),
      descripcion: datos.get('descripcion'),
      monto: datos.get('monto'),
      categoria_gasto_id: datos.get('categoria_gasto'),
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
        title: 'GASTO CREADO',
        text: 'Gasto creado correctamente!'
      });

      navigate('/gastos-historial');
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>GASTOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton focus__button">REGISTRO</button>
          <button className="boton" onClick={() => { navigate('/gastos-historial') }}>HISTORIAL</button>
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
                <label>CATEGORIA GASTO</label>
                <select className="browser-default" defaultValue={999} id="categoria_gasto" name="categoria_gasto">
                  <option value="999" disabled selected>-- SELECCIONE --</option>
                  {categoria_gastos}
                </select>
              </div>
              <div>
                <label>METODO DE PAGO</label>
                <select className="browser-default" defaultValue={999} id="metodo_pago" name="metodo_pago">
                  <option value="999" disabled selected>-- SELECCIONE --</option>
                  {metodos_pago}
                </select>
              </div>
              <div>
                <label>MODALIDAD DE PAGO</label>
                <select className="browser-default" defaultValue={999} id="modalidad_pago" name="modalidad_pago">
                  <option value="999" disabled selected>-- SELECCIONE --</option>
                  {modalidad}
                </select>
              </div>
              <TextField margin="normal" required fullWidth autoFocus id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} />
              <div>
                <label>IMPUESTO</label>
                <select className="browser-default" defaultValue={999} id="impuesto" name="impuesto">
                  <option value="999" disabled selected>-- SELECCIONE --</option>
                  {impuesto}
                </select>
              </div>
              <TextField margin="normal" required fullWidth autoFocus id="monto" name="monto"
                label="Monto" autoComplete="monto" />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} style={{ gridColumn: '2 / 3' }}>
                REGISTRAR
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

export default GastosRegistro;

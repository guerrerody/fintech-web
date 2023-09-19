import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Swal from "sweetalert2";

import ingresos from 'assets/images/ingresos.jpeg';

import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const IngresosEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  const [categoria_ingresos, setCategoria_ingresos] = useState([]);
  const [metodos_pago, setMetodos_pago] = useState([]);

  const [selectedCategoriaIngreso, setSelectedCategoriaIngreso] = useState("");
  const [selectedMetodoPago, setSelectedMetodoPago] = useState("");

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
        setCategoria_ingresos(arreglo.data.nombresCatIng.map(catIng => <MenuItem value={catIng[1]}>{catIng[0]}</MenuItem>));
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <MenuItem value={metPag[1]}>{metPag[0]}</MenuItem>));
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

      const descripcion = document.getElementById("descripcion");
      descripcion.value = exito.data.ingreso.descripcion;

      const monto = document.getElementById("monto");
      monto.value = exito.data.ingreso.monto;

      setSelectedCategoriaIngreso(exito.data.ingreso.categoria_ingreso_id);
      setSelectedMetodoPago(exito.data.ingreso.metodo_pago_id);

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
      metodo_pago_id: datos.get('metodo_pago'),
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
      <MenuApp />
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around' }}>
          <img src={logo} alt="Logo" style={{ width: 150 }}/>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>INGRESOS</h1>
      </div>

      <Box sx={{ display: 'flex', justifyContent:'center', textAlign: 'center'}}>
        <div style={{ backgroundColor:'#FF570C', borderRadius:'15px', width: '50%', height: '10%'}}>
          <h2 style={{ color: '#ffffff', fontWeight: 'bold', margin: 0 }}>INGRESO - {params.id}</h2>
        </div>
      </Box>
      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, mx: 5, p: 3, backgroundColor:"#f7f7f7" }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{width: '55%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField sx={{my: 3}} margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre" style={{ gridColumn: '1 / 3' }} variant="standard" />

              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="categoria_ingreso-label">CATEGORIA INGRESOS</InputLabel>
                <Select labelId="categoria_ingreso-label" className="browser-default" value={selectedCategoriaIngreso} onChange={(e) => setSelectedCategoriaIngreso(e.target.value)} id="categoria_ingreso" name="categoria_ingreso">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {categoria_ingresos}
                </Select>
              </FormControl>

              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="metodo_pago-label">METODO DE PAGO</InputLabel>
                <Select labelId="metodo_pago-label" className="browser-default" value={selectedMetodoPago} onChange={(e) => setSelectedMetodoPago(e.target.value)} id="metodo_pago" name="metodo_pago">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {metodos_pago}
                </Select>
              </FormControl>

              <TextField sx={{my: 3}} margin="normal" required fullWidth id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard" />

              <TextField type="number" sx={{my: 3}} margin="normal" required fullWidth id="monto" name="monto"
                label="Monto" autoComplete="monto" style={{ gridColumn: '1 / 3' }} variant="standard" InputLabelProps={{ shrink: true, required: true }}/>

              <div style={{ display:'flex', justifyContent:'flex-end', gridColumn: '2 / 3'}}>
              <Button type="submit"  variant="contained" sx={{ mt: 3, mb: 2, borderRadius: "8px", width: '70%' }} >
                Editar
              </Button>
              <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2, mx: 1, backgroundColor:"#606470", borderRadius: "8px", width: '70%' }}>
                Eliminar
              </Button>
              </div>
            </div>
          </div>

          <div style={{ width: '35%'}}>
            <TextField type="date" margin="normal" fullWidth id="fecha" name="fecha"
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

export default IngresosEdicion;


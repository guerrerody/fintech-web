import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from 'axios';
import { getJWT } from "../../../utils/localStorage";
import Footer from "components/shared/footer";
import { Box, Button, TextField, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Swal from "sweetalert2";
import gastos from 'assets/images/gastos.jpeg';

import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const GastosEdicion = () => {

  const navigate = useNavigate();
  let params = useParams();

  const [categoria_gastos, setCategoria_gastos] = useState([]);
  const [metodos_pago, setMetodos_pago] = useState([]);
  const [modalidad, setModalidad] = useState([]);
  const [impuesto, setImpuesto] = useState([]);

  // Estados para almacenar los valores seleccionados de cada lista desplegable
  const [selectedCategoriaGasto, setSelectedCategoriaGasto] = useState("");
  const [selectedMetodoPago, setSelectedMetodoPago] = useState("");
  const [selectedModalidadPago, setSelectedModalidadPago] = useState("");
  const [selectedImpuesto, setSelectedImpuesto] = useState("");


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
        setCategoria_gastos(arreglo.data.nombresCatGas.map(catGas => <MenuItem value={catGas[1]}>{catGas[0]}</MenuItem>));
        setMetodos_pago(arreglo.data.nombresMetPag.map(metPag => <MenuItem value={metPag[1]}>{metPag[0]}</MenuItem>));
        setModalidad(arreglo.data.nombresModPag.map(modPag => <MenuItem value={modPag[1]}>{modPag[0]}</MenuItem>));
        setImpuesto(arreglo.data.nombresImp.map(imp => <MenuItem value={imp[1]}>{imp[0]}</MenuItem>));
      })
      .catch(function (error) { console.log("error interno: " + error) });
  }

  const obtenerGasto = async () => {

    await axios.get('http://localhost:8080/api/gasto/' + params.id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (exito) {
      const fecha = document.getElementById("fecha");
      fecha.value = exito.data.gasto.fecha.substring(0,10);

      const nombre = document.getElementById("nombre");
      nombre.value = exito.data.gasto.nombre;

      const descripcion = document.getElementById("descripcion");
      descripcion.value = exito.data.gasto.descripcion;

      const monto = document.getElementById("monto");
      monto.value = exito.data.gasto.monto;

      setSelectedCategoriaGasto(exito.data.gasto.categoria_gasto_id);
      setSelectedMetodoPago(exito.data.gasto.metodo_pago_id);
      setSelectedModalidadPago(exito.data.gasto.modalidad_pago_id);
      setSelectedImpuesto(exito.data.gasto.impuesto_id);

    }).catch(function (error) { console.log(error) });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const datos = new FormData(event.currentTarget);

    await axios.put('http://localhost:8080/api/gasto/' + params.id, {
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>GASTOS</h1>
      </div>

      <Box sx={{ display: 'flex', justifyContent:'center', textAlign: 'center'}}>
        <div style={{ backgroundColor:'#FF570C', borderRadius:'15px', width: '50%', height: '10%'}}>
          <h2 style={{ color: '#ffffff', fontWeight: 'bold', margin: 0 }}>GASTO - {params.id}</h2>
        </div>
      </Box>
      {/* onSubmit={handleSubmit} */}
      <div className="container" >
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2, mx: 5, p: 3, backgroundColor:"#f7f7f7" }} style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{width: '55%'}}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}>
              <TextField sx={{my: 3}} margin="normal" required fullWidth autoFocus id="nombre" name="nombre"
                label="Nombre" autoComplete="nombre" variant="standard" />
              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="categoria_gasto-label">CATEGORIA GASTO</InputLabel>
                <Select labelId="categoria_gasto-label" className="browser-default" value={selectedCategoriaGasto} onChange={(e) => setSelectedCategoriaGasto(e.target.value)} id="categoria_gasto" name="categoria_gasto">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {categoria_gastos}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="metodo_pago-label">METODO DE PAGO</InputLabel>
                <Select labelId="metodo_pago-label" className="browser-default" value={selectedMetodoPago} onChange={(e) => setSelectedMetodoPago(e.target.value)} id="metodo_pago" name="metodo_pago">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {metodos_pago}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="modalidad_pago-label">MODALIDAD DE PAGO</InputLabel>
                <Select labelId="modalidad_pago-label" className="browser-default" value={selectedModalidadPago} onChange={(e) => setSelectedModalidadPago(e.target.value)} id="modalidad_pago" name="modalidad_pago">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {modalidad}
                </Select>
              </FormControl>
              <TextField sx={{my: 3}} margin="normal" required fullWidth id="descripcion" name="descripcion"
                label="Descripcion" autoComplete="descripcion" style={{ gridColumn: '1 / 3' }} variant="standard" />
              <FormControl variant="standard" sx={{ mr: 2, my: 3, minWidth: 120 }}>
                <InputLabel id="impuesto-label">IMPUESTO</InputLabel>
                <Select labelId="impuesto-label" className="browser-default" value={selectedImpuesto} onChange={(e) => setSelectedImpuesto(e.target.value)} id="impuesto" name="impuesto">
                  <MenuItem value="0" disabled selected>-- SELECCIONE --</MenuItem>
                  {impuesto}
                </Select>
              </FormControl>
              <TextField type="number" sx={{my: 3}} margin="normal" fullWidth id="monto" name="monto"
                label="Monto" autoComplete="monto" variant="standard" InputLabelProps={{ shrink: true, required: true }}/>
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
            <TextField type="date" margin="normal" required fullWidth autoFocus id="fecha" name="fecha"
              label="Fecha" autoComplete="fecha" placeholder="AAAA-MM-DD" variant="standard" InputLabelProps={{ shrink: true, required: true }}  />
            <h3 >
            ¡LOS GASTOS A CREDITO HARAN QUE TU DINERO VUELE LEJOS DE TUS MANOS!
            </h3>
            <Box>
            <img src={gastos} alt="gastos" style={{ width: '90%', borderRadius:'15px' }}/>
            </Box>
          </div>
        </Box>
      </div>

      <Footer></Footer>
    </>
  )
}

export default GastosEdicion;


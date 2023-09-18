import "./PresupuestoHistorial.scss";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getJWT } from "components/utils/localStorage";
import Footer from "components/shared/footer";
import formatFecha from "components/utils/helpers";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MenuApp from "components/shared/menuBar";

import logo from 'assets/images/logo.svg';


const PresupuestoHistorial = () => {
  const navigate = useNavigate();

  const [desde, setDesde] = useState(1);
  const [total, setTotal] = useState(0);

  const [presupuestos, setPresupuestos] = useState([]);

  const [lista, setLista] = useState([]);
  const [botones, setBotones] = useState([]);

  useEffect(() => {
    getPresupuestos();
  }, [presupuestos]);

  const atras = () => {
    if(desde > 1){
      setDesde(desde - 5);
    }
  }

  const siguiente = () => {
    if(desde + 5 < total){
      setDesde(desde + 5);
    }
  }

  const paginacion = (numero) => {
    setDesde((numero - 1) * 5 + 1);
  }

  const getPresupuestos = async () => {
    await axios.get('http://localhost:8080/api/presupuesto', {
      params: {
        desde: desde
      },
      headers: {
        'token-e': getJWT()
      }
    }).then(respuesta => {
      setPresupuestos(respuesta.data.filas);
      setTotal(respuesta.data.total);
      const array = [];
        for(let i = 1; i <= (total / 5 + 0.9); i++){
          array.push(<Button style={{ backgroundColor:'#FF570C', color:'#FFFFFF', borderRadius: 0 }} key={i} className="col s1" onClick={() => { paginacion(i) }}>{i}</Button>);
        }

        setBotones(array);
      setLista(presupuestos.map(presupuestos =><>
        <TableRow key={presupuestos.idpresupuesto}>
          <TableCell component="th" scope="row">{presupuestos.idpresupuesto}</TableCell>
          <TableCell>{presupuestos.fecha.substring(0,10)}</TableCell>
          <TableCell>{presupuestos.fecha_culminacion.substring(0,10)}</TableCell>
          <TableCell>{presupuestos.nombre}</TableCell>
          <TableCell>{presupuestos.descripcion}</TableCell>
          <TableCell>{presupuestos.monto}</TableCell>
          <TableCell><Button variant="contained" onClick={() => navigate('/presupuestos-edicion/' + presupuestos.idpresupuesto)}>E</Button></TableCell>
          <TableCell><Button variant="contained" onClick={() => eliminarPresupuestos(presupuestos.idpresupuesto)}>X</Button></TableCell>
        </TableRow></>
      ));
    }).catch(function (error) {
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
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR AL INTENTAR ELIMINAR EL PRESUPUESTO'
      });

      console.error(error);
    });
  }

  return (
    <>
      <MenuApp />
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around'}}>
          <img src={logo} alt="Logo" style={{ width: 150 }}/>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTOS</h1>
      </div>

      <Box sx={{ display:'flex', justifyContent:'center', marginBottom: 5 }}>
        <div>
          <Button className="boton" onClick={() => { navigate('/presupuestos-registro') }}>REGISTRO</Button>
          <Button variant="contained" className="boton focus__button">HISTORIAL</Button>
        </div>
      </Box>

      <Box sx={{ display:'flex', justifyContent:'center'}}>
        <TableContainer component={Paper} sx={{ width: '70%'}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="table_head">
              <TableRow>
                <TableCell>Nro</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Fecha Culminacion</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripcion</TableCell>
                <TableCell>Monto</TableCell>
                <TableCell>EDITAR</TableCell>
                <TableCell>ELIMINAR</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>{lista}</TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Box sx={{ m: 4, display: 'flex', justifyContent:'flex-end'}}>
        <div style={{ margin: '40px 0px',  }}>
          <Button style={{ backgroundColor:'#FF570C', color:'#FFFFFF', borderRadius: 0 }} className="col s1" onClick={() => { atras() }}>Atras</Button>
          {botones}
          <Button style={{ backgroundColor:'#FF570C', color:'#FFFFFF', borderRadius: 0 }} className="col s1" onClick={() => { siguiente() }}>Siguiente</Button>
        </div>
      </Box>

      <Footer></Footer>
    </>
  )
}

export default PresupuestoHistorial;

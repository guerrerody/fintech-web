import "./PrestamosHistorial.scss";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getJWT } from "components/utils/localStorage";
import Footer from "components/shared/footer";


const PrestamosHistorial = () => {
  const navigate = useNavigate();

  const [desde, setDesde] = useState(1);
  const [total, setTotal] = useState(0);

  const [prestamos, setPrestamos] = useState([]);

  const [lista, setLista] = useState([]);
  const [botones, setBotones] = useState([]);

  useEffect(() => {
    getPrestamos();
  }, [prestamos]);

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

  const getPrestamos = async () => {
    await axios.get('http://localhost:8080/api/prestamo', {
      params: {
        desde: desde
      },
      headers: {
        'token-e': getJWT()
      }
    }).then(respuesta => {
      setPrestamos(respuesta.data.filas);
      setTotal(respuesta.data.total);
      const array = [];
        for(let i = 1; i <= (total / 5 + 0.9); i++){
          array.push(<button key={i} className="col s1" onClick={() => { paginacion(i) }}>{i}</button>);
        }

        setBotones(array);
      setLista(prestamos.map(prestamos =>
        <tr key={prestamos.idprestamo}>
          <td className="centrar__nro">{prestamos.idprestamo}</td>
          <td>{prestamos.fecha.substring(0,10)}</td>
          <td>{prestamos.fecha_cumplimiento.substring(0,10)}</td>
          <td>{prestamos.descripcion}</td>
          <td>{prestamos.total}</td>
          <td>{prestamos.metodo_pago_id}</td>
          <td><button onClick={() => navigate('/prestamos-edicion/' + prestamos.idprestamo)}>E</button></td>
          <td><button onClick={() => eliminarPrestamo(prestamos.idprestamo)}>X</button></td>
        </tr>
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

  const eliminarPrestamo = async (id) => {
    await axios.delete('http://localhost:8080/api/prestamo/' + id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'PRESTAMO ELIMINADO',
        text: 'El prestamos' + id + 'fue eliminado correctamente.'
      });
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR AL INTENTAR ELIMINAR EL PRESTAMO'
      });

      console.error(error);
    });
  }

  return (
    <>
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around'}}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESTAMOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton" onClick={() => {navigate('/prestamos-registro')}}>REGISTRO</button>
          <button className="boton focus__button">HISTORIAL</button>
        </div>
      </div>

      <div className="container">
        <table className="striped">
          <thead>
            <tr>
              <th>NUMERO</th>
              <th>FECHA</th>
              <th>FECHA CUMPLIMIENTO</th>
              <th>DESCRIPCION</th>
              <th>TOTAL</th>
              <th>METODO DE PAGO</th>
              <th>EDITAR</th>
              <th>ELIMINAR</th>
            </tr>
          </thead>
          <tbody>{lista}</tbody>
        </table>
      </div>

      <div className="container ">
        <div className="right-align" style={{ margin: '40px 0px' }}>
          <button className="col s1" onClick={() => { atras() }}>atras</button>
          {botones}
          <button className="col s1" onClick={() => { siguiente() }}>siguiente</button>
        </div>

      </div>

      <Footer></Footer>
    </>
  )
}

export default PrestamosHistorial;

import "./PresupuestoHistorial.scss";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getJWT } from "components/utils/localStorage";
import Footer from "components/shared/footer";


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
          array.push(<button key={i} className="col s1" onClick={() => { paginacion(i) }}>{i}</button>);
        }

        setBotones(array);
      setLista(presupuestos.map(presupuestos =>
        <tr key={presupuestos.idpresupuesto}>
          <td className="centrar__nro">{presupuestos.idpresupuesto}</td>
          <td>{presupuestos.fecha.substring(0,10)}</td>
          <td>{presupuestos.fecha_culminacion.substring(0,10)}</td>
          <td>{presupuestos.nombre}</td>
          <td>{presupuestos.descripcion}</td>
          <td>{presupuestos.monto}</td>
          <td><button onClick={() => navigate('/presupuestos-edicion/' + presupuestos.idpresupuesto)}>E</button></td>
          <td><button onClick={() => eliminarPresupuestos(presupuestos.idpresupuesto)}>X</button></td>
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
      <div className="menubar">
        <div className="menubar" style={{ justifyContent: 'space-around'}}>
          <h4>Menu bar    .</h4>
          <h4>Logo</h4>
        </div>
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>PRESUPUESTOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton" onClick={() => {navigate('/presupuestos-registro')}}>REGISTRO</button>
          <button className="boton focus__button">HISTORIAL</button>
        </div>
      </div>

      <div className="container">
        <table className="striped">
          <thead>
            <tr>
              <th>NUMERO</th>
              <th>FECHA</th>
              <th>FECHA CULMINACION</th>
              <th>NOMBRE</th>
              <th>DESCRIPCION</th>
              <th>MONTO</th>
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

export default PresupuestoHistorial;

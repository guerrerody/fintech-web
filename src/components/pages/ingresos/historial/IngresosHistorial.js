import "./IngresosHistorial.scss";

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getJWT } from "components/utils/localStorage";
import Footer from "components/shared/footer";


const IngresosHistorial = () => {
  const navigate = useNavigate();

  const [desde, setDesde] = useState(1);
  const [total, setTotal] = useState(0);

  const [ingresos, setIngresos] = useState([]);

  const [lista, setLista] = useState([]);
  const [botones, setBotones] = useState([]);

  useEffect(() => {
    getIngresos();
  }, [ingresos]);

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

  const getIngresos = async () => {
    await axios.get('http://localhost:8080/api/ingreso', {
      params: {
        desde: desde
      },
      headers: {
        'token-e': getJWT()
      }
    }).then(respuesta => {
      setIngresos(respuesta.data.filas);
      setTotal(respuesta.data.total);
      const array = [];
        for(let i = 1; i <= (total / 5 + 0.9); i++){
          array.push(<button key={i} className="col s1" onClick={() => { paginacion(i) }}>{i}</button>);
        }

        setBotones(array);
      setLista(
        ingresos.map(ingresos =>
        <tr key={ingresos.idingreso}>
          <td className="centrar__nro">{ingresos.idingreso}</td>
          <td>{ingresos.fecha.substring(0,10)}</td>
          <td>{ingresos.nombre}</td>
          <td>{ingresos.descripcion}</td>
          <td>{ingresos.monto}</td>
          <td>{ingresos.categoria_ingreso_id}</td>
          <td>{ingresos.metodo_pago_id}</td>
          <td><button onClick={() => navigate('/ingresos-edicion/' + ingresos.idingreso)}>E</button></td>
          <td><button onClick={() => eliminarIngreso(ingresos.idingreso)}>X</button></td>
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

  const eliminarIngreso = async (id) => {
    await axios.delete('http://localhost:8080/api/ingreso/' + id, {
      headers: {
        'token-e': getJWT()
      }
    }).then(function (respuesta) {
      Swal.fire({
        icon: 'success',
        title: 'INGRESO ELIMINADO',
        text: 'El ingreso' + id + 'fue eliminado correctamente.'
      });
    }).catch(function (error) {
      Swal.fire({
        icon: 'error',
        title: 'ERROR AL INTENTAR ELIMINAR EL INGRESO'
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
        <h1 style={{ color: '#FF570C', fontWeight: 'bold' }}>INGRESOS</h1>
      </div>

      <div className="center">
        <div>
          <button className="boton" onClick={() => {navigate('/ingresos-registro')}}>REGISTRO</button>
          <button className="boton focus__button">HISTORIAL</button>
        </div>
      </div>

      <div className="container">
        <table className="striped">
          <thead>
            <tr>
              <th>NUMERO</th>
              <th>FECHA</th>
              <th>NOMBRE</th>
              <th>DESCRIPCION</th>
              <th>MONTO</th>
              <th>CATEGORIA</th>
              <th>METODO</th>
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

export default IngresosHistorial;

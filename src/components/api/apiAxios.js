import axios from 'axios';
import { getJWT } from "../utils/localStorage";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const BASE_URL = process.env.API_BASE_URL_BACKEND;
const AXIOS_TIMEOUT_MS = 10000;

const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
};

const ApiAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    verificarSesion();
  }, []);

  const verificarSesion = async() => {

    await axios.get('http://localhost:8080/api/auth/auth', {
        headers: {
          'token-e': getJWT()
        }
      }).then(function (exito) {return exito.status}).catch(function (error) {navigate('/signin')});
  }
}

export default ApiAuth;

/*
export const ApiHttp = async (method, endpoint, data = null, params = null, options = {}) => {

  const navigate = useNavigate();

    // header options
    options.headers = {
        ...defaultHeaders,
        ...options.headers
    }

    let jwt = getJWT()
    if (jwt) {
        options.headers["token-e"] = `${jwt}`;
    }

    let serviceResponse = {}
    const url = `${BASE_URL}${endpoint}`

    const servicePromise = axios({
        method: method.toLowerCase(),
        url,
        params,
        data,
        timeout: AXIOS_TIMEOUT_MS,
        ...options
    });

    console.log(`${method.toUpperCase()} ${url}`);

    try {
        const materializedPromise = await servicePromise.catch(function (error) {
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
        console.log("promise", materializedPromise)
        serviceResponse = materializedPromise.data;
        serviceResponse.headers = materializedPromise.headers;
    } catch (error) {
        if (error.response) {
            console.log("apiHttp -> error.response", error.response)
            serviceResponse = error.response.data;
        } else {
            console.log("apiHttp -> error", error)
            serviceResponse = error
        }
    }
    return serviceResponse;
};
*/

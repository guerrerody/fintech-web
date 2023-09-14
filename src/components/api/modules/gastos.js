import { apiHttp } from "../apiAxios"

export const getGastosAPI = () => apiHttp("GET", '/api/gastos');

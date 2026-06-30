import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios';
import { getToken, clearToken, getActiveEmpresaId } from './auth';

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_HOST || 'http://localhost:8000'}/api`
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    const empresaId = getActiveEmpresaId();
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `JWT ${token}`,
        ...(empresaId ? { 'X-Empresa-Id': String(empresaId) } : {})
      } as AxiosRequestHeaders
    };
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
export { parseApiError } from './apiError';

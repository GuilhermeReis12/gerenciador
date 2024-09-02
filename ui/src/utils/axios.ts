import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders
} from 'axios';
import { getToken, clearToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || 'http://localhost:8000'
});

api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `JWT ${token}`
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

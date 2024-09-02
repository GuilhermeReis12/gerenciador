export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getPerfil = () => {
  const perfil: string | null = localStorage.getItem('user');
  const perfilObj = perfil && JSON.parse(perfil);
  return perfilObj;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isLoginPage = (path: string): boolean => {
  return path === '/login' || path === '/';
};
export const TempoRestante = (dataFinal: string): string => {
  const agora = new Date();
  const dataFinalObj = new Date(dataFinal);
  dataFinalObj.setHours(23, 59, 59, 999);

  const diferenca = dataFinalObj.getTime() - agora.getTime();

  if (diferenca < 0) {
    return 'Tempo expirado';
  }

  const horas = Math.floor(diferenca / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

  return `${horas}:${minutos}:${segundos}`;
};

export function clearToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('provider');
  localStorage.removeItem('institucion');
}

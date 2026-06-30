export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getPerfil = () => {
  return getStoredUser();
};

export const getStoredUser = () => {
  const perfil: string | null = localStorage.getItem('user');
  if (!perfil) return null;
  try {
    return JSON.parse(perfil);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: Record<string, unknown>) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export type StoredEmpresa = {
  id: number;
  nome: string;
  cnpj?: string;
  ativo?: boolean;
};

export const getActiveEmpresaId = (): number | null => {
  const value = localStorage.getItem('activeEmpresaId');
  return value ? Number(value) : null;
};

export const setActiveEmpresaId = (empresaId: number) => {
  localStorage.setItem('activeEmpresaId', String(empresaId));
};

export const getStoredEmpresas = (): StoredEmpresa[] => {
  const raw = localStorage.getItem('empresas');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const setStoredEmpresas = (empresas: StoredEmpresa[]) => {
  localStorage.setItem('empresas', JSON.stringify(empresas));
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
  localStorage.removeItem('activeEmpresaId');
  localStorage.removeItem('empresas');
  localStorage.removeItem('institucion');
}

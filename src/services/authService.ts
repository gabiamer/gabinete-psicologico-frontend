import api from './api';

export interface LoginResponse {
  token: string;
  username: string;
  psicologoId: number | null;
  psicologoNombre: string | null;
  rol: string;
}

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', { username, password });
    return response.data;
  },
};

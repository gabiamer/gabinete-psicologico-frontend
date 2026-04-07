// src/services/carreraService.ts
import api from './api';

export const carreraService = {
  obtenerTodas: async () => {
    const response = await api.get('/carreras');
    return response.data.data || response.data;
  },

  crear: async (nombre: string, departamento: string) => {
    const response = await api.post('/carreras', {
      carrera: nombre,
      departamento
    });
    return response.data.data || response.data;
  },

  actualizar: async (id: number, nombre: string, departamento: string) => {
    const response = await api.put(`/carreras/${id}`, {
      carrera: nombre,
      departamento
    });
    return response.data.data || response.data;
  },

  eliminar: async (id: number) => {
    await api.delete(`/carreras/${id}`);
  },
};
// src/services/carreraService.ts
import api from './api';

export const carreraService = {
  obtenerTodas: async () => {
    const response = await api.get('/carreras');
    return response.data.data || response.data;
  },

  crear: async (nombre: string, departamento: number) => {
    const response = await api.post('/carreras', { 
      carrera: nombre, 
      departamento 
    });
    return response.data.data || response.data;
  }
};
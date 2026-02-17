// src/services/sesionService.ts
import api from './api';

export const sesionService = {
  obtenerPorPaciente: async (pacienteId: number) => {
    const response = await api.get(`/pacientes/${pacienteId}/sesiones`);
    return response.data.data || response.data;
  },

  crear: async (pacienteId: number, sesionData: any) => {
    const response = await api.post(`/pacientes/${pacienteId}/sesiones`, sesionData);
    return response.data.data || response.data;
  },

  actualizar: async (sesionId: number, sesionData: any) => {
    const response = await api.put(`/sesiones/${sesionId}`, sesionData);
    return response.data.data || response.data;
  },

  obtenerPorId: async (sesionId: number) => {
    const response = await api.get(`/sesiones/${sesionId}`);
    return response.data.data || response.data;
  }
};
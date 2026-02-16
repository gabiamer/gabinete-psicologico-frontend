// src/services/pacienteExternoService.ts
import api from './api';

export const pacienteExternoService = {
  crear: async (formData: any) => {
    const response = await api.post('/pacientes-externos', formData);
    return response.data.data?.id || response.data.id;
  },

  buscar: async (termino: string) => {
    const response = await api.get(`/pacientes-externos/buscar?q=${termino}`);
    return response.data.data || response.data;
  },

  obtenerPorId: async (id: number) => {
    const response = await api.get(`/pacientes-externos/${id}`);
    return response.data.data || response.data;
  }
};
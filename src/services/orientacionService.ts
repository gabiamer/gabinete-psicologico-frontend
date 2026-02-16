// src/services/orientacionService.ts
import api from './api';
import { OrientacionVocacionalData } from '../types/types';

export const orientacionService = {
  guardarEntrevista: async (pacienteExternoId: number, orientacion: OrientacionVocacionalData) => {
    const response = await api.post(`/pacientes-externos/${pacienteExternoId}/orientacion-vocacional`, orientacion);
    return response.data;
  },

  obtenerEntrevista: async (pacienteExternoId: number) => {
    const response = await api.get(`/pacientes-externos/${pacienteExternoId}/orientacion-vocacional`);
    return response.data.data || response.data;
  }
};
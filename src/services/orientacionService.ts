// src/services/orientacionService.ts
import api from './api';
import type { OrientacionVocacionalData } from '../types/types';

export const orientacionService = {
  guardarEntrevista: async (pacienteExternoId: number, orientacion: OrientacionVocacionalData) => {
    const response = await api.post(`/pacientes-externos/${pacienteExternoId}/orientacion-vocacional`, orientacion);
    return response.data;
  },

  obtenerEntrevista: async (pacienteExternoId: number) => {
    const response = await api.get(`/pacientes-externos/${pacienteExternoId}/orientacion-vocacional`);
    return response.data.data || response.data;
  },

  /** Crea paciente externo + orientación vocacional en una sola llamada */
  crearCompleta: async (
    formData: any,
    escuela: string,
    anio: number,
    correo: string,
    orientacion: OrientacionVocacionalData
  ): Promise<number> => {
    const payload = {
      person: {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        apellidoPaterno: formData.apellidoPaterno || null,
        apellidoMaterno: formData.apellidoMaterno || null,
        celular: formData.celular,
      },
      fechaNacimiento: formData.fechaNacimiento,
      edad: formData.edad || null,
      domicilio: formData.domicilio,
      estadoCivil: formData.estadoCivil,
      escuela,
      anio,
      correo,
      ...orientacion,
    };
    const response = await api.post('/pacientes-externos/orientacion-completa', payload);
    return response.data.pacienteId;
  },
};
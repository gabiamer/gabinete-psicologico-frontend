// src/services/pacienteService.ts
import api from './api';
import { FormData, AntecedentesData } from '../types/types';

export const pacienteService = {
  buscar: async (termino: string) => {
    const response = await api.get(`/pacientes/buscar?q=${termino}`);
    return response.data.data || response.data;
  },

  crear: async (formData: FormData) => {
    const payload = {
      person: {
        primerNombre: formData.primerNombre,
        segundoNombre: formData.segundoNombre || null,
        apellidoPaterno: formData.apellidoPaterno || null,
        apellidoMaterno: formData.apellidoMaterno || null,
        celular: formData.celular
      },
      fechaNacimiento: formData.fechaNacimiento,
      edad: formData.edad || null,
      genero: formData.genero,
      domicilio: formData.domicilio,
      estadoCivil: formData.estadoCivil,
      semestre: formData.semestre,
      derivadoPor: formData.derivadoPor,
      psicologoId: formData.psicologoId,
      carreraId: 1
    };

    const response = await api.post('/pacientes/universitario', payload);
    return response.data.data?.id || response.data.id;
  },

  guardarHistoriaClinica: async (
    pacienteId: number,
    antecedentes: AntecedentesData,
    sintomatologias: { estres: number[]; ansiedad: number[]; depresion: number[] }
  ) => {
    const payload = {
      ...antecedentes,
      sintomas: sintomatologias,
      totalScoreEstres: sintomatologias.estres.reduce((a, b) => a + b, 0),
      totalScoreAnsiedad: sintomatologias.ansiedad.reduce((a, b) => a + b, 0),
      totalScoreDepresion: sintomatologias.depresion.reduce((a, b) => a + b, 0)
    };

    await api.post(`/pacientes/universitario/${pacienteId}/historia-clinica`, payload);
  },

  obtenerPsicologos: async () => {
    const response = await api.get('/psicologos');
    return response.data.data || response.data;
  },

  obtenerPorId: async (id: number) => {
    const response = await api.get(`/pacientes/${id}`);
    return response.data.data || response.data;
  }
};
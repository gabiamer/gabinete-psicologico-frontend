// src/services/pacienteService.ts
import api from './api';
import { FormData, AntecedentesData } from '../types/types';

export const pacienteService = {
  // Buscar en AMBOS tipos de pacientes (universitarios y externos) con filtro opcional de fecha
  buscar: async (termino: string, fecha?: string) => {
    try {
      // Construir parámetros de búsqueda
      const params = new URLSearchParams();
      if (termino && termino.trim()) {
        params.append('q', termino.trim());
      }
      if (fecha && fecha.trim()) {
        params.append('fecha', fecha.trim());
      }
      const queryString = params.toString();

      // Buscar en pacientes universitarios
      const urlUniversitarios = queryString 
        ? `/pacientes/buscar?${queryString}` 
        : '/pacientes/buscar';
      const responseUniversitarios = await api.get(urlUniversitarios);
      const universitarios = (responseUniversitarios.data.data || responseUniversitarios.data || []).map((p: any) => ({
        ...p,
        tipo: 'universitario'
      }));

      // Buscar en pacientes externos (solo si hay término, no fecha - externos no tienen sesiones con fecha)
      let externos: any[] = [];
      if (termino && termino.trim()) {
        const responseExternos = await api.get(`/pacientes-externos/buscar?q=${termino}`);
        externos = (responseExternos.data.data || responseExternos.data || []).map((p: any) => ({
          ...p,
          tipo: 'externo'
        }));
      }

      // Combinar ambos resultados
      return [...universitarios, ...externos];
    } catch (err) {
      console.error('Error en búsqueda:', err);
      return [];
    }
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
      carreraId: formData.carreraId
    };

    const response = await api.post('/pacientes/universitario', payload);
    return response.data.data?.id || response.data.id;
  },

  // Actualizar paciente universitario
  actualizar: async (pacienteId: number, formData: FormData) => {
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
      carreraId: formData.carreraId
    };

    const response = await api.put(`/pacientes/universitario/${pacienteId}`, payload);
    return response.data;
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
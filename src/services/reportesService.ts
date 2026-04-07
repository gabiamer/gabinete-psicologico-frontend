import api from './api';

// ── Tipos de respuesta por gráfica ──────────────────────────────────────────

export interface HorasTurnoRow {
  mes: string;
  mesNumero: number;
  designadas_manana: number;
  designadas_tarde: number;
  usadas_manana: number;
  usadas_tarde: number;
}

export interface HorasGeneroRow {
  mes: string;
  mesNumero: number;
  mujeres: number;
  varones: number;
}

export interface HorasDepartamentoRow {
  mes: string;
  mesNumero: number;
  [departamento: string]: string | number;
}

export interface CasoGravedadRow {
  gravedad: string;
  total: number;
}

export interface TipologiaGeneroRow {
  tipologia: string;
  masculino: number;
  femenino: number;
}

export interface ParticipanteCarreraRow {
  carrera: string;
  total: number;
}

export interface HorasEjecutadasVsDesignadasRow {
  mes: string;
  mesNumero: number;
  designadas: number;
  ejecutadas: number;
}

export interface SesionesPorMesRow {
  mes: string;
  mesNumero: number;
  total: number;
}

export interface SesionesPorPsicologoRow {
  psicologo: string;
  total: number;
}

export interface ScorePromedioRow {
  mes: string;
  mesNumero: number;
  estres: number;
  ansiedad: number;
  depresion: number;
}

export interface SemestreRow {
  semestre: string;
  total: number;
}

export interface NuevosPacientesPorMesRow {
  mes: string;
  mesNumero: number;
  universitarios: number;
  externos: number;
}

export interface DistribucionGeneroRow {
  genero: string;
  total: number;
}

export interface DistribucionEdadRow {
  rango: string;
  total: number;
}

export interface HorasDesignadasInput {
  psicologoId: number;
  anio: number;
  mes: number;
  turno: 'manana' | 'tarde';
  horas: number;
}

// ── Service ─────────────────────────────────────────────────────────────────

export const reportesService = {
  horasPorTurno: async (anio: number): Promise<HorasTurnoRow[]> => {
    const res = await api.get('/reportes/horas-turno', { params: { anio } });
    return res.data.data ?? [];
  },

  horasPorGenero: async (anio: number): Promise<HorasGeneroRow[]> => {
    const res = await api.get('/reportes/horas-genero', { params: { anio } });
    return res.data.data ?? [];
  },

  horasPorDepartamento: async (anio: number): Promise<HorasDepartamentoRow[]> => {
    const res = await api.get('/reportes/horas-departamento', { params: { anio } });
    return res.data.data ?? [];
  },

  casosPorGravedad: async (): Promise<CasoGravedadRow[]> => {
    const res = await api.get('/reportes/casos-gravedad');
    return res.data.data ?? [];
  },

  tipologiasPorGenero: async (): Promise<TipologiaGeneroRow[]> => {
    const res = await api.get('/reportes/tipologias-genero');
    return res.data.data ?? [];
  },

  participantesPorCarrera: async (): Promise<ParticipanteCarreraRow[]> => {
    const res = await api.get('/reportes/participantes-carrera');
    return res.data.data ?? [];
  },

  horasEjecutadasVsDesignadas: async (anio: number): Promise<HorasEjecutadasVsDesignadasRow[]> => {
    const res = await api.get('/reportes/horas-ejecutadas-vs-designadas', { params: { anio } });
    return res.data.data ?? [];
  },

  sesionesPorMes: async (anio: number): Promise<SesionesPorMesRow[]> => {
    const res = await api.get('/reportes/sesiones-por-mes', { params: { anio } });
    return res.data.data ?? [];
  },

  sesionesPorPsicologo: async (anio: number): Promise<SesionesPorPsicologoRow[]> => {
    const res = await api.get('/reportes/sesiones-por-psicologo', { params: { anio } });
    return res.data.data ?? [];
  },

  scorePromedio: async (anio: number): Promise<ScorePromedioRow[]> => {
    const res = await api.get('/reportes/score-promedio', { params: { anio } });
    return res.data.data ?? [];
  },

  semestres: async (): Promise<SemestreRow[]> => {
    const res = await api.get('/reportes/semestres');
    return res.data.data ?? [];
  },

  nuevosPacientesPorMes: async (anio: number): Promise<NuevosPacientesPorMesRow[]> => {
    const res = await api.get('/reportes/nuevos-pacientes-por-mes', { params: { anio } });
    return res.data.data ?? [];
  },

  distribucionGenero: async (): Promise<DistribucionGeneroRow[]> => {
    const res = await api.get('/reportes/distribucion-genero');
    return res.data.data ?? [];
  },

  distribucionEdad: async (): Promise<DistribucionEdadRow[]> => {
    const res = await api.get('/reportes/distribucion-edad');
    return res.data.data ?? [];
  },

  setHorasDesignadas: async (payload: HorasDesignadasInput): Promise<void> => {
    await api.put('/reportes/horas-designadas', payload);
  },
};

import api from './api';

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface CasoGravedadRow   { gravedad: string; total: number }
export interface CasoSituacionRow  { situacion: string; total: number }
export interface TipologiaGeneroRow { tipologia: string; masculino: number; femenino: number }
export interface ParticipanteCarreraRow { carrera: string; total: number }
export interface HorasDepartamentoRow { mes: string; [dep: string]: string | number }
export interface SesionesPorMesRow  { mes: string; total: number }
export interface SesionesPorPsicologoRow { psicologo: string; total: number }
export interface SesionesPorTurnoRow { mes: string; manana: number; tarde: number }
export interface PacientesPorPsicologoRow { psicologo: string; total: number }
export interface ScorePromedioRow   { mes: string; estres: number; ansiedad: number; depresion: number }
export interface SemestreRow        { semestre: string; total: number }
export interface NuevosPacientesPorMesRow { mes: string; universitarios: number; externos: number }
export interface DistribucionGeneroRow { genero: string; total: number }
export interface DistribucionEdadRow   { rango: string; total: number }

export interface HorasDesignadasInput {
  psicologoId: number; anio: number; mes: number; turno: 'manana' | 'tarde'; horas: number;
}

// ── Parámetros de rango (ISO date strings "YYYY-MM-DD") ──────────────────────
export interface RangoParams { desde: string; hasta: string }

// ── Service ──────────────────────────────────────────────────────────────────

export const reportesService = {
  // filtrables por rango
  sesionesPorMes: (r: RangoParams) =>
    api.get<any>('/reportes/sesiones-por-mes', { params: r }).then(res => (res.data.data ?? []) as SesionesPorMesRow[]),

  sesionesPorTurno: (r: RangoParams) =>
    api.get<any>('/reportes/sesiones-turno', { params: r }).then(res => (res.data.data ?? []) as SesionesPorTurnoRow[]),

  sesionesPorPsicologo: (r: RangoParams) =>
    api.get<any>('/reportes/sesiones-por-psicologo', { params: r }).then(res => (res.data.data ?? []) as SesionesPorPsicologoRow[]),

  horasPorDepartamento: (r: RangoParams) =>
    api.get<any>('/reportes/horas-departamento', { params: r }).then(res => (res.data.data ?? []) as HorasDepartamentoRow[]),

  scorePromedio: (r: RangoParams) =>
    api.get<any>('/reportes/score-promedio', { params: r }).then(res => (res.data.data ?? []) as ScorePromedioRow[]),

  casosPorGravedad: (r: RangoParams) =>
    api.get<any>('/reportes/casos-gravedad', { params: r }).then(res => (res.data.data ?? []) as CasoGravedadRow[]),

  tipologiasPorGenero: (r: RangoParams) =>
    api.get<any>('/reportes/tipologias-genero', { params: r }).then(res => (res.data.data ?? []) as TipologiaGeneroRow[]),

  nuevosPacientesPorMes: (r: RangoParams) =>
    api.get<any>('/reportes/nuevos-pacientes-por-mes', { params: r }).then(res => (res.data.data ?? []) as NuevosPacientesPorMesRow[]),

  // acumulados (sin rango)
  pacientesPorPsicologo: () =>
    api.get<any>('/reportes/pacientes-por-psicologo').then(res => (res.data.data ?? []) as PacientesPorPsicologoRow[]),

  casosPorSituacion: () =>
    api.get<any>('/reportes/casos-situacion').then(res => (res.data.data ?? []) as CasoSituacionRow[]),

  participantesPorCarrera: () =>
    api.get<any>('/reportes/participantes-carrera').then(res => (res.data.data ?? []) as ParticipanteCarreraRow[]),

  semestres: () =>
    api.get<any>('/reportes/semestres').then(res => (res.data.data ?? []) as SemestreRow[]),

  distribucionGenero: () =>
    api.get<any>('/reportes/distribucion-genero').then(res => (res.data.data ?? []) as DistribucionGeneroRow[]),

  distribucionEdad: () =>
    api.get<any>('/reportes/distribucion-edad').then(res => (res.data.data ?? []) as DistribucionEdadRow[]),

  setHorasDesignadas: (payload: HorasDesignadasInput) =>
    api.put('/reportes/horas-designadas', payload),
};

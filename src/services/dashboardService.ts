import api from './api';

export interface EntrevistaRow {
  pacienteUniversitarioId: number;
  estudianteNombre: string;
  nombreCompleto: string;
  derivadoPor: string;
  carrera: string;
  psicologoId: number | null;
  psicologoNombre: string;
  numeroSesiones: number;
  ultimaSesionFecha: string | null;
  gravedad: string;
}

export interface OrientacionRow {
  pacienteExternoId: number;
  estudianteNombre: string;
  nombreCompleto: string;
  escuela: string;
  anio: number | null;
  correo: string;
  edad: number | null;
  numeroOrientaciones: number;
  ultimaOrientacionFecha: string | null;
}

export interface DashboardStats {
  totalPacientesUniversitarios: number;
  totalPacientesExternos: number;
  totalSesiones: number;
  totalOrientaciones: number;
  gravedadDistribucion: {
    leve: number;
    moderado: number;
    grave: number;
  };
}

export const dashboardService = {
  obtenerEntrevistas: async (): Promise<EntrevistaRow[]> => {
    const response = await api.get('/dashboard/entrevistas');
    return response.data.data || [];
  },

  obtenerOrientaciones: async (): Promise<OrientacionRow[]> => {
    const response = await api.get('/dashboard/orientaciones');
    return response.data.data || [];
  },

  obtenerEstadisticas: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },
};

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
  descripcion: string | null;
  principalProblematica: string | null;
  situacionCaso: string;
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
  situacionDistribucion: {
    "Acompañamiento psicológico": number;
    "Buen proceso": number;
    "Proceso terminado": number;
    "Orientación vocacional": number;
    "Derivado a consultorio externo": number;
  };
}

export const dashboardService = {
  obtenerEntrevistas: async (): Promise<EntrevistaRow[]> => {
    const response = await api.get('/dashboard/entrevistas');
    return response.data.data || [];
  },

  obtenerEntrevistasPeriodo: async (desde: string, hasta: string): Promise<EntrevistaRow[]> => {
    const response = await api.get('/dashboard/entrevistas-periodo', { params: { desde, hasta } });
    return response.data.data || [];
  },

  obtenerOrientaciones: async (): Promise<OrientacionRow[]> => {
    const response = await api.get('/dashboard/orientaciones');
    return response.data.data || [];
  },

  obtenerOrientacionesPeriodo: async (desde: string, hasta: string): Promise<OrientacionRow[]> => {
    const response = await api.get('/dashboard/orientaciones-periodo', { params: { desde, hasta } });
    return response.data.data || [];
  },

  obtenerEstadisticas: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  actualizarSituacion: async (id: number, situacionCaso: string): Promise<void> => {
    await api.patch(`/pacientes/universitario/${id}/situacion`, { situacionCaso });
  },

  generarResumen: async (id: number): Promise<{ descripcion: string; principalProblematica: string }> => {
    const response = await api.post(`/pacientes/universitario/${id}/generar-resumen`);
    return {
      descripcion: response.data.descripcion,
      principalProblematica: response.data.principalProblematica,
    };
  },

  extraerProblematicasFrecuentes: async (problematicas: string[]): Promise<string[]> => {
    const response = await api.post('/pacientes/problematicas-frecuentes', problematicas);
    return response.data.data;
  },

  eliminarEntrevista: async (id: number): Promise<void> => {
    await api.delete(`/pacientes/universitario/${id}`);
  },

  eliminarOrientacion: async (id: number): Promise<void> => {
    await api.delete(`/pacientes-externos/${id}`);
  },
};

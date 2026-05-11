import api from './api'

export interface EvidenciaInfo {
  id: number
  nombre: string
}

export interface Actividad {
  id: number
  psicologo: {
    id: number
    person: { primerNombre: string; apellidoPaterno: string }
    ocupacion: string
  }
  titulo: string
  fechaInicio: string
  fechaFin: string
  objetivo: string
  poblacion: string
  numAsistentes: number
  resumen: string
  resultados: string
  evidencias: EvidenciaInfo[]
  createdAt: string
}

export interface ActividadInput {
  psicologoId: number
  titulo: string
  fechaInicio: string
  fechaFin: string
  objetivo: string
  poblacion: string
  numAsistentes: number
  resumen: string
  resultados: string
  nuevasEvidencias?: File[]
  eliminarEvidenciaIds?: number[]
}

function buildFormData(data: ActividadInput): FormData {
  const fd = new FormData()
  fd.append('psicologoId', String(data.psicologoId))
  fd.append('titulo', data.titulo)
  fd.append('fechaInicio', data.fechaInicio)
  fd.append('fechaFin', data.fechaFin)
  fd.append('objetivo', data.objetivo)
  fd.append('poblacion', data.poblacion)
  fd.append('numAsistentes', String(data.numAsistentes))
  fd.append('resumen', data.resumen)
  fd.append('resultados', data.resultados)
  if (data.nuevasEvidencias) {
    for (const file of data.nuevasEvidencias) {
      fd.append('evidencias', file)
    }
  }
  if (data.eliminarEvidenciaIds) {
    for (const id of data.eliminarEvidenciaIds) {
      fd.append('eliminarEvidenciaIds', String(id))
    }
  }
  return fd
}

export const actividadService = {
  getAll: async (): Promise<Actividad[]> => {
    const res = await api.get('/actividades')
    return res.data.data
  },

  getById: async (id: number): Promise<Actividad> => {
    const res = await api.get(`/actividades/${id}`)
    return res.data.data
  },

  getByRango: async (desde: string, hasta: string): Promise<Actividad[]> => {
    const res = await api.get('/actividades/rango', { params: { desde, hasta } })
    return res.data.data
  },

  create: async (data: ActividadInput): Promise<Actividad> => {
    const fd = buildFormData(data)
    const res = await api.post('/actividades', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  update: async (id: number, data: ActividadInput): Promise<Actividad> => {
    const fd = buildFormData(data)
    const res = await api.put(`/actividades/${id}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/actividades/${id}`)
  },

  getEvidenciaUrl: (evidenciaId: number): string => {
    return `http://localhost:8081/api/actividades/evidencia/${evidenciaId}`
  },

  getEvidenciaBytes: async (evidenciaId: number): Promise<ArrayBuffer> => {
    const res = await api.get(`/actividades/evidencia/${evidenciaId}`, {
      responseType: 'arraybuffer',
    })
    return res.data
  },
}

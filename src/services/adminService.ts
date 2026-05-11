import api from './api'
import type { Psicologo, Carrera } from '@/types/types'

export interface UsuarioRow {
  id: number
  username: string
  rol: 'ADMIN' | 'PSICOLOGO'
  activo: boolean
  psicologoId: number | null
  psicologoNombre: string | null
}

export interface UsuarioInput {
  username: string
  password: string
  rol: 'ADMIN' | 'PSICOLOGO'
  psicologoId: number | null
}

export interface PsicologoInput {
  primerNombre: string
  segundoNombre?: string
  apellidoPaterno: string
  apellidoMaterno?: string
  celular?: string
  ocupacion: string
}

export interface HorasDesignadasRow {
  id: number
  psicologo: Psicologo
  anio: number
  mes: number
  turno: 'manana' | 'tarde'
  horas: number
}

export interface HorasUpsertInput {
  psicologoId: number
  anio: number
  mes: number
  turno: 'manana' | 'tarde'
  horas: number
}

export const adminService = {
  psicologos: {
    getAll: async (): Promise<Psicologo[]> => {
      const res = await api.get('/psicologos')
      return res.data.data
    },
    create: async (data: PsicologoInput): Promise<Psicologo> => {
      const res = await api.post('/psicologos', data)
      return res.data.data
    },
    update: async (id: number, data: PsicologoInput): Promise<Psicologo> => {
      const res = await api.put(`/psicologos/${id}`, data)
      return res.data.data
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`/psicologos/${id}`)
    },
  },

  carreras: {
    getAll: async (): Promise<Carrera[]> => {
      const res = await api.get('/carreras')
      return res.data.data
    },
    create: async (carrera: string, departamento: string): Promise<Carrera> => {
      const res = await api.post('/carreras', { carrera, departamento })
      return res.data.data
    },
    update: async (id: number, carrera: string, departamento: string): Promise<Carrera> => {
      const res = await api.put(`/carreras/${id}`, { carrera, departamento })
      return res.data.data
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`/carreras/${id}`)
    },
  },

  usuarios: {
    getAll: async (): Promise<UsuarioRow[]> => {
      const res = await api.get('/usuarios')
      return res.data.data
    },
    create: async (data: UsuarioInput): Promise<UsuarioRow> => {
      const res = await api.post('/usuarios', data)
      if (!res.data.success) throw new Error(res.data.message)
      return res.data.data
    },
    update: async (id: number, data: { username?: string; password?: string; psicologoId?: number | null }): Promise<UsuarioRow> => {
      const res = await api.put(`/usuarios/${id}`, data)
      if (!res.data.success) throw new Error(res.data.message)
      return res.data.data
    },
    toggleActivo: async (id: number, activo: boolean): Promise<UsuarioRow> => {
      const res = await api.put(`/usuarios/${id}`, { activo })
      return res.data.data
    },
    delete: async (id: number): Promise<void> => {
      await api.delete(`/usuarios/${id}`)
    },
  },

  horasDesignadas: {
    getByAnio: async (anio: number): Promise<HorasDesignadasRow[]> => {
      const res = await api.get('/reportes/horas-designadas', { params: { anio } })
      return res.data.data
    },
    upsert: async (data: HorasUpsertInput): Promise<HorasDesignadasRow> => {
      const res = await api.put('/reportes/horas-designadas', data)
      return res.data.data
    },
  },
}

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { actividadService, type ActividadInput, type EvidenciaInfo } from "@/services/actividadService"
import { adminService } from "@/services/adminService"
import { useAuth } from "@/contexts/AuthContext"
import type { Psicologo } from "@/types/types"

interface PreviewFile {
  file: File
  url: string
}

export default function FormularioActividad() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id
  const { user, isAdmin } = useAuth()

  const [psicologos, setPsicologos] = useState<Psicologo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState<ActividadInput>({
    psicologoId: 0,
    titulo: "",
    fechaInicio: "",
    fechaFin: "",
    objetivo: "",
    poblacion: "",
    numAsistentes: 0,
    resumen: "",
    resultados: "",
    nuevasEvidencias: [],
    eliminarEvidenciaIds: [],
  })

  // Evidencias existentes (solo al editar)
  const [evidenciasExistentes, setEvidenciasExistentes] = useState<EvidenciaInfo[]>([])
  // Preview de nuevas imágenes
  const [previews, setPreviews] = useState<PreviewFile[]>([])

  useEffect(() => {
    async function load() {
      setLoading(true)
      const psis = await adminService.psicologos.getAll()
      setPsicologos(psis)

      if (isEditing) {
        const actividad = await actividadService.getById(Number(id))
        setForm({
          psicologoId: actividad.psicologo.id,
          titulo: actividad.titulo,
          fechaInicio: actividad.fechaInicio?.slice(0, 16) ?? "",
          fechaFin: actividad.fechaFin?.slice(0, 16) ?? "",
          objetivo: actividad.objetivo,
          poblacion: actividad.poblacion,
          numAsistentes: actividad.numAsistentes,
          resumen: actividad.resumen,
          resultados: actividad.resultados,
          nuevasEvidencias: [],
          eliminarEvidenciaIds: [],
        })
        setEvidenciasExistentes(actividad.evidencias ?? [])
      } else {
        // Auto-asignar psicologo del JWT, o el primero si es admin
        if (user?.psicologoId) {
          setForm(f => ({ ...f, psicologoId: user.psicologoId! }))
        } else if (psis.length > 0) {
          setForm(f => ({ ...f, psicologoId: psis[0].id }))
        }
      }
      setLoading(false)
    }
    load()
  }, [id, isEditing])

  // Cleanup preview URLs
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  function handleAddImages(files: FileList | null) {
    if (!files) return
    const newFiles = Array.from(files)
    const newPreviews = newFiles.map(f => ({ file: f, url: URL.createObjectURL(f) }))
    setPreviews(prev => [...prev, ...newPreviews])
    setForm(f => ({
      ...f,
      nuevasEvidencias: [...(f.nuevasEvidencias ?? []), ...newFiles],
    }))
  }

  function removePreview(index: number) {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      return prev.filter((_, i) => i !== index)
    })
    setForm(f => ({
      ...f,
      nuevasEvidencias: (f.nuevasEvidencias ?? []).filter((_, i) => i !== index),
    }))
  }

  function replacePreview(index: number, file: File) {
    setPreviews(prev => {
      URL.revokeObjectURL(prev[index].url)
      const next = [...prev]
      next[index] = { file, url: URL.createObjectURL(file) }
      return next
    })
    setForm(f => {
      const next = [...(f.nuevasEvidencias ?? [])]
      next[index] = file
      return { ...f, nuevasEvidencias: next }
    })
  }

  function removeExistente(evId: number) {
    setEvidenciasExistentes(prev => prev.filter(e => e.id !== evId))
    setForm(f => ({
      ...f,
      eliminarEvidenciaIds: [...(f.eliminarEvidenciaIds ?? []), evId],
    }))
  }

  async function handleSave() {
    if (!form.titulo.trim() || !form.psicologoId || !form.fechaInicio || !form.fechaFin) return
    setSaving(true)
    try {
      if (isEditing) {
        await actividadService.update(Number(id), form)
      } else {
        await actividadService.create(form)
      }
      navigate("/actividades")
    } catch (err) {
      console.error(err)
      alert("Error al guardar la actividad")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-primary-foreground px-8 py-4 flex-shrink-0 flex items-center gap-4">
        <button
          onClick={() => navigate("/actividades")}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            UCB Tarija
          </p>
          <h1 className="text-lg font-extrabold uppercase tracking-tight">
            {isEditing ? "Editar Actividad" : "Nueva Actividad"}
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-3xl space-y-6">
          {/* Titulo */}
          <div className="flex flex-col gap-1.5">
            <Label>Titulo *</Label>
            <Input
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              placeholder="Nombre de la actividad"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <Label>Psicologo *</Label>
              <Select
                value={form.psicologoId ? String(form.psicologoId) : ""}
                onValueChange={v => setForm(f => ({ ...f, psicologoId: Number(v) }))}
                disabled={!isAdmin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  {psicologos.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.person.primerNombre} {p.person.apellidoPaterno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Poblacion *</Label>
              <Input
                value={form.poblacion}
                onChange={e => setForm(f => ({ ...f, poblacion: e.target.value }))}
                placeholder="Ej: Estudiantes de Psicologia"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Fecha y Hora Inicio *</Label>
              <Input
                type="datetime-local"
                value={form.fechaInicio}
                onChange={e => setForm(f => ({ ...f, fechaInicio: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Fecha y Hora Fin *</Label>
              <Input
                type="datetime-local"
                value={form.fechaFin}
                onChange={e => setForm(f => ({ ...f, fechaFin: e.target.value }))}
                min={form.fechaInicio}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Objetivo *</Label>
            <Textarea
              value={form.objetivo}
              onChange={e => setForm(f => ({ ...f, objetivo: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Numero de Asistentes *</Label>
            <Input
              type="number"
              min={0}
              className="w-40"
              value={form.numAsistentes}
              onChange={e => setForm(f => ({ ...f, numAsistentes: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Resumen *</Label>
            <Textarea
              value={form.resumen}
              onChange={e => setForm(f => ({ ...f, resumen: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Resultados *</Label>
            <Textarea
              value={form.resultados}
              onChange={e => setForm(f => ({ ...f, resultados: e.target.value }))}
              rows={4}
            />
          </div>

          {/* Evidencias */}
          <div className="flex flex-col gap-3">
            <Label>Evidencias (imagenes)</Label>

            {/* Existentes */}
            {evidenciasExistentes.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Imagenes actuales</p>
                <div className="grid grid-cols-4 gap-3">
                  {evidenciasExistentes.map(ev => (
                    <div
                      key={ev.id}
                      className="relative rounded-lg border bg-white overflow-hidden group"
                    >
                      <img
                        src={actividadService.getEvidenciaUrl(ev.id)}
                        alt={ev.nombre}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeExistente(ev.id)}
                          className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center py-1 truncate px-1">
                        {ev.nombre}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nuevas con preview */}
            {previews.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Nuevas imagenes</p>
                <div className="grid grid-cols-4 gap-3">
                  {previews.map((p, i) => (
                    <div
                      key={i}
                      className="relative rounded-lg border border-teal-200 bg-teal-50 overflow-hidden group"
                    >
                      <img
                        src={p.url}
                        alt={p.file.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="bg-white text-slate-700 rounded-full p-1.5 hover:bg-slate-100 cursor-pointer">
                          <ImageIcon className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => {
                              const file = e.target.files?.[0]
                              if (file) replacePreview(i, file)
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => removePreview(i)}
                          className="bg-red-600 text-white rounded-full p-1.5 hover:bg-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center py-1 truncate px-1">
                        {p.file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={e => {
                handleAddImages(e.target.files)
                e.target.value = ""
              }}
            />
          </div>

          {/* Botones */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                !form.titulo.trim() ||
                !form.psicologoId ||
                !form.fechaInicio ||
                !form.fechaFin
              }
              className="px-8"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                isEditing ? "Guardar Cambios" : "Crear Actividad"
              )}
            </Button>
            <Button variant="outline" onClick={() => navigate("/actividades")}>
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

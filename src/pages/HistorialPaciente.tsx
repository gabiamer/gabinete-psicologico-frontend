import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Sparkles, Plus, Loader2, Pencil, Check, X, ArrowRightLeft } from "lucide-react"
import { pacienteService } from "@/services/pacienteService"
import { sesionService } from "@/services/sesionService"
import { useAuth } from "@/contexts/AuthContext"
import { BotonReporteIndividualExcel } from "@/components/shared/BotonReporteIndividualExcel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/services/api"
import type { Psicologo } from "@/types/types"

// ─── Types ───────────────────────────────────────────────────────────────────
interface PacienteData {
  id: number
  paciente: {
    id: number
    person: {
      id: number
      primerNombre: string
      segundoNombre?: string | null
      apellidoPaterno?: string | null
      apellidoMaterno?: string | null
      celular?: string | null
    }
    fechaNacimiento?: string | null
    edad?: number | null
    domicilio?: string | null
    estadoCivil?: number | null
    genero?: number | null
  }
  semestre?: number | null
  derivadoPor?: string | null
  psicologo?: {
    id: number
    person: { primerNombre: string; apellidoPaterno: string }
    ocupacion?: string | null
  } | null
  descripcion?: string | null
  principalProblematica?: string | null
  situacionCaso?: string | null
}

interface EditDatosForm {
  primerNombre: string
  segundoNombre: string
  apellidoPaterno: string
  apellidoMaterno: string
  celular: string
  fechaNacimiento: string
  edad: number | ""
  domicilio: string
  estadoCivil: number | ""
  genero: number | ""
  semestre: number | ""
  derivadoPor: string
  psicologoId: number | ""
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ESTADO_CIVIL_OPTS = [
  { value: 1, label: "Soltero/a" },
  { value: 2, label: "Casado/a" },
  { value: 3, label: "Divorciado/a" },
  { value: 4, label: "Viudo/a" },
  { value: 5, label: "Concubinato" },
]
const GENERO_MAP: Record<number, string> = { 1: "Masculino", 2: "Femenino", 3: "Otro" }
const SITUACION_OPTS = [
  "Acompañamiento psicológico",
  "Buen proceso",
  "Proceso terminado",
  "Orientación vocacional",
  "Derivado a consultorio externo",
]
const SITUACION_COLORS: Record<string, string> = {
  "Acompañamiento psicológico": "text-yellow-700 bg-yellow-50 border-yellow-200",
  "Buen proceso": "text-green-700 bg-green-50 border-green-200",
  "Proceso terminado": "text-blue-700 bg-blue-50 border-blue-200",
  "Orientación vocacional": "text-orange-700 bg-orange-50 border-orange-200",
  "Derivado a consultorio externo": "text-red-700 bg-red-50 border-red-200",
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function InfoField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value ?? "—"}</span>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HistorialPaciente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  useAuth()

  const [paciente, setPaciente] = useState<PacienteData | null>(null)
  const [sesiones, setSesiones] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  // AI
  const [generandoIA, setGenerandoIA] = useState(false)
  const [iaError, setIaError] = useState("")

  // Inline text editing (descripcion / problematica)
  const [editingField, setEditingField] = useState<"descripcion" | "problematica" | null>(null)
  const [textDraft, setTextDraft] = useState("")
  const [savingTexto, setSavingTexto] = useState(false)

  // Situacion del caso
  const [savingSituacion, setSavingSituacion] = useState(false)

  // Transfer dialog
  const [transferOpen, setTransferOpen] = useState(false)
  const [transferPsicologoId, setTransferPsicologoId] = useState<number | "">("")
  const [transferring, setTransferring] = useState(false)

  // Psicologo de ultima sesion
  const [psicologoUltimaSesion, setPsicologoUltimaSesion] = useState<string | null>(null)

  // Edit datos personales dialog
  const [editDatosOpen, setEditDatosOpen] = useState(false)
  const [editDatosForm, setEditDatosForm] = useState<EditDatosForm>({
    primerNombre: "", segundoNombre: "", apellidoPaterno: "", apellidoMaterno: "",
    celular: "", fechaNacimiento: "", edad: "", domicilio: "",
    estadoCivil: "", genero: "", semestre: "", derivadoPor: "", psicologoId: "",
  })
  const [psicologos, setPsicologos] = useState<Psicologo[]>([])
  const [savingDatos, setSavingDatos] = useState(false)

  // ── Load data ───────────────────────────────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const [pacienteData, sesionesData, psicologosData] = await Promise.all([
        pacienteService.obtenerPorId(Number(id)),
        sesionService.obtenerPorPaciente(Number(id)),
        pacienteService.obtenerPsicologos(),
      ])
      setPaciente(pacienteData as PacienteData)
      setSesiones(Array.isArray(sesionesData) ? sesionesData as Record<string, unknown>[] : [])
      setPsicologos(psicologosData as Psicologo[])

      // Cargar psicologo de ultima sesion
      try {
        const psicUltima = await pacienteService.obtenerPsicologoUltimaSesion(Number(id))
        if (psicUltima?.person) {
          setPsicologoUltimaSesion(`${psicUltima.person.primerNombre} ${psicUltima.person.apellidoPaterno}`)
        }
      } catch { /* no hay sesiones */ }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { cargarDatos() }, [cargarDatos])

  // ── AI resume ───────────────────────────────────────────────────────────────
  async function generarResumenIA() {
    setGenerandoIA(true)
    setIaError("")
    try {
      const res = await api.post(`/pacientes/universitario/${id}/generar-resumen`)
      setPaciente(prev => prev ? {
        ...prev,
        descripcion: res.data.descripcion,
        principalProblematica: res.data.principalProblematica,
      } : prev)
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } }
      setIaError(err?.response?.data?.message || "Error al generar el resumen")
    } finally {
      setGenerandoIA(false)
    }
  }

  // ── Inline text edit ────────────────────────────────────────────────────────
  function startEditText(field: "descripcion" | "problematica") {
    setEditingField(field)
    setTextDraft(
      field === "descripcion"
        ? (paciente?.descripcion ?? "")
        : (paciente?.principalProblematica ?? "")
    )
  }

  async function saveTexto() {
    if (!editingField) return
    setSavingTexto(true)
    try {
      const payload =
        editingField === "descripcion"
          ? { descripcion: textDraft }
          : { principalProblematica: textDraft }
      await api.patch(`/pacientes/universitario/${id}/textos`, payload)
      setPaciente(prev => prev ? {
        ...prev,
        ...(editingField === "descripcion"
          ? { descripcion: textDraft }
          : { principalProblematica: textDraft }),
      } : prev)
      setEditingField(null)
    } finally {
      setSavingTexto(false)
    }
  }

  // ── Situacion ───────────────────────────────────────────────────────────────
  async function handleSituacion(val: string) {
    setSavingSituacion(true)
    try {
      await api.patch(`/pacientes/universitario/${id}/situacion`, { situacionCaso: val })
      setPaciente(prev => prev ? { ...prev, situacionCaso: val } : prev)
    } finally {
      setSavingSituacion(false)
    }
  }

  // ── Edit datos dialog ───────────────────────────────────────────────────────
  function openEditDatos() {
    if (!paciente) return
    const p = paciente.paciente
    setEditDatosForm({
      primerNombre: p.person.primerNombre ?? "",
      segundoNombre: p.person.segundoNombre ?? "",
      apellidoPaterno: p.person.apellidoPaterno ?? "",
      apellidoMaterno: p.person.apellidoMaterno ?? "",
      celular: p.person.celular ?? "",
      fechaNacimiento: p.fechaNacimiento ?? "",
      edad: p.edad ?? "",
      domicilio: p.domicilio ?? "",
      estadoCivil: p.estadoCivil ?? "",
      genero: p.genero ?? "",
      semestre: paciente.semestre ?? "",
      derivadoPor: paciente.derivadoPor ?? "",
      psicologoId: paciente.psicologo?.id ?? "",
    })
    setEditDatosOpen(true)
  }

  async function handleSaveDatos() {
    setSavingDatos(true)
    try {
      await pacienteService.actualizar(Number(id), {
        primerNombre: editDatosForm.primerNombre,
        segundoNombre: editDatosForm.segundoNombre,
        apellidoPaterno: editDatosForm.apellidoPaterno,
        apellidoMaterno: editDatosForm.apellidoMaterno,
        celular: editDatosForm.celular,
        fechaNacimiento: editDatosForm.fechaNacimiento,
        edad: editDatosForm.edad,
        domicilio: editDatosForm.domicilio,
        estadoCivil: editDatosForm.estadoCivil as number,
        genero: editDatosForm.genero,
        semestre: editDatosForm.semestre as number,
        derivadoPor: editDatosForm.derivadoPor,
        psicologoId: editDatosForm.psicologoId,
      })
      setEditDatosOpen(false)
      await cargarDatos()
    } finally {
      setSavingDatos(false)
    }
  }

  // ── Transfer ────────────────────────────────────────────────────────────────
  async function handleTransfer() {
    if (!transferPsicologoId) return
    setTransferring(true)
    try {
      await pacienteService.transferirPaciente(Number(id), transferPsicologoId as number)
      setTransferOpen(false)
      navigate("/informe")
    } catch (e) {
      console.error(e)
      alert("Error al transferir paciente")
    } finally {
      setTransferring(false)
    }
  }

  // ── Session number ──────────────────────────────────────────────────────────
  function getNumeroSesion(sesion: Record<string, unknown>, fallback: number) {
    if (sesion.acuerdos) {
      try {
        const a = typeof sesion.acuerdos === "string" ? JSON.parse(sesion.acuerdos) : sesion.acuerdos
        if ((a as Record<string, unknown>).numeroSesion) return (a as Record<string, unknown>).numeroSesion
      } catch { /* ignore */ }
    }
    return fallback
  }

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-[#0f172a] text-white px-8 py-4 flex-shrink-0 flex items-center gap-4">
          <button onClick={() => navigate('/informe')} className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">UCB Tarija / Gabinete Psicologico</p>
            <h1 className="text-lg font-extrabold uppercase tracking-tight">Historial Clínico</h1>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center px-8 py-10">
          <div className="w-full max-w-5xl flex flex-col gap-6">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!paciente) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Paciente no encontrado</p>
      </div>
    )
  }

  const person = paciente.paciente.person
  const nombreCompleto = [person.primerNombre, person.segundoNombre, person.apellidoPaterno, person.apellidoMaterno]
    .filter(Boolean).join(" ")
  const situacion = paciente.situacionCaso || "Acompañamiento psicológico"
  const sesionesOrdenadas = [...sesiones].sort(
    (a, b) => new Date(b.fecha as string).getTime() - new Date(a.fecha as string).getTime()
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ── Top bar ── */}
      <header className="bg-[#0f172a] text-white px-8 py-4 flex-shrink-0 flex items-center gap-4">
        <button onClick={() => navigate('/informe')} className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">UCB Gabinete Psicologico</p>
          <h1 className="text-lg font-extrabold uppercase tracking-tight">Historial Clínico</h1>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-white">{nombreCompleto}</p>
          <p className="text-xs text-slate-400">Semestre {paciente.semestre ?? "—"}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-8">
        <div className="w-full max-w-5xl flex flex-col gap-6">

          {/* ── Datos del paciente + sidebar ── */}
          <div className="grid grid-cols-3 gap-6">
            {/* Datos personales */}
            <Card className="col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Datos del Paciente</CardTitle>
                  <Button variant="ghost" size="sm" onClick={openEditDatos} className="gap-1 h-7 text-slate-500 hover:text-slate-900">
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <InfoField label="Nombre completo" value={nombreCompleto} />
                  <InfoField label="Edad" value={paciente.paciente.edad != null ? `${paciente.paciente.edad} años` : null} />
                  <InfoField label="Fecha de nacimiento" value={
                    paciente.paciente.fechaNacimiento
                      ? new Date(paciente.paciente.fechaNacimiento).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" })
                      : null
                  } />
                  <InfoField label="Celular" value={person.celular} />
                  <InfoField label="Domicilio" value={paciente.paciente.domicilio} />
                  <InfoField label="Estado civil" value={
                    paciente.paciente.estadoCivil != null
                      ? ESTADO_CIVIL_OPTS.find(o => o.value === paciente.paciente.estadoCivil)?.label
                      : null
                  } />
                  <InfoField label="Género" value={paciente.paciente.genero != null ? GENERO_MAP[paciente.paciente.genero] : null} />
                  <InfoField label="Semestre" value={paciente.semestre} />
                  <InfoField label="Derivado por" value={paciente.derivadoPor} />
                </div>
              </CardContent>
            </Card>

            {/* Sidebar */}
            <div className="flex flex-col gap-4">
              {/* Psicólogo */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Psicólogo Asignado</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setTransferOpen(true)} className="gap-1 h-7 text-slate-500 hover:text-slate-900">
                      <ArrowRightLeft className="h-3.5 w-3.5" /> Transferir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold text-slate-800">
                    {psicologoUltimaSesion
                      ?? (paciente.psicologo
                        ? `${paciente.psicologo.person.primerNombre} ${paciente.psicologo.person.apellidoPaterno}`
                        : "—")}
                  </p>
                  {paciente.psicologo?.ocupacion && (
                    <p className="text-xs text-slate-500 mt-0.5">{paciente.psicologo.ocupacion}</p>
                  )}
                </CardContent>
              </Card>

              {/* Situacion del caso — inline Select */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Situación del Caso</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={situacion}
                    onValueChange={handleSituacion}
                    disabled={savingSituacion}
                  >
                    <SelectTrigger className={`h-8 text-xs font-medium border ${SITUACION_COLORS[situacion] ?? ""}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SITUACION_OPTS.map(opt => (
                        <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Total sesiones */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Total de Sesiones</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-slate-900">{sesiones.length}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ── Resumen IA ── */}
          <Card className="border-indigo-100">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Resumen Clínico
                  </CardTitle>
                  <CardDescription>Descripción general y problemática principal del paciente</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generarResumenIA}
                  disabled={generandoIA}
                  className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                >
                  {generandoIA
                    ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Generando...</>
                    : <><Sparkles className="h-3.5 w-3.5" /> {paciente.descripcion ? "Regenerar IA" : "Generar IA"}</>
                  }
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {iaError && <p className="text-sm text-red-500">{iaError}</p>}

              {/* Descripción */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción general</p>
                  {editingField !== "descripcion" && (
                    <button
                      onClick={() => startEditText("descripcion")}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {editingField === "descripcion" ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={textDraft}
                      onChange={e => setTextDraft(e.target.value)}
                      rows={4}
                      className="text-sm"
                      placeholder="Descripción general del paciente..."
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => setEditingField(null)}>
                        <X className="h-3.5 w-3.5" /> Cancelar
                      </Button>
                      <Button size="sm" className="h-7 gap-1" onClick={saveTexto} disabled={savingTexto}>
                        {savingTexto ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {paciente.descripcion || <span className="text-slate-400 italic">Sin descripción. Haz clic en el lápiz para editar o usa "Generar IA".</span>}
                  </p>
                )}
              </div>

              <Separator />

              {/* Problemática */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Problemática principal</p>
                  {editingField !== "problematica" && (
                    <button
                      onClick={() => startEditText("problematica")}
                      className="text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {editingField === "problematica" ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      value={textDraft}
                      onChange={e => setTextDraft(e.target.value)}
                      rows={3}
                      className="text-sm"
                      placeholder="Problemática principal del paciente..."
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 gap-1" onClick={() => setEditingField(null)}>
                        <X className="h-3.5 w-3.5" /> Cancelar
                      </Button>
                      <Button size="sm" className="h-7 gap-1" onClick={saveTexto} disabled={savingTexto}>
                        {savingTexto ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Guardar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {paciente.principalProblematica || <span className="text-slate-400 italic">Sin problemática. Haz clic en el lápiz para editar o usa "Generar IA".</span>}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Sesiones ── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sesiones Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              {sesionesOrdenadas.length === 0 ? (
                <div className="py-10 text-center text-slate-400">
                  <p className="text-sm">No hay sesiones registradas aún.</p>
                  <p className="text-xs mt-1">Haz clic en "Nueva Sesión" para comenzar.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {sesionesOrdenadas.map((sesion, index) => {
                    const nro = getNumeroSesion(sesion, sesionesOrdenadas.length - index) as string | number
                    return (
                      <div
                        key={sesion.id as string}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                            <span className="text-sm font-bold text-slate-700">#{nro}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">Sesión #{nro}</p>
                            <p className="text-xs text-slate-500">
                              {new Date(sesion.fecha as string).toLocaleDateString("es-ES", {
                                weekday: "long", year: "numeric", month: "long", day: "numeric",
                              })}
                              {sesion.tipo ? ` · ${sesion.tipo}` : ""}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/sesiones/${sesion.id}`)}>
                          Ver detalles
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* ── Acciones ── */}
          <div className="flex items-center justify-between pt-2 pb-4">
            <Button variant="outline" onClick={() => navigate('/informe')} className="gap-1.5">
              <ArrowLeft className="h-4 w-4" /> Volver
            </Button>
            <div className="flex gap-3">
              <BotonReporteIndividualExcel pacienteId={Number(id)} />
              <Button
                onClick={() => navigate(`/pacientes/${id}/nueva-sesion`)}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4" /> Nueva Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Transfer Dialog ── */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Paciente</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">Selecciona el psicólogo al que deseas transferir este paciente. El paciente dejará de aparecer en tu vista.</p>
          <div className="flex flex-col gap-1.5 py-2">
            <Label>Nuevo psicólogo</Label>
            <Select
              value={transferPsicologoId ? String(transferPsicologoId) : ""}
              onValueChange={v => setTransferPsicologoId(Number(v))}
            >
              <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
              <SelectContent>
                {psicologos
                  .filter(p => p.id !== paciente.psicologo?.id)
                  .map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.person.primerNombre} {p.person.apellidoPaterno}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>Cancelar</Button>
            <Button onClick={handleTransfer} disabled={!transferPsicologoId || transferring}>
              {transferring ? "Transfiriendo..." : "Transferir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit Datos Dialog ── */}
      <Dialog open={editDatosOpen} onOpenChange={setEditDatosOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Datos del Paciente</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Primer nombre *</Label>
              <Input value={editDatosForm.primerNombre} onChange={e => setEditDatosForm(f => ({ ...f, primerNombre: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Segundo nombre</Label>
              <Input value={editDatosForm.segundoNombre} onChange={e => setEditDatosForm(f => ({ ...f, segundoNombre: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Apellido paterno</Label>
              <Input value={editDatosForm.apellidoPaterno} onChange={e => setEditDatosForm(f => ({ ...f, apellidoPaterno: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Apellido materno</Label>
              <Input value={editDatosForm.apellidoMaterno} onChange={e => setEditDatosForm(f => ({ ...f, apellidoMaterno: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Celular</Label>
              <Input value={editDatosForm.celular} onChange={e => setEditDatosForm(f => ({ ...f, celular: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Fecha de nacimiento</Label>
              <Input type="date" value={editDatosForm.fechaNacimiento} onChange={e => setEditDatosForm(f => ({ ...f, fechaNacimiento: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Edad</Label>
              <Input type="number" value={editDatosForm.edad} onChange={e => setEditDatosForm(f => ({ ...f, edad: e.target.value ? Number(e.target.value) : "" }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Domicilio</Label>
              <Input value={editDatosForm.domicilio} onChange={e => setEditDatosForm(f => ({ ...f, domicilio: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Estado civil</Label>
              <Select
                value={editDatosForm.estadoCivil ? String(editDatosForm.estadoCivil) : ""}
                onValueChange={v => setEditDatosForm(f => ({ ...f, estadoCivil: Number(v) }))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {ESTADO_CIVIL_OPTS.map(o => (
                    <SelectItem key={o.value} value={String(o.value)}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Semestre</Label>
              <Input type="number" value={editDatosForm.semestre} onChange={e => setEditDatosForm(f => ({ ...f, semestre: e.target.value ? Number(e.target.value) : "" }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Derivado por</Label>
              <Input value={editDatosForm.derivadoPor} onChange={e => setEditDatosForm(f => ({ ...f, derivadoPor: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Psicólogo asignado</Label>
              <Select
                value={editDatosForm.psicologoId ? String(editDatosForm.psicologoId) : ""}
                onValueChange={v => setEditDatosForm(f => ({ ...f, psicologoId: Number(v) }))}
              >
                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                <SelectContent>
                  {psicologos.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.person.primerNombre} {p.person.apellidoPaterno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDatosOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveDatos} disabled={savingDatos || !editDatosForm.primerNombre.trim()}>
              {savingDatos ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

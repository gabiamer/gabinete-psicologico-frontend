import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Pencil, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { actividadService, type Actividad } from "@/services/actividadService"

function formatDate(iso: string): string {
  if (!iso) return "—"
  const fecha = new Date(iso)
  const d = String(fecha.getDate()).padStart(2, "0")
  const m = String(fecha.getMonth() + 1).padStart(2, "0")
  const y = fecha.getFullYear()
  const h = String(fecha.getHours()).padStart(2, "0")
  const min = String(fecha.getMinutes()).padStart(2, "0")
  return `${d}/${m}/${y} ${h}:${min}`
}

export default function DetalleActividad() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [actividad, setActividad] = useState<Actividad | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await actividadService.getById(Number(id))
      setActividad(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading || !actividad) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0f172a] text-white px-8 py-4 flex-shrink-0 flex items-center gap-4">
        <button
          onClick={() => navigate("/actividades")}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            UCB Tarija
          </p>
          <h1 className="text-lg font-extrabold uppercase tracking-tight">
            Detalle de Actividad
          </h1>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="gap-1.5"
          onClick={() => navigate(`/actividades/${id}/editar`)}
        >
          <Pencil className="h-4 w-4" /> Editar
        </Button>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-3xl space-y-6">
          <div className="rounded-xl border bg-white p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{actividad.titulo}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {actividad.psicologo.person.primerNombre} {actividad.psicologo.person.apellidoPaterno}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-slate-600">Fecha Inicio:</span>{" "}
                <span className="text-slate-800">{formatDate(actividad.fechaInicio)}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Fecha Fin:</span>{" "}
                <span className="text-slate-800">{formatDate(actividad.fechaFin)}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Poblacion:</span>{" "}
                <span className="text-slate-800">{actividad.poblacion}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-600">Asistentes:</span>{" "}
                <span className="text-slate-800">{actividad.numAsistentes}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-1">Objetivo</h3>
              <p className="text-slate-800 text-sm whitespace-pre-wrap">{actividad.objetivo}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-1">Resumen</h3>
              <p className="text-slate-800 text-sm whitespace-pre-wrap">{actividad.resumen}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-600 mb-1">Resultados</h3>
              <p className="text-slate-800 text-sm whitespace-pre-wrap">{actividad.resultados}</p>
            </div>
          </div>

          {/* Evidencias */}
          {actividad.evidencias && actividad.evidencias.length > 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h3 className="text-sm font-semibold text-slate-600 mb-3">
                Evidencias ({actividad.evidencias.length})
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {actividad.evidencias.map(ev => (
                  <div key={ev.id} className="rounded-lg border overflow-hidden">
                    <img
                      src={actividadService.getEvidenciaUrl(ev.id)}
                      alt={ev.nombre}
                      className="w-full h-48 object-cover"
                    />
                    <p className="text-xs text-slate-500 text-center py-2 px-2 truncate">
                      {ev.nombre}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

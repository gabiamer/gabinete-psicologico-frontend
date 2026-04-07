import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, UserPlus, PlayCircle, Settings } from "lucide-react"
import AccionCard from "@/components/dashboard/AccionCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  reportesService,
  type HorasTurnoRow,
  type HorasGeneroRow,
  type HorasDepartamentoRow,
  type CasoGravedadRow,
  type TipologiaGeneroRow,
  type ParticipanteCarreraRow,
  type HorasEjecutadasVsDesignadasRow,
  type SesionesPorMesRow,
  type SesionesPorPsicologoRow,
  type ScorePromedioRow,
  type SemestreRow,
  type NuevosPacientesPorMesRow,
  type DistribucionGeneroRow,
  type DistribucionEdadRow,
} from "@/services/reportesService"
import { GraficaHorasTurno } from "@/components/dashboard/ui/GraficaHorasTurno"
import { GraficaHorasGenero } from "@/components/dashboard/ui/GraficaHorasGenero"
import { GraficaHorasDepartamento } from "@/components/dashboard/ui/GraficaHorasDepartamento"
import { GraficaGravedad } from "@/components/dashboard/ui/GraficaGravedad"
import { GraficaTipologias } from "@/components/dashboard/ui/GraficaTipologias"
import { GraficaParticipantesCarrera } from "@/components/dashboard/ui/GraficaParticipantesCarrera"
import { GraficaHorasEjecutadasVsDesignadas } from "@/components/dashboard/ui/GraficaHorasEjecutadasVsDesignadas"
import { GraficaSesionesPorMes } from "@/components/dashboard/ui/GraficaSesionesPorMes"
import { GraficaSesionesPorPsicologo } from "@/components/dashboard/ui/GraficaSesionesPorPsicologo"
import { GraficaScorePromedio } from "@/components/dashboard/ui/GraficaScorePromedio"
import { GraficaSemestres } from "@/components/dashboard/ui/GraficaSemestres"
import { GraficaNuevosPacientesPorMes } from "@/components/dashboard/ui/GraficaNuevosPacientesPorMes"
import { GraficaDistribucionGenero } from "@/components/dashboard/ui/GraficaDistribucionGenero"
import { GraficaDistribucionEdad } from "@/components/dashboard/ui/GraficaDistribucionEdad"

export default function Dashboard() {
  const navigate = useNavigate()
  const [anio, setAnio] = useState<number>(new Date().getFullYear())
  const [loading, setLoading] = useState(true)

  // Uso del AP
  const [horasTurno, setHorasTurno] = useState<HorasTurnoRow[]>([])
  const [horasGenero, setHorasGenero] = useState<HorasGeneroRow[]>([])
  const [horasDepartamento, setHorasDepartamento] = useState<HorasDepartamentoRow[]>([])
  const [horasEjecutadasVsDesignadas, setHorasEjecutadasVsDesignadas] = useState<HorasEjecutadasVsDesignadasRow[]>([])
  const [sesionesPorMes, setSesionesPorMes] = useState<SesionesPorMesRow[]>([])
  const [sesionesPorPsicologo, setSesionesPorPsicologo] = useState<SesionesPorPsicologoRow[]>([])

  // Casos Clínicos
  const [gravedad, setGravedad] = useState<CasoGravedadRow[]>([])
  const [tipologias, setTipologias] = useState<TipologiaGeneroRow[]>([])
  const [scorePromedio, setScorePromedio] = useState<ScorePromedioRow[]>([])

  // Participantes
  const [participantesCarrera, setParticipantesCarrera] = useState<ParticipanteCarreraRow[]>([])
  const [semestres, setSemestres] = useState<SemestreRow[]>([])
  const [nuevosPacientesPorMes, setNuevosPacientesPorMes] = useState<NuevosPacientesPorMesRow[]>([])
  const [distribucionGenero, setDistribucionGenero] = useState<DistribucionGeneroRow[]>([])
  const [distribucionEdad, setDistribucionEdad] = useState<DistribucionEdadRow[]>([])

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      const [
        turno, genero, departamento, ejVsDesig, sesMes, sesPsi,
        grav, tipol, scores,
        carrera, sem, nuevosPac, distGenero, distEdad,
      ] = await Promise.all([
        reportesService.horasPorTurno(anio),
        reportesService.horasPorGenero(anio),
        reportesService.horasPorDepartamento(anio),
        reportesService.horasEjecutadasVsDesignadas(anio),
        reportesService.sesionesPorMes(anio),
        reportesService.sesionesPorPsicologo(anio),
        reportesService.casosPorGravedad(),
        reportesService.tipologiasPorGenero(),
        reportesService.scorePromedio(anio),
        reportesService.participantesPorCarrera(),
        reportesService.semestres(),
        reportesService.nuevosPacientesPorMes(anio),
        reportesService.distribucionGenero(),
        reportesService.distribucionEdad(),
      ])

      if (cancelled) return

      setHorasTurno(turno)
      setHorasGenero(genero)
      setHorasDepartamento(departamento)
      setHorasEjecutadasVsDesignadas(ejVsDesig)
      setSesionesPorMes(sesMes)
      setSesionesPorPsicologo(sesPsi)
      setGravedad(grav)
      setTipologias(tipol)
      setScorePromedio(scores)
      setParticipantesCarrera(carrera)
      setSemestres(sem)
      setNuevosPacientesPorMes(nuevosPac)
      setDistribucionGenero(distGenero)
      setDistribucionEdad(distEdad)
      setLoading(false)
    }

    fetchAll()
    return () => { cancelled = true }
  }, [anio])

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar con branding */}
      <header className="bg-[#0f172a] text-white px-8 py-4 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          UCB Tarija
        </p>
        <h1 className="text-lg font-extrabold uppercase tracking-tight">
          Gabinete Psicologico
        </h1>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-extrabold text-slate-900 uppercase tracking-tight mb-1 text-center">
            Panel Principal
          </h2>
          <p className="text-sm text-slate-500 mb-8 text-center">
            Seleccione una accion para comenzar
          </p>

          {/* AccionCards */}
          <div className="grid grid-cols-4 gap-6">
            <AccionCard
              icon={FileText}
              title="Ver Informe"
              description="Consulta el listado completo de entrevistas y orientaciones"
              onClick={() => navigate("/informe")}
              colorScheme="indigo"
            />
            <AccionCard
              icon={UserPlus}
              title="Crear Paciente"
              description="Registra un nuevo paciente y realiza la entrevista inicial"
              onClick={() => navigate("/registro-paciente")}
              colorScheme="emerald"
            />
            <AccionCard
              icon={PlayCircle}
              title="Continuar Sesion"
              description="Busca un paciente existente para agregar una nueva sesion"
              onClick={() => navigate("/continuar-sesion")}
              colorScheme="amber"
            />
            <AccionCard
              icon={Settings}
              title="Configuracion"
              description="Administra psicologos, carreras y horas designadas"
              onClick={() => navigate("/configuracion")}
              colorScheme="slate"
            />
          </div>

          {/* Statistics section */}
          <div className="mt-10">
            <Tabs defaultValue="uso">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="uso">Uso del AP</TabsTrigger>
                  <TabsTrigger value="casos">Casos Clínicos</TabsTrigger>
                  <TabsTrigger value="participantes">Participantes</TabsTrigger>
                </TabsList>

                {/* Year selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">Año:</span>
                  <Select
                    value={String(anio)}
                    onValueChange={(val) => setAnio(Number(val))}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2026">2026</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col gap-6">
                  <Skeleton className="h-64 w-full rounded-2xl" />
                  <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                    <Skeleton className="h-64 w-full rounded-2xl" />
                  </div>
                </div>
              ) : (
                <>
                  {/* ── Tab: Uso del AP ─────────────────────────────── */}
                  <TabsContent value="uso" className="flex flex-col gap-6">
                    <GraficaHorasEjecutadasVsDesignadas data={horasEjecutadasVsDesignadas} />
                    {/* <GraficaHorasTurno data={horasTurno} /> */}
                    <div className="grid grid-cols-2 gap-6">
                      <GraficaSesionesPorMes data={sesionesPorMes} />
                      <GraficaSesionesPorPsicologo data={sesionesPorPsicologo} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <GraficaHorasGenero data={horasGenero} />
                      <GraficaHorasDepartamento data={horasDepartamento} />
                    </div>
                  </TabsContent>

                  {/* ── Tab: Casos Clínicos ─────────────────────────── */}
                  <TabsContent value="casos" className="flex flex-col gap-6">
                    <GraficaScorePromedio data={scorePromedio} />
                    <div className="grid grid-cols-2 gap-6">
                      <GraficaGravedad data={gravedad} />
                      <GraficaTipologias data={tipologias} />
                    </div>
                  </TabsContent>

                  {/* ── Tab: Participantes ──────────────────────────── */}
                  <TabsContent value="participantes" className="flex flex-col gap-6">
                    <GraficaNuevosPacientesPorMes data={nuevosPacientesPorMes} />
                    <div className="grid grid-cols-2 gap-6">
                      <GraficaDistribucionGenero data={distribucionGenero} />
                      <GraficaDistribucionEdad data={distribucionEdad} />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <GraficaSemestres data={semestres} />
                      <GraficaParticipantesCarrera data={participantesCarrera} />
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}

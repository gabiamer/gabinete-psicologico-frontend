import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { format, startOfYear, endOfYear } from "date-fns"
import { FileText, UserPlus, PlayCircle, Settings, ClipboardList, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import AccionCard from "@/components/dashboard/AccionCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { SelectorRango } from "@/components/dashboard/SelectorRango"
import { BotonExportarGraficasPDF } from "@/components/dashboard/BotonExportarGraficasPDF"
import {
  reportesService,
  type RangoParams,
  type CasoGravedadRow,
  type CasoSituacionRow,
  type TipologiaGeneroRow,
  type ParticipanteCarreraRow,
  type HorasDepartamentoRow,
  type SesionesPorMesRow,
  type SesionesPorPsicologoRow,
  type SesionesPorTurnoRow,
  type PacientesPorPsicologoRow,
  type ScorePromedioRow,
  type SemestreRow,
  type NuevosPacientesPorMesRow,
  type DistribucionGeneroRow,
  type DistribucionEdadRow,
} from "@/services/reportesService"
import { GraficaSesionesPorTurno } from "@/components/dashboard/ui/GraficaSesionesPorTurno"
import { GraficaPacientesPorPsicologo } from "@/components/dashboard/ui/GraficaPacientesPorPsicologo"
import { GraficaHorasDepartamento } from "@/components/dashboard/ui/GraficaHorasDepartamento"
import { GraficaGravedad } from "@/components/dashboard/ui/GraficaGravedad"
import { GraficaSituacionCaso } from "@/components/dashboard/ui/GraficaSituacionCaso"
import { GraficaTipologias } from "@/components/dashboard/ui/GraficaTipologias"
import { GraficaParticipantesCarrera } from "@/components/dashboard/ui/GraficaParticipantesCarrera"
import { GraficaSesionesPorMes } from "@/components/dashboard/ui/GraficaSesionesPorMes"
import { GraficaSesionesPorPsicologo } from "@/components/dashboard/ui/GraficaSesionesPorPsicologo"
import { GraficaScorePromedio } from "@/components/dashboard/ui/GraficaScorePromedio"
import { GraficaSemestres } from "@/components/dashboard/ui/GraficaSemestres"
import { GraficaNuevosPacientesPorMes } from "@/components/dashboard/ui/GraficaNuevosPacientesPorMes"
import { GraficaDistribucionGenero } from "@/components/dashboard/ui/GraficaDistribucionGenero"
import { GraficaDistribucionEdad } from "@/components/dashboard/ui/GraficaDistribucionEdad"

function rangoAnioActual(): RangoParams {
  const hoy = new Date()
  return {
    desde: format(startOfYear(hoy), "yyyy-MM-dd"),
    hasta: format(endOfYear(hoy), "yyyy-MM-dd"),
  }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const [rango, setRango] = useState<RangoParams>(rangoAnioActual())
  const [loading, setLoading] = useState(true)

  // Uso del AP
  const [sesionesPorMes, setSesionesPorMes] = useState<SesionesPorMesRow[]>([])
  const [sesionesPorPsicologo, setSesionesPorPsicologo] = useState<SesionesPorPsicologoRow[]>([])
  const [sesionesPorTurno, setSesionesPorTurno] = useState<SesionesPorTurnoRow[]>([])
  const [pacientesPorPsicologo, setPacientesPorPsicologo] = useState<PacientesPorPsicologoRow[]>([])
  const [sesionesDepartamento, setSesionesDepartamento] = useState<HorasDepartamentoRow[]>([])

  // Casos Clínicos
  const [gravedad, setGravedad] = useState<CasoGravedadRow[]>([])
  const [situacionCaso, setSituacionCaso] = useState<CasoSituacionRow[]>([])
  const [tipologias, setTipologias] = useState<TipologiaGeneroRow[]>([])
  const [scorePromedio, setScorePromedio] = useState<ScorePromedioRow[]>([])

  // Participantes
  const [participantesCarrera, setParticipantesCarrera] = useState<ParticipanteCarreraRow[]>([])
  const [semestres, setSemestres] = useState<SemestreRow[]>([])
  const [nuevosPacientesPorMes, setNuevosPacientesPorMes] = useState<NuevosPacientesPorMesRow[]>([])
  const [distribucionGenero, setDistribucionGenero] = useState<DistribucionGeneroRow[]>([])
  const [distribucionEdad, setDistribucionEdad] = useState<DistribucionEdadRow[]>([])

  // Memoize rango string to avoid re-fetching on object identity changes with same values
  const rangoKey = useMemo(() => `${rango.desde}|${rango.hasta}`, [rango])

  useEffect(() => {
    let cancelled = false

    async function fetchAll() {
      setLoading(true)
      const [
        sesMes, sesPsi, sesTurno, pacPsi, sesDep,
        grav, sit, tipol, scores,
        carrera, sem, nuevosPac, distGenero, distEdad,
      ] = await Promise.all([
        reportesService.sesionesPorMes(rango),
        reportesService.sesionesPorPsicologo(rango),
        reportesService.sesionesPorTurno(rango),
        reportesService.pacientesPorPsicologo(),
        reportesService.horasPorDepartamento(rango),
        reportesService.casosPorGravedad(rango),
        reportesService.casosPorSituacion(),
        reportesService.tipologiasPorGenero(rango),
        reportesService.scorePromedio(rango),
        reportesService.participantesPorCarrera(),
        reportesService.semestres(),
        reportesService.nuevosPacientesPorMes(rango),
        reportesService.distribucionGenero(),
        reportesService.distribucionEdad(),
      ])

      if (cancelled) return

      setSesionesPorMes(sesMes)
      setSesionesPorPsicologo(sesPsi)
      setSesionesPorTurno(sesTurno)
      setPacientesPorPsicologo(pacPsi)
      setSesionesDepartamento(sesDep)
      setGravedad(grav)
      setSituacionCaso(sit)
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
  }, [rangoKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar con branding UCB */}
      <header className="bg-primary text-primary-foreground px-8 py-4 flex-shrink-0 flex items-center justify-between border-b-4 border-accent">
        <div className="flex items-center gap-4">
          <img src="/UCB LOGO.png" alt="UCB" className="h-10 object-contain" />
          <div className="border-l border-white/30 pl-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
              UCB Tarija
            </p>
            <h1 className="text-lg font-extrabold uppercase tracking-tight">
              Gabinete Psicológico
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-primary-foreground/80">
            {user?.psicologoNombre || user?.username}
          </span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="flex items-center gap-1 text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-6xl">
          <h2 className="text-2xl font-extrabold text-foreground uppercase tracking-tight mb-1 text-center">
            Panel Principal
          </h2>
          <p className="text-sm text-muted-foreground mb-8 text-center">
            Seleccione una accion para comenzar
          </p>

          {/* AccionCards */}
          <div className={`grid gap-6 ${isAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
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
              icon={ClipboardList}
              title="Actividades"
              description="Registra actividades realizadas por los psicologos"
              onClick={() => navigate("/actividades")}
              colorScheme="teal"
            />
            {isAdmin && (
              <AccionCard
                icon={Settings}
                title="Configuracion"
                description="Administra psicologos, carreras y horas designadas"
                onClick={() => navigate("/configuracion")}
                colorScheme="slate"
              />
            )}
          </div>

          {/* Statistics section */}
          <div className="mt-10">
            <Tabs defaultValue={isAdmin ? "uso" : "casos"}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <TabsList>
                  {isAdmin && <TabsTrigger value="uso">Uso del AP</TabsTrigger>}
                  <TabsTrigger value="casos">Casos Clínicos</TabsTrigger>
                  <TabsTrigger value="participantes">Participantes</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2 flex-wrap">
                  <SelectorRango value={rango} onChange={setRango} />
                  {!loading && (
                    <BotonExportarGraficasPDF
                      graficaIds={
                        isAdmin
                          ? ["g-ses-mes","g-ses-turno","g-pac-psi","g-ses-psi","g-dep",
                             "g-score","g-gravedad","g-tipologias","g-situacion",
                             "g-nuevos-pac","g-dist-genero","g-dist-edad","g-semestres","g-carrera"]
                          : ["g-score","g-gravedad","g-tipologias","g-situacion",
                             "g-nuevos-pac","g-dist-genero","g-dist-edad","g-semestres","g-carrera"]
                      }
                      nombreArchivo="graficas-gabinete.pdf"
                    />
                  )}
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
                  {/* ── Tab: Uso del AP (solo ADMIN) ────────────────── */}
                  <TabsContent value="uso" className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div id="g-ses-mes"><GraficaSesionesPorMes data={sesionesPorMes} /></div>
                      <div id="g-ses-turno"><GraficaSesionesPorTurno data={sesionesPorTurno} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div id="g-pac-psi"><GraficaPacientesPorPsicologo data={pacientesPorPsicologo} /></div>
                      <div id="g-ses-psi"><GraficaSesionesPorPsicologo data={sesionesPorPsicologo} /></div>
                    </div>
                    <div id="g-dep"><GraficaHorasDepartamento data={sesionesDepartamento} /></div>
                  </TabsContent>

                  {/* ── Tab: Casos Clínicos ─────────────────────────── */}
                  <TabsContent value="casos" className="flex flex-col gap-6">
                    <div id="g-score"><GraficaScorePromedio data={scorePromedio} /></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div id="g-gravedad"><GraficaGravedad data={gravedad} /></div>
                      <div id="g-tipologias"><GraficaTipologias data={tipologias} /></div>
                    </div>
                    <div id="g-situacion"><GraficaSituacionCaso data={situacionCaso} /></div>
                  </TabsContent>

                  {/* ── Tab: Participantes ──────────────────────────── */}
                  <TabsContent value="participantes" className="flex flex-col gap-6">
                    <div id="g-nuevos-pac"><GraficaNuevosPacientesPorMes data={nuevosPacientesPorMes} /></div>
                    <div className="grid grid-cols-2 gap-6">
                      <div id="g-dist-genero"><GraficaDistribucionGenero data={distribucionGenero} /></div>
                      <div id="g-dist-edad"><GraficaDistribucionEdad data={distribucionEdad} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div id="g-semestres"><GraficaSemestres data={semestres} /></div>
                      <div id="g-carrera"><GraficaParticipantesCarrera data={participantesCarrera} /></div>
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

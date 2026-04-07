import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Compass,
  Search,
  Plus,
  Users,
  CalendarDays,
  Activity,
  RefreshCw,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import EntrevistasTable from '@/components/entrevistas/EntrevistasTable';
import OrientacionesTable from '@/components/entrevistas/OrientacionesTable';
import { BotonReporteWord } from '@/components/shared/BotonReporteWord';
import { dashboardService } from '@/services/dashboardService';
import type { EntrevistaRow, OrientacionRow, DashboardStats } from '@/services/dashboardService';
import { pacienteService } from '@/services/pacienteService';
import type { Psicologo } from '@/types/types';

type TabType = 'entrevistas' | 'orientaciones';

export default function Informe() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('entrevistas');
  const [entrevistas, setEntrevistas] = useState<EntrevistaRow[]>([]);
  const [orientaciones, setOrientaciones] = useState<OrientacionRow[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [psicologos, setPsicologos] = useState<Psicologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroGravedad, setFiltroGravedad] = useState<string>('todos');
  const [filtroPsicologo, setFiltroPsicologo] = useState<string>('todos');
  const [filtroSituacion, setFiltroSituacion] = useState<string>('todos');
  const [generandoId, setGenerandoId] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [entrevistasData, orientacionesData, statsData, psicologosData] = await Promise.all([
        dashboardService.obtenerEntrevistas(),
        dashboardService.obtenerOrientaciones(),
        dashboardService.obtenerEstadisticas(),
        pacienteService.obtenerPsicologos(),
      ]);
      setEntrevistas(entrevistasData);
      setOrientaciones(orientacionesData);
      setStats(statsData);
      setPsicologos(psicologosData);
    } catch (err) {
      console.error('Error cargando informe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarSituacion = async (id: number, situacion: string) => {
    try {
      await dashboardService.actualizarSituacion(id, situacion);
      setEntrevistas((prev) =>
        prev.map((e) =>
          e.pacienteUniversitarioId === id ? { ...e, situacionCaso: situacion } : e
        )
      );
    } catch (err) {
      console.error('Error al cambiar situacion:', err);
    }
  };

  const handleEliminarEntrevista = async (id: number) => {
    try {
      await dashboardService.eliminarEntrevista(id);
      setEntrevistas((prev) => prev.filter((e) => e.pacienteUniversitarioId !== id));
    } catch (err) {
      console.error('Error al eliminar entrevista:', err);
    }
  };

  const handleEliminarOrientacion = async (id: number) => {
    try {
      await dashboardService.eliminarOrientacion(id);
      setOrientaciones((prev) => prev.filter((o) => o.pacienteExternoId !== id));
    } catch (err) {
      console.error('Error al eliminar orientacion:', err);
    }
  };

  const handleGenerarResumen = async (id: number) => {
    setGenerandoId(id);
    try {
      const resultado = await dashboardService.generarResumen(id);
      setEntrevistas((prev) =>
        prev.map((e) =>
          e.pacienteUniversitarioId === id
            ? { ...e, descripcion: resultado.descripcion, principalProblematica: resultado.principalProblematica }
            : e
        )
      );
    } catch (err) {
      console.error('Error al generar resumen:', err);
    } finally {
      setGenerandoId(null);
    }
  };

  const entrevistasFiltradas = useMemo(() => {
    return entrevistas.filter((e) => {
      const matchSearch =
        !searchTerm ||
        e.estudianteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.derivadoPor && e.derivadoPor.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchGravedad = filtroGravedad === 'todos' || e.gravedad === filtroGravedad;
      const matchPsicologo = filtroPsicologo === 'todos' || String(e.psicologoId) === filtroPsicologo;
      const matchSituacion = filtroSituacion === 'todos' || e.situacionCaso === filtroSituacion;
      return matchSearch && matchGravedad && matchPsicologo && matchSituacion;
    });
  }, [entrevistas, searchTerm, filtroGravedad, filtroPsicologo, filtroSituacion]);

  const orientacionesFiltradas = useMemo(() => {
    return orientaciones.filter((o) =>
      !searchTerm ||
      o.estudianteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (o.escuela && o.escuela.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [orientaciones, searchTerm]);

  const hayFiltrosActivos = searchTerm || filtroGravedad !== 'todos' || filtroPsicologo !== 'todos' || filtroSituacion !== 'todos';

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroGravedad('todos');
    setFiltroPsicologo('todos');
    setFiltroSituacion('todos');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar con branding */}
      <header className="bg-[#0f172a] text-white px-8 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">UMSA</p>
            <h1 className="text-lg font-extrabold uppercase tracking-tight">Gabinete Psicologico</h1>
          </div>
        </div>

        {/* Toggle switch Entrevistas / Orientaciones */}
        <div className="flex items-center bg-slate-800 rounded-lg p-1 gap-1">
          <button
            onClick={() => setActiveTab('entrevistas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'entrevistas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Brain className="h-4 w-4" />
            Entrevistas
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === 'entrevistas' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-700 text-slate-300'
            }`}>
              {entrevistas.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('orientaciones')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all ${
              activeTab === 'orientaciones'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="h-4 w-4" />
            Orientaciones
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
              activeTab === 'orientaciones' ? 'bg-amber-100 text-amber-700' : 'bg-slate-700 text-slate-300'
            }`}>
              {orientaciones.length}
            </span>
          </button>
        </div>
      </header>

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Subheader con título y acciones */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              {activeTab === 'entrevistas' ? 'Entrevistas Psicologicas' : 'Orientaciones Vocacionales'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeTab === 'entrevistas'
                ? `${entrevistasFiltradas.length} registro${entrevistasFiltradas.length !== 1 ? 's' : ''}`
                : `${orientacionesFiltradas.length} registro${orientacionesFiltradas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={cargarDatos} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <BotonReporteWord />
            {activeTab === 'entrevistas' ? (
              <Button
                onClick={() => navigate('/registro-paciente')}
                className="bg-[#0f172a] hover:bg-indigo-600 text-white font-bold uppercase text-xs tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Paciente
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/registro-paciente-externo')}
                className="bg-[#0f172a] hover:bg-indigo-600 text-white font-bold uppercase text-xs tracking-wide"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nueva Orientacion
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        {!loading && stats && (
          <div className="px-8 pt-6 pb-2 flex-shrink-0">
            <div className="grid grid-cols-4 gap-4">
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.totalPacientesUniversitarios}</p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Pac. Universitarios</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.totalPacientesExternos}</p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Pac. Externos</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900">{stats.totalSesiones}</p>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Sesiones</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {stats.gravedadDistribucion && (
                        <>
                          <span className="text-xs font-bold text-emerald-600">{stats.gravedadDistribucion.leve}L</span>
                          <span className="text-xs font-bold text-amber-600">{stats.gravedadDistribucion.moderado}M</span>
                          <span className="text-xs font-bold text-red-600">{stats.gravedadDistribucion.grave}G</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Gravedad</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Filtros */}
        <div className="px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={activeTab === 'entrevistas' ? 'Buscar por nombre, carrera...' : 'Buscar por nombre, escuela...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {activeTab === 'entrevistas' && (
              <>
                <Select value={filtroPsicologo} onValueChange={setFiltroPsicologo}>
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Psicologo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los psicologos</SelectItem>
                    {psicologos.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.person.primerNombre} {p.person.apellidoPaterno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filtroGravedad} onValueChange={setFiltroGravedad}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Gravedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="leve">Leve</SelectItem>
                    <SelectItem value="moderado">Moderado</SelectItem>
                    <SelectItem value="grave">Grave</SelectItem>
                    <SelectItem value="Sin evaluar">Sin evaluar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filtroSituacion} onValueChange={setFiltroSituacion}>
                  <SelectTrigger className="w-56">
                    <SelectValue placeholder="Situacion del caso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas las situaciones</SelectItem>
                    <SelectItem value="Acompañamiento psicológico">Acompañamiento psicológico</SelectItem>
                    <SelectItem value="Buen proceso">Buen proceso</SelectItem>
                    <SelectItem value="Proceso terminado">Proceso terminado</SelectItem>
                    <SelectItem value="Orientación vocacional">Orientación vocacional</SelectItem>
                    <SelectItem value="Derivado a consultorio externo">Derivado a consultorio externo</SelectItem>
                  </SelectContent>
                </Select>
              </>
            )}

            {hayFiltrosActivos && (
              <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="text-slate-500">
                <X className="h-4 w-4 mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <div className="flex-1 overflow-auto px-8 py-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : activeTab === 'entrevistas' ? (
            <EntrevistasTable
              data={entrevistasFiltradas}
              onVerHistorial={(id) => navigate(`/pacientes/${id}/historial`)}
              onNuevaSesion={(id) => navigate(`/pacientes/${id}/nueva-sesion`)}
              onGenerarResumen={handleGenerarResumen}
              onCambiarSituacion={handleCambiarSituacion}
              onEliminar={handleEliminarEntrevista}
              generandoId={generandoId}
            />
          ) : (
            <OrientacionesTable
              data={orientacionesFiltradas}
              onVerDetalle={(id) => navigate(`/pacientes-externos/${id}/detalle-orientacion`)}
              onNuevaOrientacion={(id) => navigate(`/pacientes-externos/${id}/orientacion-vocacional`)}
              onEliminar={handleEliminarOrientacion}
            />
          )}
        </div>
      </div>
    </div>
  );
}

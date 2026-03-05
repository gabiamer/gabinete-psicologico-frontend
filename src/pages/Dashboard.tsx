import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BotonReporteWord } from '@/components/shared/BotonReporteWord';
import {
  Brain,
  Compass,
  Search,
  Plus,
  Users,
  CalendarDays,
  Activity,
  MoreHorizontal,
  Eye,
  FilePlus,
  AlertTriangle,
  Shield,
  ShieldAlert,
  RefreshCw,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService } from '@/services/dashboardService';
import type { EntrevistaRow, OrientacionRow, DashboardStats } from '@/services/dashboardService';
import { pacienteService } from '@/services/pacienteService';
import type { Psicologo } from '@/types/types';
import { cn } from '@/lib/utils';

type TabType = 'entrevistas' | 'orientaciones';

const gravedadConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
  leve: { label: 'Leve', variant: 'secondary', icon: <Shield className="h-3 w-3" /> },
  moderado: { label: 'Moderado', variant: 'default', icon: <ShieldAlert className="h-3 w-3" /> },
  grave: { label: 'Grave', variant: 'destructive', icon: <AlertTriangle className="h-3 w-3" /> },
  'Sin evaluar': { label: 'Sin evaluar', variant: 'outline', icon: null },
};

export default function Dashboard() {
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
      console.error('Error cargando dashboard:', err);
    } finally {
      setLoading(false);
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
      const matchPsicologo =
        filtroPsicologo === 'todos' || String(e.psicologoId) === filtroPsicologo;
      return matchSearch && matchGravedad && matchPsicologo;
    });
  }, [entrevistas, searchTerm, filtroGravedad, filtroPsicologo]);

  const orientacionesFiltradas = useMemo(() => {
    return orientaciones.filter((o) => {
      return (
        !searchTerm ||
        o.estudianteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.escuela && o.escuela.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  }, [orientaciones, searchTerm]);

  const hayFiltrosActivos = searchTerm || filtroGravedad !== 'todos' || filtroPsicologo !== 'todos';

  const limpiarFiltros = () => {
    setSearchTerm('');
    setFiltroGravedad('todos');
    setFiltroPsicologo('todos');
  };

  const sidebarItems = [
    {
      key: 'entrevistas' as TabType,
      label: 'Entrevistas Psicologicas',
      icon: Brain,
      count: entrevistas.length,
    },
    {
      key: 'orientaciones' as TabType,
      label: 'Orientaciones Vocacionales',
      icon: Compass,
      count: orientaciones.length,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* SIDEBAR VERTICAL */}
      <aside className="w-72 flex-shrink-0 bg-[#0f172a] text-white flex flex-col">
        {/* Logo / Header */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-lg font-extrabold tracking-tight uppercase">
            Gabinete Psicologico
          </h1>
          <p className="text-xs text-slate-400 mt-1">Panel de Administracion</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  setSearchTerm('');
                  setFiltroGravedad('todos');
                  setFiltroPsicologo('todos');
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-bold',
                    isActive ? 'bg-white/20' : 'bg-slate-700'
                  )}
                >
                  {item.count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-500 text-center">
            UMSA - Gabinete Psicologico
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">
              {activeTab === 'entrevistas' ? 'Entrevistas Psicologicas' : 'Orientaciones Vocacionales'}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {activeTab === 'entrevistas'
                ? `${entrevistasFiltradas.length} registro${entrevistasFiltradas.length !== 1 ? 's' : ''} encontrado${entrevistasFiltradas.length !== 1 ? 's' : ''}`
                : `${orientacionesFiltradas.length} registro${orientacionesFiltradas.length !== 1 ? 's' : ''} encontrado${orientacionesFiltradas.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={cargarDatos}
              disabled={loading}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
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
        </header>

        {/* Stats Cards */}
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

        {/* Filters */}
        <div className="px-8 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={activeTab === 'entrevistas' ? 'Buscar por nombre, carrera, derivado por...' : 'Buscar por nombre, escuela...'}
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

        {/* Table Content */}
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
            />
          ) : (
            <OrientacionesTable
              data={orientacionesFiltradas}
              onVerDetalle={(id) => navigate(`/pacientes-externos/${id}/detalle-orientacion`)}
              onNuevaOrientacion={(id) => navigate(`/pacientes-externos/${id}/orientacion-vocacional`)}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function EntrevistasTable({
  data,
  onVerHistorial,
  onNuevaSesion,
}: {
  data: EntrevistaRow[];
  onVerHistorial: (id: number) => void;
  onNuevaSesion: (id: number) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Brain className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">No se encontraron entrevistas</p>
        <p className="text-sm mt-1">Ajuste los filtros o registre una nueva entrevista</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-bold text-xs uppercase text-slate-600 w-16">Nro</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Estudiante</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Derivado por</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Carrera</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Sesiones</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Ultima Sesion</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Gravedad</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Psicologo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const gConfig = gravedadConfig[row.gravedad] || gravedadConfig['Sin evaluar'];
            return (
              <TableRow
                key={row.pacienteUniversitarioId}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onVerHistorial(row.pacienteUniversitarioId)}
              >
                <TableCell className="font-mono text-sm text-slate-500">{index + 1}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-semibold text-slate-900">{row.estudianteNombre}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{row.derivadoPor || '-'}</TableCell>
                <TableCell>
                  <span className="text-sm text-slate-700">{row.carrera}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {row.numeroSesiones}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {row.ultimaSesionFecha
                    ? new Date(row.ultimaSesionFecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant={gConfig.variant} className="gap-1 text-xs">
                    {gConfig.icon}
                    {gConfig.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{row.psicologoNombre}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onVerHistorial(row.pacienteUniversitarioId)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Historial
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onNuevaSesion(row.pacienteUniversitarioId)}>
                        <FilePlus className="h-4 w-4 mr-2" />
                        Agregar Sesion
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function OrientacionesTable({
  data,
  onVerDetalle,
  onNuevaOrientacion,
}: {
  data: OrientacionRow[];
  onVerDetalle: (id: number) => void;
  onNuevaOrientacion: (id: number) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Compass className="h-12 w-12 mb-4" />
        <p className="text-lg font-semibold">No se encontraron orientaciones</p>
        <p className="text-sm mt-1">Ajuste los filtros o registre una nueva orientacion</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-bold text-xs uppercase text-slate-600 w-16">Nro</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Estudiante</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Escuela</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Anio</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Edad</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Correo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Entrevistas</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Ultima Fecha</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.pacienteExternoId}
              className="hover:bg-slate-50/80 transition-colors cursor-pointer"
              onClick={() => onVerDetalle(row.pacienteExternoId)}
            >
              <TableCell className="font-mono text-sm text-slate-500">{index + 1}</TableCell>
              <TableCell>
                <span className="font-semibold text-slate-900">{row.estudianteNombre}</span>
              </TableCell>
              <TableCell className="text-sm text-slate-700">{row.escuela || '-'}</TableCell>
              <TableCell className="text-center text-sm text-slate-600">{row.anio || '-'}</TableCell>
              <TableCell className="text-center text-sm text-slate-600">{row.edad || '-'}</TableCell>
              <TableCell className="text-sm text-slate-500">{row.correo || '-'}</TableCell>
              <TableCell className="text-center">
                <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {row.numeroOrientaciones}
                </span>
              </TableCell>
              <TableCell className="text-sm text-slate-500">
                {row.ultimaOrientacionFecha
                  ? new Date(row.ultimaOrientacionFecha).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onVerDetalle(row.pacienteExternoId)}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNuevaOrientacion(row.pacienteExternoId)}>
                      <FilePlus className="h-4 w-4 mr-2" />
                      Nueva Orientacion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, GraduationCap, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { dashboardService } from '@/services/dashboardService';
import type { EntrevistaRow } from '@/services/dashboardService';
import { usePaginacion } from '@/hooks/usePaginacion';
import { Paginacion } from '@/components/shared/Paginacion';

export default function ContinuarSesion() {
  const navigate = useNavigate();
  const [termino, setTermino] = useState('');
  const [todos, setTodos] = useState<EntrevistaRow[]>([]);
  const [filtrados, setFiltrados] = useState<EntrevistaRow[]>([]);
  const [cargando, setCargando] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dashboardService.obtenerEntrevistas()
      .then((data) => {
        const invertido = [...data].reverse();
        setTodos(invertido);
        setFiltrados(invertido);
      })
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const q = termino.trim().toLowerCase();
      if (!q) {
        setFiltrados(todos);
        return;
      }
      setFiltrados(
        todos.filter((p) =>
          p.nombreCompleto.toLowerCase().includes(q) ||
          p.estudianteNombre.toLowerCase().includes(q) ||
          p.carrera.toLowerCase().includes(q)
        )
      );
    }, 1000);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [termino, todos]);

  const pag = usePaginacion(filtrados);

  return (
    <div className="flex h-screen bg-slate-50 items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="mb-6 text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al panel
        </Button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-[#0f172a] px-8 py-6">
            <h1 className="text-xl font-extrabold text-white uppercase tracking-tight">
              Continuar Sesion
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Selecciona el paciente para agregar una nueva sesion
            </p>
          </div>

          <div className="px-8 py-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Filtrar por nombre o carrera..."
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>

            <div className="mt-4 space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {cargando && (
                <>
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                  <Skeleton className="h-14 w-full rounded-xl" />
                </>
              )}

              {!cargando && filtrados.length === 0 && (
                <div className="text-center py-10 text-slate-400">
                  <GraduationCap className="h-10 w-10 mx-auto mb-3" />
                  <p className="font-semibold">No se encontraron pacientes</p>
                  <p className="text-sm mt-1">Intenta con otro nombre o carrera</p>
                </div>
              )}

              {pag.paginados.map((p) => (
                <div
                  key={p.pacienteUniversitarioId}
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-sm">{p.nombreCompleto}</span>
                      <Badge variant="secondary" className="text-xs shrink-0">
                        <GraduationCap className="h-3 w-3 mr-1" />
                        Universitario
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {p.carrera}
                      {p.psicologoNombre && p.psicologoNombre !== 'Sin asignar'
                        ? ` · Psic. ${p.psicologoNombre}`
                        : ''}
                      {` · ${p.numeroSesiones} sesion${p.numeroSesiones !== 1 ? 'es' : ''}`}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(`/pacientes/${p.pacienteUniversitarioId}/nueva-sesion`)}
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold ml-4 shrink-0"
                  >
                    <FilePlus className="h-4 w-4 mr-1.5" />
                    Nueva Sesion
                  </Button>
                </div>
              ))}
            </div>

            {!cargando && (
              <Paginacion
                pagina={pag.pagina}
                totalPaginas={pag.totalPaginas}
                total={pag.total}
                onChange={pag.setPagina}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

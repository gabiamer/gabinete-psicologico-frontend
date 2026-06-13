import { Brain, Eye, FilePlus, Sparkles, Loader2, MoreHorizontal, AlertTriangle, Shield, ShieldAlert, Trash2 } from 'lucide-react';
import { DropdownMenuSeparator } from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';
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
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { EntrevistaRow } from '@/services/dashboardService';

const SITUACIONES = [
  'Acompañamiento psicológico',
  'Buen proceso',
  'Proceso terminado',
  'Orientación vocacional',
  'Derivado a consultorio externo',
] as const;

const situacionColors: Record<string, string> = {
  'Acompañamiento psicológico':     'bg-yellow-100 text-yellow-800',
  'Buen proceso':                   'bg-green-100 text-green-800',
  'Proceso terminado':              'bg-blue-100 text-blue-800',
  'Orientación vocacional':         'bg-orange-100 text-orange-800',
  'Derivado a consultorio externo': 'bg-red-100 text-red-800',
};

const gravedadConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  leve:          { label: 'Leve',        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200',  icon: <Shield className="h-3 w-3" /> },
  moderado:      { label: 'Moderado',    className: 'bg-amber-50 text-amber-700 border border-amber-200',        icon: <ShieldAlert className="h-3 w-3" /> },
  grave:         { label: 'Grave',       className: 'bg-rose-50 text-rose-700 border border-rose-200',           icon: <AlertTriangle className="h-3 w-3" /> },
  'Sin evaluar': { label: 'Sin evaluar', className: 'bg-slate-100 text-slate-500 border border-slate-200',       icon: null },
};

interface EntrevistasTableProps {
  data: EntrevistaRow[];
  onVerHistorial: (id: number) => void;
  onNuevaSesion: (id: number) => void;
  onGenerarResumen: (id: number) => void;
  onCambiarSituacion: (id: number, situacion: string) => void;
  onEliminar: (id: number) => void;
  generandoId: number | null;
}

export default function EntrevistasTable({
  data,
  onVerHistorial,
  onNuevaSesion,
  onGenerarResumen,
  onCambiarSituacion,
  onEliminar,
  generandoId,
}: EntrevistasTableProps) {
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
            {/* <TableHead className="font-bold text-xs uppercase text-slate-600">Estudiante</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Derivado por</TableHead> */}
            <TableHead className="font-bold text-xs uppercase text-slate-600">Carrera</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Sesiones</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Ultima Sesion</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Gravedad</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Situacion del Caso</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Psicologo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 max-w-[180px]">Descripcion</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 max-w-[180px]">Problematica</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const gConfig = gravedadConfig[row.gravedad] || gravedadConfig['Sin evaluar'];
            const colorClass = situacionColors[row.situacionCaso] ?? 'bg-slate-100 text-slate-700';
            return (
              <TableRow
                key={row.pacienteUniversitarioId}
                className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                onClick={() => onVerHistorial(row.pacienteUniversitarioId)}
              >
                <TableCell className="font-mono text-sm text-slate-500">{index + 1}</TableCell>
                {/* <TableCell>
                  <span className="font-semibold text-slate-900">{row.estudianteNombre}</span>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{row.derivadoPor || '-'}</TableCell> */}
                <TableCell className="text-sm text-slate-700">{row.carrera}</TableCell>
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
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${gConfig.className}`}>
                    {gConfig.icon}
                    {gConfig.label}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={row.situacionCaso}
                    onValueChange={(val) => onCambiarSituacion(row.pacienteUniversitarioId, val)}
                  >
                    <SelectTrigger className="h-auto border-0 shadow-none p-0 gap-1 focus:ring-0 w-auto [&>svg]:hidden">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${colorClass}`}>
                        {row.situacionCaso}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      {SITUACIONES.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${situacionColors[s]}`}>
                            {s}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-slate-600">{row.psicologoNombre}</TableCell>
                <TableCell className="max-w-[180px]">
                  {row.descripcion ? (
                    <span className="text-xs text-slate-600 line-clamp-2" title={row.descripcion}>
                      {row.descripcion}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Sin generar</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[180px]">
                  {row.principalProblematica ? (
                    <span className="text-xs text-slate-600 line-clamp-2" title={row.principalProblematica}>
                      {row.principalProblematica}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Sin generar</span>
                  )}
                </TableCell>
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
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onGenerarResumen(row.pacienteUniversitarioId);
                        }}
                        disabled={generandoId === row.pacienteUniversitarioId}
                      >
                        {generandoId === row.pacienteUniversitarioId ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2 text-indigo-500" />
                        )}
                        Generar con IA
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`¿Eliminar a "${row.estudianteNombre}" y todos sus datos? Esta acción no se puede deshacer.`)) {
                            onEliminar(row.pacienteUniversitarioId);
                          }
                        }}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
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

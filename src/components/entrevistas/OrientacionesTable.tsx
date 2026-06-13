import { Compass, Eye, FilePlus, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { OrientacionRow } from '@/services/dashboardService';

interface OrientacionesTableProps {
  data: OrientacionRow[];
  onVerDetalle: (id: number) => void;
  onNuevaOrientacion: (id: number) => void;
  onEliminar: (id: number) => void;
}

export default function OrientacionesTable({
  data,
  onVerDetalle,
  onNuevaOrientacion,
  onEliminar,
}: OrientacionesTableProps) {
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
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Año</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Edad</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Correo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600 text-center">Entrevistas</TableHead>
            <TableHead className="font-bold text-xs uppercase text-slate-600">Última Fecha</TableHead>
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
                      Nueva Orientación
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`¿Eliminar a "${row.estudianteNombre}" y todas sus orientaciones? Esta acción no se puede deshacer.`)) {
                          onEliminar(row.pacienteExternoId);
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Eye, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { actividadService, type Actividad } from "@/services/actividadService"
import { usePaginacion } from "@/hooks/usePaginacion"
import { Paginacion } from "@/components/shared/Paginacion"

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

export default function Actividades() {
  const navigate = useNavigate()
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const acts = await actividadService.getAll()
      setActividades([...acts].reverse())
    } finally {
      setLoading(false)
    }
  }, [])

  const pag = usePaginacion(actividades)

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (deleteId === null) return
    await actividadService.delete(deleteId)
    setActividades(prev => prev.filter(a => a.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-primary text-primary-foreground px-8 py-4 flex-shrink-0 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            UCB Tarija
          </p>
          <h1 className="text-lg font-extrabold uppercase tracking-tight">
            Actividades Realizadas
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-800">Registro de Actividades</h3>
            <Button onClick={() => navigate("/actividades/nueva")} size="sm" className="gap-1.5">
              <Plus className="h-4 w-4" /> Nueva Actividad
            </Button>
          </div>

          <div className="rounded-xl border bg-white overflow-hidden" id="tabla-actividades">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Titulo</TableHead>
                  <TableHead>Psicologo</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead>Fecha Fin</TableHead>
                  <TableHead>Poblacion</TableHead>
                  <TableHead className="text-center">Asistentes</TableHead>
                  <TableHead className="w-24 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : actividades.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                      No hay actividades registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  pag.paginados.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">{a.titulo}</TableCell>
                      <TableCell>
                        {a.psicologo.person.primerNombre} {a.psicologo.person.apellidoPaterno}
                      </TableCell>
                      <TableCell>{formatDate(a.fechaInicio)}</TableCell>
                      <TableCell>{formatDate(a.fechaFin)}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{a.poblacion}</TableCell>
                      <TableCell className="text-center">{a.numAsistentes}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-500 hover:text-slate-900"
                            onClick={() => navigate(`/actividades/${a.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-600"
                            onClick={() => setDeleteId(a.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <Paginacion
            pagina={pag.pagina}
            totalPaginas={pag.totalPaginas}
            total={pag.total}
            onChange={pag.setPagina}
          />
        </div>
      </div>

      {/* Delete confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar actividad?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara la actividad y sus evidencias.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

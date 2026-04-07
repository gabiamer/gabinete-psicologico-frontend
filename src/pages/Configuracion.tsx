import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Plus, Pencil, Trash2, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { adminService, type PsicologoInput, type HorasDesignadasRow } from "@/services/adminService"
import type { Psicologo, Carrera } from "@/types/types"

// ─── Months ──────────────────────────────────────────────────────────────────
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

// ─── Psicólogos Tab ──────────────────────────────────────────────────────────
function PsicologosTab() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Psicologo | null>(null)
  const [saving, setSaving] = useState(false)

  const emptyForm: PsicologoInput = {
    primerNombre: "",
    segundoNombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    celular: "",
    ocupacion: "",
  }
  const [form, setForm] = useState<PsicologoInput>(emptyForm)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.psicologos.getAll()
      setPsicologos(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(p: Psicologo) {
    setEditing(p)
    setForm({
      primerNombre: p.person.primerNombre ?? "",
      segundoNombre: (p.person as any).segundoNombre ?? "",
      apellidoPaterno: p.person.apellidoPaterno ?? "",
      apellidoMaterno: (p.person as any).apellidoMaterno ?? "",
      celular: (p.person as any).celular ?? "",
      ocupacion: p.ocupacion ?? "",
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.primerNombre.trim() || !form.apellidoPaterno.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await adminService.psicologos.update(editing.id, form)
        setPsicologos(prev => prev.map(p => p.id === editing.id ? updated : p))
      } else {
        const created = await adminService.psicologos.create(form)
        setPsicologos(prev => [...prev, created])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    await adminService.psicologos.delete(deleteId)
    setPsicologos(prev => prev.filter(p => p.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Psicólogos registrados</h3>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Ocupación</TableHead>
              <TableHead>Celular</TableHead>
              <TableHead className="w-20 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : psicologos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-slate-400 py-8">
                  No hay psicólogos registrados
                </TableCell>
              </TableRow>
            ) : (
              psicologos.map(p => (
                <TableRow key={p.id}>
                  <TableCell>{p.person.primerNombre}</TableCell>
                  <TableCell>{p.person.apellidoPaterno}</TableCell>
                  <TableCell>{p.ocupacion || "—"}</TableCell>
                  <TableCell>{(p.person as any).celular || "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        onClick={() => openEdit(p)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600"
                        onClick={() => setDeleteId(p.id)}
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

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Psicólogo" : "Agregar Psicólogo"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Primer nombre *</Label>
              <Input
                value={form.primerNombre}
                onChange={e => setForm(f => ({ ...f, primerNombre: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Segundo nombre</Label>
              <Input
                value={form.segundoNombre ?? ""}
                onChange={e => setForm(f => ({ ...f, segundoNombre: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Apellido paterno *</Label>
              <Input
                value={form.apellidoPaterno}
                onChange={e => setForm(f => ({ ...f, apellidoPaterno: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Apellido materno</Label>
              <Input
                value={form.apellidoMaterno ?? ""}
                onChange={e => setForm(f => ({ ...f, apellidoMaterno: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Celular</Label>
              <Input
                value={form.celular ?? ""}
                onChange={e => setForm(f => ({ ...f, celular: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Ocupación</Label>
              <Input
                value={form.ocupacion}
                onChange={e => setForm(f => ({ ...f, ocupacion: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.primerNombre.trim() || !form.apellidoPaterno.trim()}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar psicólogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará el psicólogo del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// ─── Carreras Tab ─────────────────────────────────────────────────────────────
function CarrerasTab() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editing, setEditing] = useState<Carrera | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ carrera: "", departamento: "" })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminService.carreras.getAll()
      setCarreras(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditing(null)
    setForm({ carrera: "", departamento: "" })
    setDialogOpen(true)
  }

  function openEdit(c: Carrera) {
    setEditing(c)
    setForm({ carrera: c.carrera, departamento: c.departamento })
    setDialogOpen(true)
  }

  async function handleSave() {
    if (!form.carrera.trim()) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await adminService.carreras.update(editing.id, form.carrera, form.departamento)
        setCarreras(prev => prev.map(c => c.id === editing.id ? updated : c))
      } else {
        const created = await adminService.carreras.create(form.carrera, form.departamento)
        setCarreras(prev => [...prev, created])
      }
      setDialogOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (deleteId === null) return
    await adminService.carreras.delete(deleteId)
    setCarreras(prev => prev.filter(c => c.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Carreras registradas</h3>
        <Button onClick={openCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Agregar
        </Button>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Carrera</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead className="w-20 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-400 py-8">Cargando...</TableCell>
              </TableRow>
            ) : carreras.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-400 py-8">No hay carreras registradas</TableCell>
              </TableRow>
            ) : (
              carreras.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.carrera}</TableCell>
                  <TableCell>{c.departamento || "—"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="h-7 w-7 text-red-400 hover:text-red-600"
                        onClick={() => setDeleteId(c.id)}
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Carrera" : "Agregar Carrera"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre de la carrera *</Label>
              <Input
                value={form.carrera}
                onChange={e => setForm(f => ({ ...f, carrera: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Departamento</Label>
              <Input
                value={form.departamento}
                onChange={e => setForm(f => ({ ...f, departamento: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.carrera.trim()}>
              {saving ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar carrera?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Verifique que no haya estudiantes asociados.
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

// ─── Horas Designadas Tab ─────────────────────────────────────────────────────
type MesHoras = { manana: number; tarde: number }

function HorasTab() {
  const [psicologos, setPsicologos] = useState<Psicologo[]>([])
  const [psicologoId, setPsicologoId] = useState<number | null>(null)
  const [anio, setAnio] = useState(new Date().getFullYear())
  const [grid, setGrid] = useState<MesHoras[]>(
    Array.from({ length: 12 }, () => ({ manana: 0, tarde: 0 }))
  )
  const [saving, setSaving] = useState<number | null>(null)

  useEffect(() => {
    adminService.psicologos.getAll().then(setPsicologos)
  }, [])

  // When psicologo or year changes, load existing hours
  useEffect(() => {
    if (!psicologoId) return
    adminService.horasDesignadas.getByAnio(anio).then((rows: HorasDesignadasRow[]) => {
      const newGrid: MesHoras[] = Array.from({ length: 12 }, () => ({ manana: 0, tarde: 0 }))
      rows
        .filter(r => r.psicologo.id === psicologoId)
        .forEach(r => {
          const idx = r.mes - 1
          if (r.turno === "manana") newGrid[idx].manana = r.horas
          else if (r.turno === "tarde") newGrid[idx].tarde = r.horas
        })
      setGrid(newGrid)
    })
  }, [psicologoId, anio])

  async function saveRow(mesIdx: number) {
    if (!psicologoId) return
    setSaving(mesIdx)
    try {
      await Promise.all([
        adminService.horasDesignadas.upsert({
          psicologoId,
          anio,
          mes: mesIdx + 1,
          turno: "manana",
          horas: grid[mesIdx].manana,
        }),
        adminService.horasDesignadas.upsert({
          psicologoId,
          anio,
          mes: mesIdx + 1,
          turno: "tarde",
          horas: grid[mesIdx].tarde,
        }),
      ])
    } finally {
      setSaving(null)
    }
  }

  function updateHoras(mesIdx: number, turno: "manana" | "tarde", value: string) {
    const num = parseInt(value) || 0
    setGrid(prev => {
      const next = [...prev]
      next[mesIdx] = { ...next[mesIdx], [turno]: num }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-slate-800">Horas Designadas por Psicólogo</h3>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-700">Psicólogo:</Label>
          <Select
            value={psicologoId ? String(psicologoId) : ""}
            onValueChange={v => setPsicologoId(Number(v))}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {psicologos.map(p => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.person.primerNombre} {p.person.apellidoPaterno}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium text-slate-700">Año:</Label>
          <Select value={String(anio)} onValueChange={v => setAnio(Number(v))}>
            <SelectTrigger className="w-28">
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

      {!psicologoId ? (
        <div className="rounded-xl border bg-white p-12 text-center text-slate-400">
          Selecciona un psicólogo para ver y editar sus horas designadas
        </div>
      ) : (
        <div className="rounded-xl border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-36">Mes</TableHead>
                <TableHead>Horas Mañana</TableHead>
                <TableHead>Horas Tarde</TableHead>
                <TableHead className="w-24 text-right">Guardar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MESES.map((mes, idx) => (
                <TableRow key={mes}>
                  <TableCell className="font-medium text-slate-700">{mes}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="w-24 h-8 text-sm"
                      value={grid[idx].manana}
                      onChange={e => updateHoras(idx, "manana", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min={0}
                      className="w-24 h-8 text-sm"
                      value={grid[idx].tarde}
                      onChange={e => updateHoras(idx, "tarde", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        onClick={() => saveRow(idx)}
                        disabled={saving === idx}
                      >
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#0f172a] text-white px-8 py-4 flex-shrink-0 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            UMSA / Gabinete Psicologico
          </p>
          <h1 className="text-lg font-extrabold uppercase tracking-tight">
            Configuración
          </h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-8 py-10">
        <div className="w-full max-w-5xl">
          <Tabs defaultValue="psicologos">
            <TabsList className="mb-6 bg-white border">
              <TabsTrigger value="psicologos">Psicólogos</TabsTrigger>
              <TabsTrigger value="carreras">Carreras</TabsTrigger>
              <TabsTrigger value="horas">Horas Designadas</TabsTrigger>
            </TabsList>

            <TabsContent value="psicologos">
              <PsicologosTab />
            </TabsContent>
            <TabsContent value="carreras">
              <CarrerasTab />
            </TabsContent>
            <TabsContent value="horas">
              <HorasTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

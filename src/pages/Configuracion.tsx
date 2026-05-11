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
import { adminService, type PsicologoInput, type UsuarioRow, type UsuarioInput } from "@/services/adminService"
import type { Psicologo, Carrera } from "@/types/types"

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

// ─── Usuarios Tab ────────────────────────────────────────────────────────────
type EditForm = { username: string; password: string; psicologoId: number | null }

function UsuariosTab() {
  const [usuarios, setUsuarios] = useState<UsuarioRow[]>([])
  const [psicologos, setPsicologos] = useState<Psicologo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Dialog crear
  const emptyCreate: UsuarioInput = { username: '', password: '', rol: 'PSICOLOGO', psicologoId: null }
  const [createOpen, setCreateOpen] = useState(false)
  const [createForm, setCreateForm] = useState<UsuarioInput>(emptyCreate)

  // Dialog editar
  const [editOpen, setEditOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<UsuarioRow | null>(null)
  const [editForm, setEditForm] = useState<EditForm>({ username: '', password: '', psicologoId: null })

  const cargar = useCallback(async () => {
    setLoading(true)
    try {
      const [u, p] = await Promise.all([adminService.usuarios.getAll(), adminService.psicologos.getAll()])
      setUsuarios(u)
      setPsicologos(p)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  function openEdit(u: UsuarioRow) {
    setEditTarget(u)
    setEditForm({ username: u.username, password: '', psicologoId: u.psicologoId ?? null })
    setError(null)
    setEditOpen(true)
  }

  const handleCrear = async () => {
    setError(null)
    if (!createForm.username.trim() || !createForm.password.trim()) return
    setSaving(true)
    try {
      await adminService.usuarios.create(createForm)
      setCreateOpen(false)
      setCreateForm(emptyCreate)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al crear el usuario')
    } finally {
      setSaving(false)
    }
  }

  const handleEditar = async () => {
    if (!editTarget) return
    setError(null)
    if (!editForm.username.trim()) { setError('El nombre de usuario es obligatorio'); return }
    setSaving(true)
    try {
      const payload: { username: string; psicologoId: number | null; password?: string } = {
        username: editForm.username.trim(),
        psicologoId: editForm.psicologoId,
      }
      if (editForm.password.trim()) payload.password = editForm.password
      await adminService.usuarios.update(editTarget.id, payload)
      setEditOpen(false)
      await cargar()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al actualizar el usuario')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActivo = async (u: UsuarioRow) => {
    try {
      await adminService.usuarios.toggleActivo(u.id, !u.activo)
      await cargar()
    } catch {
      alert('Error al actualizar usuario')
    }
  }

  const handleEliminar = async () => {
    if (!deleteId) return
    try {
      await adminService.usuarios.delete(deleteId)
      setDeleteId(null)
      await cargar()
    } catch {
      alert('Error al eliminar usuario')
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold">Usuarios del Sistema</h2>
        <Button size="sm" onClick={() => { setCreateForm(emptyCreate); setError(null); setCreateOpen(true) }}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo usuario
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Cargando...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Psicólogo vinculado</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map(u => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.username}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.rol === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {u.rol}
                  </span>
                </TableCell>
                <TableCell>{u.psicologoNombre ?? '—'}</TableCell>
                <TableCell>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900" onClick={() => openEdit(u)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleToggleActivo(u)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-600" onClick={() => setDeleteId(u.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Dialog crear usuario */}
      <Dialog open={createOpen} onOpenChange={o => { setCreateOpen(o); setError(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Nuevo usuario</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre de usuario *</Label>
              <Input value={createForm.username} onChange={e => setCreateForm(f => ({ ...f, username: e.target.value }))} placeholder="ej. psicologo1" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Contraseña * <span className="text-slate-400 font-normal">(mín. 6 caracteres)</span></Label>
              <Input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Rol</Label>
              <Select value={createForm.rol} onValueChange={v => setCreateForm(f => ({ ...f, rol: v as 'ADMIN' | 'PSICOLOGO', psicologoId: null }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PSICOLOGO">Psicólogo</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {createForm.rol === 'PSICOLOGO' && (
              <div className="flex flex-col gap-1.5">
                <Label>Psicólogo vinculado</Label>
                <Select value={createForm.psicologoId?.toString() ?? ''} onValueChange={v => setCreateForm(f => ({ ...f, psicologoId: v ? Number(v) : null }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar psicólogo" /></SelectTrigger>
                  <SelectContent>
                    {psicologos.map(p => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.person?.primerNombre} {p.person?.apellidoPaterno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button onClick={handleCrear} disabled={saving || !createForm.username.trim() || !createForm.password.trim()}>
              <Save className="h-4 w-4 mr-1" /> {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog editar usuario */}
      <Dialog open={editOpen} onOpenChange={o => { setEditOpen(o); setError(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar usuario — {editTarget?.username}</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Nombre de usuario *</Label>
              <Input value={editForm.username} onChange={e => setEditForm(f => ({ ...f, username: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Nueva contraseña <span className="text-slate-400 font-normal">(dejar vacío para no cambiar)</span></Label>
              <Input type="password" value={editForm.password} onChange={e => setEditForm(f => ({ ...f, password: e.target.value }))} placeholder="mín. 6 caracteres" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Psicólogo vinculado</Label>
              <Select value={editForm.psicologoId?.toString() ?? 'ninguno'} onValueChange={v => setEditForm(f => ({ ...f, psicologoId: v === 'ninguno' ? null : Number(v) }))}>
                <SelectTrigger><SelectValue placeholder="Sin vincular" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ninguno">Sin vincular</SelectItem>
                  {psicologos.map(p => (
                    <SelectItem key={p.id} value={p.id.toString()}>
                      {p.person?.primerNombre} {p.person?.apellidoPaterno}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEditar} disabled={saving || !editForm.username.trim()}>
              <Save className="h-4 w-4 mr-1" /> {saving ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm delete */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEliminar} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
            UCB Tarija / Gabinete Psicologico
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
              <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
            </TabsList>

            <TabsContent value="psicologos">
              <PsicologosTab />
            </TabsContent>
            <TabsContent value="carreras">
              <CarrerasTab />
            </TabsContent>
            <TabsContent value="usuarios">
              <UsuariosTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

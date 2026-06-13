/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { FileDown, Loader2, CalendarRange } from "lucide-react"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import { saveAs } from "file-saver"
import api from "@/services/api"

// ── Mapas ─────────────────────────────────────────────────────────────────────
const GENERO_MAP: Record<number, string> = { 1: "Masculino", 2: "Femenino", 3: "Otro" }
const ESTADO_CIVIL_MAP: Record<number, string> = {
  1: "Soltero/a", 2: "Casado/a", 3: "Divorciado/a", 4: "Viudo/a", 5: "Concubinato",
}

function parse(val: unknown): Record<string, any> {
  if (!val) return {}
  if (typeof val === "string") { try { return JSON.parse(val) } catch { return {} } }
  return val as Record<string, any>
}

function limpiar(val: unknown): string {
  if (val == null) return ""
  const s = String(val).trim()
  if (s.startsWith('"') && s.endsWith('"')) return s.slice(1, -1)
  return s
}

function formatFecha(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es-ES")
}

export function BotonReporteIndividualExcel({ pacienteId }: { pacienteId: number }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generando, setGenerando] = useState(false)

  const hoy = new Date()
  const primerDiaAnio = `${hoy.getFullYear()}-01-01`
  const hoyStr = hoy.toISOString().split("T")[0]

  const [fechaDesde, setFechaDesde] = useState(primerDiaAnio)
  const [fechaHasta, setFechaHasta] = useState(hoyStr)

  const generarDocumento = async () => {
    try {
      setGenerando(true)

      // Una sola llamada al endpoint unificado
      const res = await api.get(`/pacientes/universitario/${pacienteId}/reporte`, {
        params: { desde: fechaDesde, hasta: fechaHasta },
      })
      const { pacienteUniversitario: pu, entrevista: primeraEntrevista, sesiones } = res.data.data as any

      // Datos personales
      const pac = pu.paciente ?? {}
      const person = pac.person ?? {}
      const nombreCompleto = [
        person.primerNombre,
        person.segundoNombre,
        person.apellidoPaterno,
        person.apellidoMaterno,
      ].filter(Boolean).join(" ")

      const psicologo = pu.psicologo
      const psicologoNombre = psicologo
        ? `${psicologo.person?.primerNombre ?? ""} ${psicologo.person?.apellidoPaterno ?? ""}`.trim()
        : ""

      // Obtener carrera desde la entrevista del paciente (endpoint de entrevistas globales)
      // ya que el endpoint de reporte no incluye carrera directamente
      let carreraStr = ""
      try {
        const entRes = await api.get("/dashboard/entrevistas")
        const filas: any[] = entRes.data.data ?? []
        const fila = filas.find((e: any) => e.pacienteUniversitarioId === pacienteId)
        carreraStr = fila?.carrera ?? ""
      } catch { /* si falla, se deja vacío */ }

      // Datos de la entrevista
      const familia     = parse(primeraEntrevista?.historiaFamiliar)
      const universidad = parse(primeraEntrevista?.relatoUniversidad)
      const habitos     = parse(primeraEntrevista?.habitos)
      const acuerdos    = parse(primeraEntrevista?.acuerdos)
      const sintomasRaw = parse(primeraEntrevista?.sintomas)

      const padre    = (familia.padre    ?? {}) as Record<string, any>
      const madre    = (familia.madre    ?? {}) as Record<string, any>
      const hermanos = (familia.hermanos ?? {}) as Record<string, any>
      const alcohol  = (habitos.alcohol  ?? {}) as Record<string, any>
      const tabaco   = (habitos.tabaco   ?? {}) as Record<string, any>
      const drogas   = (habitos.drogas   ?? {}) as Record<string, any>

      const estres    = (sintomasRaw.estres    as number[]) ?? Array(12).fill(0)
      const ansiedad  = (sintomasRaw.ansiedad  as number[]) ?? Array(12).fill(0)
      const depresion = (sintomasRaw.depresion as number[]) ?? Array(12).fill(0)

      const sintomasFlat: Record<string, string | number> = {}
      for (let i = 0; i < 12; i++) {
        sintomasFlat[`estres_${i + 1}`]    = estres[i]    ?? ""
        sintomasFlat[`ansiedad_${i + 1}`]  = ansiedad[i]  ?? ""
        sintomasFlat[`depresion_${i + 1}`] = depresion[i] ?? ""
      }

      // Historial clínico desde las sesiones ya filtradas por rango
      const sesionesConHistorial = (sesiones as any[])
        .filter((s) => s.historialClinico)
        .sort((a, b) => (a.historialClinico?.nroSesion ?? 0) - (b.historialClinico?.nroSesion ?? 0))
        .map((s) => {
          const h = s.historialClinico
          const tipologias = Array.isArray(h.tipologia)
            ? h.tipologia.join(", ")
            : (() => { try { return JSON.parse(h.tipologia ?? "[]").join(", ") } catch { return h.tipologia ?? "" } })()
          return {
            nro_sesion:   h.nroSesion ?? "",
            fecha_sesion: formatFecha(s.fecha),
            duracion:     s.duracionMinutos ? `${s.duracionMinutos} min` : "",
            tipologia:    tipologias,
            gravedad:     h.gravedad ?? "",
            historia:     limpiar(h.historia),
          }
        })

      // Cargar plantilla
      const response = await fetch("/plantilla_entrevista.docx")
      if (!response.ok) throw new Error("No se pudo cargar la plantilla")
      const arrayBuffer = await response.arrayBuffer()

      const zip = new PizZip(arrayBuffer)
      const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

      const fechaGeneracion = new Date().toLocaleDateString("es-ES", {
        day: "2-digit", month: "2-digit", year: "numeric",
      })

      doc.render({
        fecha_generacion: fechaGeneracion,
        nombre_completo:  nombreCompleto,
        edad:             pac.edad ?? "",
        genero:           pac.genero != null ? GENERO_MAP[pac.genero] : "",
        domicilio:        pac.domicilio ?? "",
        fecha_nacimiento: formatFecha(pac.fechaNacimiento),
        estado_civil:     pac.estadoCivil != null ? ESTADO_CIVIL_MAP[pac.estadoCivil] : "",
        celular:          person.celular ?? "",
        semestre:         pu.semestre ?? "",
        carrera:          carreraStr,
        remitido_por:     pu.derivadoPor ?? "",
        psicologo_nombre: psicologoNombre,

        motivo_consulta: limpiar(primeraEntrevista?.antecedentes),

        con_quien_vive:      limpiar(familia.conQuienVive),
        persona_referencia:  limpiar(familia.personaReferencia),
        celular_referencia:  limpiar(familia.celularReferencia),
        padre_nombre:        limpiar(padre.nombre),
        padre_edad:          limpiar(padre.edad),
        padre_ocupacion:     limpiar(padre.ocupacion),
        padre_enfermedad:    limpiar(padre.enfermedad),
        padre_relacion:      limpiar(padre.relacion),
        madre_nombre:        limpiar(madre.nombre),
        madre_edad:          limpiar(madre.edad),
        madre_ocupacion:     limpiar(madre.ocupacion),
        madre_enfermedad:    limpiar(madre.enfermedad),
        madre_relacion:      limpiar(madre.relacion),
        numero_hermanos:     limpiar(hermanos.numero),
        relacion_hermanos:   limpiar(hermanos.relato),

        ...sintomasFlat,
        total_estres:    primeraEntrevista?.totalScoreEstres    ?? "",
        total_ansiedad:  primeraEntrevista?.totalScoreAnsiedad  ?? "",
        total_depresion: primeraEntrevista?.totalScoreDepresion ?? "",

        relato_universidad: limpiar(universidad.relatoGeneral),
        cambio_carreras:    limpiar(universidad.cambioCarreras),
        motivos_cambio:     limpiar(universidad.motivosCambio),

        consumo_alcohol:  alcohol.frecuencia ?? "",
        consumo_tabaco:   tabaco.frecuencia ?? "",
        consumo_drogas:   drogas.frecuencia ?? "",
        relato_acusacion: limpiar(habitos.relatoAcusacionDetencion),

        acuerdos:              limpiar(acuerdos.acuerdosEstablecidos),
        proxima_sesion_fecha:  limpiar(acuerdos.proximaSesionFecha),
        proxima_sesion_hora:   limpiar(acuerdos.proximaSesionHora),

        sesiones: sesionesConHistorial,
      })

      const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      saveAs(blob, `Entrevista_${nombreCompleto.replace(/ /g, "_")}.docx`)
      setDialogOpen(false)

    } catch (error) {
      console.error("Error al generar el informe:", error)
      alert("Hubo un error al generar el informe.")
    } finally {
      setGenerando(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Descargar Historial Clínico
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-blue-600" />
              Seleccionar Periodo
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <Label>Fecha desde</Label>
              <Input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Fecha hasta</Label>
              <Input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                min={fechaDesde}
              />
            </div>
            <p className="text-xs text-slate-500">
              Solo se incluirán las sesiones dentro del periodo seleccionado.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={generando}>
              Cancelar
            </Button>
            <Button
              onClick={generarDocumento}
              disabled={generando || !fechaDesde || !fechaHasta}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {generando ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...</>
              ) : (
                <><FileDown className="h-4 w-4 mr-2" /> Generar</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

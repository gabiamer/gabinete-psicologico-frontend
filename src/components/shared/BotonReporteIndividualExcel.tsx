import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import { saveAs } from "file-saver"
import { pacienteService } from "@/services/pacienteService"
import { sesionService } from "@/services/sesionService"
import { dashboardService } from "@/services/dashboardService"

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

// Limpia comillas escapadas que vienen del backend (e.g. "\"texto\"" → "texto")
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
  const [generando, setGenerando] = useState(false)

  const generarDocumento = async () => {
    try {
      setGenerando(true)

      // 1. Obtener datos del paciente, lista de sesiones y entrevistas del dashboard
      const [pacienteRaw, sesionesRaw, todasEntrevistas] = await Promise.all([
        pacienteService.obtenerPorId(pacienteId),
        sesionService.obtenerPorPaciente(pacienteId),
        dashboardService.obtenerEntrevistas(),
      ])

      const pac = pacienteRaw as any
      const sesiones: any[] = Array.isArray(sesionesRaw) ? sesionesRaw : []

      const entrevistaRow = todasEntrevistas.find((e) => e.pacienteUniversitarioId === pacienteId)
      const carreraStr = entrevistaRow?.carrera ?? ""

      // 2. Datos personales
      const person = pac.paciente?.person ?? {}
      const nombreCompleto = [
        person.primerNombre,
        person.segundoNombre,
        person.apellidoPaterno,
        person.apellidoMaterno,
      ].filter(Boolean).join(" ")

      const psicologo = pac.psicologo
      const psicologoNombre = psicologo
        ? `${psicologo.person?.primerNombre ?? ""} ${psicologo.person?.apellidoPaterno ?? ""}`.trim()
        : ""

      // 3. Fetchear todas las sesiones individualmente (la lista no incluye entrevista ni historialClinico)
      const sesionesCompletas: any[] = await Promise.all(
        sesiones.map((s: any) => sesionService.obtenerPorId(s.id))
      )

      // Ordenar por fecha ascendente — la primera tiene la entrevista
      sesionesCompletas.sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      )

      const primeraEntrevista: any =
        sesionesCompletas.find((s) => s.entrevista)?.entrevista ?? null

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

      // 4. Tags individuales para la tabla de sintomas (12 celdas por columna)
      const sintomasFlat: Record<string, string | number> = {}
      for (let i = 0; i < 12; i++) {
        sintomasFlat[`estres_${i + 1}`]    = estres[i]    ?? ""
        sintomasFlat[`ansiedad_${i + 1}`]  = ansiedad[i]  ?? ""
        sintomasFlat[`depresion_${i + 1}`] = depresion[i] ?? ""
      }

      // 5. Historial clínico (todas las sesiones con historialClinico)
      const sesionesConHistorial = sesionesCompletas
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

      // 6. Cargar la plantilla
      const response = await fetch("/plantilla_entrevista.docx")
      if (!response.ok) throw new Error("No se pudo cargar la plantilla")
      const arrayBuffer = await response.arrayBuffer()

      // 7. Inicializar docxtemplater
      const zip = new PizZip(arrayBuffer)
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      })

      // 8. Inyectar todos los datos
      doc.render({
        // Datos personales
        nombre_completo:  nombreCompleto,
        edad:             pac.paciente?.edad ?? "",
        genero:           pac.paciente?.genero != null ? GENERO_MAP[pac.paciente.genero] : "",
        domicilio:        pac.paciente?.domicilio ?? "",
        fecha_nacimiento: formatFecha(pac.paciente?.fechaNacimiento),
        estado_civil:     pac.paciente?.estadoCivil != null ? ESTADO_CIVIL_MAP[pac.paciente.estadoCivil] : "",
        celular:          person.celular ?? "",
        semestre:         pac.semestre ?? "",
        carrera:          carreraStr,
        remitido_por:     pac.derivadoPor ?? "",
        psicologo_nombre: psicologoNombre,

        // Motivo de consulta
        motivo_consulta: limpiar(primeraEntrevista?.antecedentes),

        // Historia familiar
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

        // Sintomatologías (etiquetas individuales por celda)
        ...sintomasFlat,
        total_estres:    primeraEntrevista?.totalScoreEstres    ?? "",
        total_ansiedad:  primeraEntrevista?.totalScoreAnsiedad  ?? "",
        total_depresion: primeraEntrevista?.totalScoreDepresion ?? "",

        // Relato universidad
        relato_universidad: limpiar(universidad.relatoGeneral),
        cambio_carreras:    limpiar(universidad.cambioCarreras),
        motivos_cambio:     limpiar(universidad.motivosCambio),

        // Hábitos
        consumo_alcohol:  alcohol.frecuencia ?? "",
        consumo_tabaco:   tabaco.frecuencia ?? "",
        consumo_drogas:   drogas.frecuencia ?? "",
        relato_acusacion: limpiar(habitos.relatoAcusacionDetencion),

        // Acuerdos
        acuerdos:              limpiar(acuerdos.acuerdosEstablecidos),
        proxima_sesion_fecha:  limpiar(acuerdos.proximaSesionFecha),
        proxima_sesion_hora:   limpiar(acuerdos.proximaSesionHora),

        // Historial clínico (loop)
        sesiones: sesionesConHistorial,
      })

      // 9. Descargar
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      })

      saveAs(blob, `Entrevista_${nombreCompleto.replace(/ /g, "_")}.docx`)

    } catch (error) {
      console.error("Error al generar el informe:", error)
      alert("Hubo un error al generar el informe.")
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Button
      onClick={generarDocumento}
      disabled={generando}
      className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
    >
      {generando
        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generando...</>
        : <><FileDown className="h-4 w-4 mr-2" /> Descargar Historial Clínico</>
      }
    </Button>
  )
}
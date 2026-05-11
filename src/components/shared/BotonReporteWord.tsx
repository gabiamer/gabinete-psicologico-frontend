import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { FileDown, Loader2, CalendarRange } from "lucide-react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import ImageModule from "docxtemplater-image-module-free";
import { saveAs } from "file-saver";
import { dashboardService } from "@/services/dashboardService";
import type { EntrevistaRow } from "@/services/dashboardService";
import { actividadService } from "@/services/actividadService";
import { useAuth } from "@/contexts/AuthContext";

// Devuelve "1 de enero de 2026" a partir de "2026-01-01"
function formatFechaLarga(iso: string): string {
  const fecha = new Date(iso);
  if (isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

// Devuelve "01 mayo 2025" a partir de "2025-05-01"
function formatFechaPeriodo(iso: string): string {
  const fecha = new Date(iso + "T00:00:00");
  if (isNaN(fecha.getTime())) return iso;
  const d = String(fecha.getDate()).padStart(2, "0");
  const m = fecha.toLocaleDateString("es-ES", { month: "long" });
  const y = fecha.getFullYear();
  return `${d} ${m} ${y}`;
}

function formatFechaHora(iso: string): string {
  const fecha = new Date(iso);
  if (isNaN(fecha.getTime())) return iso;
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
    + " " + fecha.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function BotonReporteWord() {
  const { user } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generando, setGenerando] = useState(false);

  // Periodo por defecto: primer y último día del mes actual
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
    .toISOString().split("T")[0];
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    .toISOString().split("T")[0];

  const [fechaDesde, setFechaDesde] = useState(primerDiaMes);
  const [fechaHasta, setFechaHasta] = useState(ultimoDiaMes);

  const generarDocumento = async () => {
    try {
      setGenerando(true);

      // 1. Obtener datos: entrevistas ya filtradas por período en el backend
      const [entrevistas, stats, actividadesRango] = await Promise.all([
        dashboardService.obtenerEntrevistasPeriodo(fechaDesde, fechaHasta),
        dashboardService.obtenerEstadisticas(),
        actividadService.getByRango(fechaDesde, fechaHasta),
      ]);

      // 3. Recalcular stats de situacion sobre los pacientes filtrados
      const situacionCount: Record<string, number> = {
        "Acompañamiento psicológico": 0,
        "Buen proceso": 0,
        "Proceso terminado": 0,
        "Orientación vocacional": 0,
        "Derivado a consultorio externo": 0,
      };
      let totalSesionesPeriodo = 0;
      for (const e of entrevistas) {
        const sit = e.situacionCaso || "Acompañamiento psicológico";
        if (sit in situacionCount) situacionCount[sit]++;
        totalSesionesPeriodo += e.numeroSesiones;
      }

      // 4. Cargar la plantilla Word
      const response = await fetch("/plantilla-reporte.docx");
      if (!response.ok) throw new Error("No se pudo cargar la plantilla");
      const arrayBuffer = await response.arrayBuffer();

      // 5. Inicializar docxtemplater con módulo de imágenes
      const imageStore: Record<string, ArrayBuffer> = {};

      const imageOpts = {
        centered: false,
        fileType: "docx" as const,
        getImage(tagValue: string) {
          return imageStore[tagValue];
        },
        getSize() {
          return [200, 150] as [number, number];
        },
      };

      const imageModule = new ImageModule(imageOpts);

      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule],
      });

      // 6. Mapear pacientes filtrados
      const pacientesMapeados = entrevistas.map((entrevista, index) => ({
        nro: index + 1,
        nombre: entrevista.estudianteNombre,
        principalProblematica: entrevista.principalProblematica || "",
        derivadoPor: entrevista.derivadoPor || "",
        carrera: entrevista.carrera,
        situacionCaso: entrevista.situacionCaso || "",
        sesiones: entrevista.numeroSesiones,
        gravedad:
          entrevista.gravedad !== "Sin evaluar"
            ? entrevista.gravedad.toUpperCase()
            : "",
        descripcion: entrevista.descripcion || "",
      }));

      // 6b. Descargar evidencias de todas las actividades y mapear
      const allEvidenciaIds: { actIdx: number; evId: number }[] = [];
      for (let i = 0; i < actividadesRango.length; i++) {
        const a = actividadesRango[i];
        if (a.evidencias) {
          for (const ev of a.evidencias) {
            allEvidenciaIds.push({ actIdx: i, evId: ev.id });
          }
        }
      }

      // Descargar todas las imágenes en paralelo
      const evidenciasBytes = await Promise.all(
        allEvidenciaIds.map(({ evId }) => actividadService.getEvidenciaBytes(evId))
      );

      // Guardar en imageStore con clave única
      for (let i = 0; i < allEvidenciaIds.length; i++) {
        const key = `ev_${allEvidenciaIds[i].evId}`;
        imageStore[key] = evidenciasBytes[i];
      }

      // Agrupar evidencias por actividad
      const evidenciasPorActividad: Record<number, { img: string }[]> = {};
      for (const { actIdx, evId } of allEvidenciaIds) {
        if (!evidenciasPorActividad[actIdx]) evidenciasPorActividad[actIdx] = [];
        evidenciasPorActividad[actIdx].push({ img: `ev_${evId}` });
      }

      const actividadesMapeadas = actividadesRango.map((a, index) => ({
        nro_act: index + 1,
        titulo_act: a.titulo,
        fecha_inicio_act: formatFechaHora(a.fechaInicio),
        fecha_fin_act: formatFechaHora(a.fechaFin),
        objetivo_act: a.objetivo,
        poblacion_act: a.poblacion,
        asistentes_act: a.numAsistentes,
        resumen_act: a.resumen,
        resultados_act: a.resultados,
        psicologo_act: `${a.psicologo.person.primerNombre} ${a.psicologo.person.apellidoPaterno}`,
        evidencias_img: evidenciasPorActividad[index] ?? [],
      }));

      // 6c. Extraer problemáticas frecuentes con IA
      const problematicasTexto = entrevistas
        .map(e => e.principalProblematica)
        .filter((p): p is string => !!p && p.trim().length > 0);

      let problematicasFrecuentes: { problematica: string }[] = [];
      if (problematicasTexto.length > 0) {
        const lista = await dashboardService.extraerProblematicasFrecuentes(problematicasTexto);
        problematicasFrecuentes = lista.map(p => ({ problematica: p }));
      }

      // 7. Preparar etiquetas de fecha en español
      const mesAnio = `${formatFechaPeriodo(fechaDesde)} - ${formatFechaPeriodo(fechaHasta)}`;
      const rangoFechas = `del ${formatFechaLarga(fechaDesde)} al ${formatFechaLarga(fechaHasta)}`;

      // 8. Inyectar datos al Word
      doc.render({
        mes_anio: mesAnio,
        rango_fechas: rangoFechas,
        total_universitarios: entrevistas.length,
        total_externos: stats.totalPacientesExternos,
        total_sesiones: totalSesionesPeriodo,
        total_acompanamiento: situacionCount["Acompañamiento psicológico"],
        total_buen_proceso: situacionCount["Buen proceso"],
        total_proceso_terminado: situacionCount["Proceso terminado"],
        total_orientacion_vocacional: situacionCount["Orientación vocacional"],
        total_derivado_externo: situacionCount["Derivado a consultorio externo"],
        pacientes: pacientesMapeados,
        actividades: actividadesMapeadas,
        total_actividades: actividadesMapeadas.length,
        problematicas_frecuentes: problematicasFrecuentes,
        nombre_psicologo: user?.psicologoNombre ?? "",
      });

      // 9. Descargar
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const nombreArchivo = `Reporte_${fechaDesde}_${fechaHasta}.docx`;
      saveAs(blob, nombreArchivo);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error al generar el documento:", error);
      alert("Hubo un error al generar el reporte.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setDialogOpen(true)}
        variant="outline"
        className="bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
      >
        <FileDown className="h-4 w-4 mr-2" />
        Descargar Informe (Word)
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
              Se incluirán los pacientes cuya última sesión esté dentro del periodo seleccionado.
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
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              {generando ? "Generando..." : "Generar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

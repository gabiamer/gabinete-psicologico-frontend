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
import { saveAs } from "file-saver";
import { dashboardService } from "@/services/dashboardService";
import type { EntrevistaRow } from "@/services/dashboardService";

// Devuelve "1 de enero de 2026" a partir de "2026-01-01"
function formatFechaLarga(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const fecha = new Date(y, m - 1, d);
  return fecha.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export function BotonReporteWord() {
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

      // 1. Obtener todos los datos
      const [todasEntrevistas, stats] = await Promise.all([
        dashboardService.obtenerEntrevistas(),
        dashboardService.obtenerEstadisticas(),
      ]);

      // 2. Filtrar entrevistas por rango de fecha (ultima sesion o sin sesion en el rango)
      const desde = new Date(fechaDesde + "T00:00:00");
      const hasta = new Date(fechaHasta + "T23:59:59");

      const entrevistas = todasEntrevistas.filter((e: EntrevistaRow) => {
        if (!e.ultimaSesionFecha) return false;
        const fecha = new Date(e.ultimaSesionFecha);
        return fecha >= desde && fecha <= hasta;
      });

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

      // 5. Inicializar docxtemplater
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
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

      // 7. Preparar etiquetas de fecha en español
      const mesAnio = new Date(fechaDesde + "T00:00:00").toLocaleString("es-ES", {
        month: "long",
        year: "numeric",
      });
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

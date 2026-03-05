import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import { dashboardService } from "@/services/dashboardService";

export function BotonReporteWord() {
  const [generando, setGenerando] = useState(false);

  const generarDocumento = async () => {
    try {
      setGenerando(true);

      // 1. Obtener datos reales de tu backend usando tus servicios existentes
      const [entrevistas, stats] = await Promise.all([
        dashboardService.obtenerEntrevistas(),
        dashboardService.obtenerEstadisticas()
      ]);

      // 2. Cargar la plantilla Word desde la carpeta public
      const response = await fetch("/plantilla-reporte.docx");
      if (!response.ok) throw new Error("No se pudo cargar la plantilla");
      const arrayBuffer = await response.arrayBuffer();

      // 3. Inicializar docxtemplater
      const zip = new PizZip(arrayBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      // 4. Mapear los datos de 'EntrevistaRow' al formato que espera el Word
      const pacientesMapeados = entrevistas.map((entrevista, index) => ({
        nro: index + 1,
        // Ocultamos el nombre real según el estándar clínico, o usamos el de tu DB
        nombre: entrevista.estudianteNombre, 
        problematica: "Individual", // Por defecto basado en tu reporte original
        derivadoPor: entrevista.derivadoPor || "",
        carrera: entrevista.carrera,
        situacion: "Acompañamiento psicológico", 
        sesiones: entrevista.numeroSesiones,
        gravedad: entrevista.gravedad !== "Sin evaluar" ? entrevista.gravedad.toUpperCase() : "",
        descripcion: "" // Campo vacío para que el psicólogo lo llene a mano si lo desea
      }));

      // 5. Configurar la fecha actual en español
      const fechaActual = new Date();
      const mesActual = fechaActual.toLocaleString('es-ES', { month: 'long' });
      const anioActual = fechaActual.getFullYear();
      
      // 6. Inyectar todos los datos al Word
      doc.render({
        mes_anio: `${mesActual} ${anioActual}`,
        total_universitarios: stats.totalPacientesUniversitarios,
        total_externos: stats.totalPacientesExternos,
        total_sesiones: stats.totalSesiones,
        rango_fechas: `del 01 al 31 de ${mesActual} ${anioActual}`, // Puedes hacer esto dinámico luego
        pacientes: pacientesMapeados
      });

      // 7. Generar y descargar el archivo
      const blob = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      saveAs(blob, `Reporte_UCB_Tarija_${mesActual}_${anioActual}.docx`);

    } catch (error) {
      console.error("Error al generar el documento:", error);
      alert("Hubo un error al generar el reporte.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Button 
      onClick={generarDocumento} 
      disabled={generando}
      variant="outline"
      className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
    >
      {generando ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {generando ? "Generando..." : "Descargar Informe (Word)"}
    </Button>
  );
}
// src/components/shared/BotonReporteIndividualExcel.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Loader2 } from "lucide-react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { pacienteService } from "@/services/pacienteService";
import { sesionService } from "@/services/sesionService";

export function BotonReporteIndividualExcel({ pacienteId }: { pacienteId: number }) {
  const [generando, setGenerando] = useState(false);

  const generarExcel = async () => {
    try {
      setGenerando(true);

      // 1. Obtener datos reales del paciente y sus sesiones
      const paciente = await pacienteService.obtenerPorId(pacienteId);
      const sesiones = await sesionService.obtenerPorPaciente(pacienteId);
      const antecedentes = paciente.antecedentes || {} as any;

      // 2. Cargar tu plantilla desde public
      const response = await fetch("/plantilla-entrevista.xlsx");
      if (!response.ok) throw new Error("No se pudo cargar la plantilla. Verifica que esté en la carpeta public.");
      const buffer = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const worksheet = workbook.getWorksheet(1);
      
      if (!worksheet) throw new Error("No se encontró la hoja de cálculo.");

      // --- DATOS PERSONALES ---
      const nombreCompleto = `${paciente.person?.primerNombre || ''} ${paciente.person?.apellidoPaterno || ''} ${paciente.person?.apellidoMaterno || ''}`.trim();
      worksheet.getCell("G8").value = nombreCompleto;
      worksheet.getCell("C9").value = paciente.edad;
      
      const generos = { 1: 'Masculino', 2: 'Femenino', 3: 'Otro' };
      worksheet.getCell("J9").value = generos[paciente.genero as keyof typeof generos] || '';
      
      worksheet.getCell("R9").value = paciente.domicilio || '';
      if(paciente.fechaNacimiento) {
        worksheet.getCell("J10").value = new Date(paciente.fechaNacimiento).toLocaleDateString('es-ES');
      }
      
      const estadosCiviles = { 1: 'Soltero', 2: 'Casado', 3: 'Divorciado', 4: 'Viudo', 5: 'Concubinato' };
      worksheet.getCell("E11").value = estadosCiviles[paciente.estadoCivil as keyof typeof estadosCiviles] || '';
      
      worksheet.getCell("R11").value = paciente.celular || '';
      worksheet.getCell("H12").value = paciente.semestre || '';
      // Asumiendo que carrera viene poblada desde el backend
      worksheet.getCell("U12").value = paciente.carrera?.carrera || ''; 
      worksheet.getCell("F13").value = paciente.derivadoPor || '';
      
      if (paciente.psicologo) {
        worksheet.getCell("K14").value = `${paciente.psicologo.person.primerNombre} ${paciente.psicologo.person.apellidoPaterno}`;
      }

      // --- MOTIVO DE CONSULTA ---
      worksheet.getCell("A16").value = antecedentes.motivoConsulta || antecedentes.historiaClinica || '';
      worksheet.getCell("A16").alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

      // --- HISTORIA FAMILIAR ---
      worksheet.getCell("F18").value = antecedentes.conQuienVive || '';
      worksheet.getCell("AB18").value = paciente.celular || ''; // Celular paciente
      worksheet.getCell("H19").value = antecedentes.personaReferencia || '';
      worksheet.getCell("AB19").value = antecedentes.celularReferencia || '';

      // Padre
      worksheet.getCell("G21").value = antecedentes.nombrePadre || '';
      worksheet.getCell("I22").value = antecedentes.ocupacionPadre || '';
      worksheet.getCell("J23").value = antecedentes.enfermedadPadre || '';
      worksheet.getCell("J24").value = antecedentes.relacionPadre || '';

      // Madre
      worksheet.getCell("H25").value = antecedentes.nombreMadre || '';
      worksheet.getCell("I26").value = antecedentes.ocupacionMadre || '';
      worksheet.getCell("J27").value = antecedentes.enfermedadMadre || '';
      worksheet.getCell("J28").value = antecedentes.relacionMadre || '';

      // Hermanos
      worksheet.getCell("H30").value = antecedentes.numeroHermanos || '';
      worksheet.getCell("W30").value = antecedentes.relatoHermanos || '';
      worksheet.getCell("W30").alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

      // --- UNIVERSIDAD Y HÁBITOS ---
      worksheet.getCell("A48").value = antecedentes.relatoUniversidad || '';
      worksheet.getCell("A48").alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

      worksheet.getCell("H50").value = antecedentes.consumoAlcohol || '';
      worksheet.getCell("H51").value = antecedentes.consumoTabaco || '';
      worksheet.getCell("H52").value = antecedentes.consumoDrogas || '';
      worksheet.getCell("Q51").value = antecedentes.relatoAcusacionDetencion || '';
      worksheet.getCell("Q51").alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };

      // --- ACUERDOS ---
      worksheet.getCell("A71").value = antecedentes.acuerdosEstablecidos || '';
      if (antecedentes.proximaSesionFecha) {
        worksheet.getCell("J72").value = new Date(antecedentes.proximaSesionFecha).toLocaleDateString('es-ES');
      }
      worksheet.getCell("W72").value = antecedentes.proximaSesionHora || '';

      // --- HISTORIAL CLÍNICO (BUCLE DINÁMICO) ---
      let filaActual = 74;
      
      if (sesiones && sesiones.length > 0) {
        sesiones.forEach((sesion: any, index: number) => {
          // 1. Cabecera de la sesión
          worksheet.getCell(`E${filaActual}`).value = index + 1; // Número de Sesión
          worksheet.getCell(`E${filaActual}`).font = { bold: true };
          
          worksheet.getCell(`AA${filaActual}`).value = new Date(sesion.fechaCreacion || sesion.fecha).toLocaleDateString('es-ES');
          worksheet.getCell(`AA${filaActual}`).font = { bold: true };

          // 2. Bajamos una fila para escribir la evolución clínica
          filaActual++;
          worksheet.getCell(`A${filaActual}`).value = sesion.evolucion || sesion.observaciones || sesion.descripcion || '';
          worksheet.getCell(`A${filaActual}`).alignment = { wrapText: true, vertical: 'top', horizontal: 'left' };
          
          // 3. Deshacemos merges existentes en el rango y combinamos las celdas
          const mergeRange = `A${filaActual}:AI${filaActual + 2}`;
          // @ts-ignore - unMergeCells no siempre está tipado pero existe en exceljs
          try { worksheet.unMergeCells(mergeRange); } catch (_) { /* no estaba mergeado */ }
          worksheet.mergeCells(mergeRange);
          
          // 4. Preparamos la filaActual para la siguiente iteración
          filaActual += 4; 
        });
      }

      // 3. Generar y descargar el archivo
      const outBuffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([outBuffer], { 
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
      });
      
      saveAs(blob, `Historial_${nombreCompleto.replace(/ /g, '_')}.xlsx`);

    } catch (error) {
      console.error("Error al generar el Excel:", error);
      alert("Hubo un error al generar el historial.");
    } finally {
      setGenerando(false);
    }
  };

  return (
    <Button 
      onClick={generarExcel} 
      disabled={generando}
      className="bg-green-600 text-white hover:bg-green-700 shadow-sm transition-colors"
    >
      {generando ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {generando ? "Generando Excel..." : "Descargar Historial Clínico"}
    </Button>
  );
}
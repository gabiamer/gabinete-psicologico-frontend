import { useState } from "react"
import { FileDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"

interface Props {
  graficaIds: string[]
  nombreArchivo?: string
}

/**
 * Fuerza tema claro en el documento clonado:
 * - Elimina clase "dark" del html
 * - Inyecta color-scheme: light en :root
 * - Pone fondo blanco y texto oscuro en todos los elementos
 * - Elimina box-shadow (evita artefactos)
 */
function forzarTemaClaro(clonedDoc: Document) {
  // Quitar clase dark si existe
  clonedDoc.documentElement.classList.remove("dark")
  clonedDoc.documentElement.style.colorScheme = "light"

  const style = clonedDoc.createElement("style")
  style.textContent = `
    :root {
      color-scheme: light !important;
    }
    * {
      box-shadow: none !important;
      text-decoration: none !important;
    }
    .recharts-surface {
      background: white !important;
    }
  `
  clonedDoc.head.appendChild(style)
}

export function BotonExportarGraficasPDF({ graficaIds, nombreArchivo = "graficas-reporte.pdf" }: Props) {
  const [generando, setGenerando] = useState(false)

  const exportar = async () => {
    setGenerando(true)
    try {
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const margin = 10
      let primera = true

      for (const id of graficaIds) {
        const el = document.getElementById(id)
        if (!el) continue

        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          logging: false,
          onclone: (clonedDoc) => {
            forzarTemaClaro(clonedDoc)
          },
        })

        const imgData = canvas.toDataURL("image/png")
        const imgW = pageW - margin * 2
        const imgH = (canvas.height * imgW) / canvas.width

        if (!primera) pdf.addPage()
        primera = false

        if (imgH <= pageH - margin * 2) {
          pdf.addImage(imgData, "PNG", margin, margin, imgW, imgH)
        } else {
          const scaledH = pageH - margin * 2
          const scaledW = (canvas.width * scaledH) / canvas.height
          const offsetX = margin + (imgW - scaledW) / 2
          pdf.addImage(imgData, "PNG", offsetX, margin, scaledW, scaledH)
        }
      }

      pdf.save(nombreArchivo)
    } catch (err) {
      console.error("Error al exportar PDF:", err)
      alert("Error al generar el PDF.")
    } finally {
      setGenerando(false)
    }
  }

  return (
    <Button
      onClick={exportar}
      disabled={generando}
      variant="outline"
      className="bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
    >
      {generando ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileDown className="h-4 w-4 mr-2" />
      )}
      {generando ? "Generando PDF..." : "Exportar Gráficas (PDF)"}
    </Button>
  )
}

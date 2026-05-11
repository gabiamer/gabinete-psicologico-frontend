import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  pagina: number
  totalPaginas: number
  total: number
  porPagina?: number
  onChange: (p: number) => void
}

export function Paginacion({ pagina, totalPaginas, total, porPagina = 30, onChange }: Props) {
  if (totalPaginas <= 1) return null

  const desde = (pagina - 1) * porPagina + 1
  const hasta = Math.min(pagina * porPagina, total)

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-xs text-slate-500">
        Mostrando <span className="font-semibold">{desde}–{hasta}</span> de <span className="font-semibold">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={pagina === 1}
          onClick={() => onChange(pagina - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPaginas }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPaginas || Math.abs(p - pagina) <= 1)
          .reduce<(number | "...")[]>((acc, p, idx, arr) => {
            if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push("...")
            acc.push(p)
            return acc
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="text-xs text-slate-400 px-1">…</span>
            ) : (
              <Button
                key={p}
                variant={p === pagina ? "default" : "outline"}
                size="icon"
                className="h-7 w-7 text-xs"
                onClick={() => onChange(p as number)}
              >
                {p}
              </Button>
            )
          )}
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          disabled={pagina === totalPaginas}
          onClick={() => onChange(pagina + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

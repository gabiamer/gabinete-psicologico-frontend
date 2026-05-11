import { useState, useMemo } from "react"

export function usePaginacion<T>(items: T[], porPagina = 30) {
  const [pagina, setPagina] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(items.length / porPagina))
  const paginaSegura = Math.min(pagina, totalPaginas)

  const paginados = useMemo(() => {
    const inicio = (paginaSegura - 1) * porPagina
    return items.slice(inicio, inicio + porPagina)
  }, [items, paginaSegura, porPagina])

  // Reset a página 1 cuando cambian los items (filtros, etc.)
  const resetPagina = () => setPagina(1)

  return {
    paginados,
    pagina: paginaSegura,
    setPagina,
    resetPagina,
    totalPaginas,
    total: items.length,
  }
}

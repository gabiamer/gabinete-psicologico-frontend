import { useState } from "react"
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subYears, subMonths } from "date-fns"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { RangoParams } from "@/services/reportesService"

type Preset = "este-mes" | "trimestre" | "este-anio" | "anio-pasado" | "personalizado"

function toISO(d: Date) {
  return format(d, "yyyy-MM-dd")
}

function presetToRango(preset: Preset): RangoParams {
  const hoy = new Date()
  switch (preset) {
    case "este-mes":
      return { desde: toISO(startOfMonth(hoy)), hasta: toISO(endOfMonth(hoy)) }
    case "trimestre": {
      const hace3 = subMonths(startOfMonth(hoy), 2)
      return { desde: toISO(hace3), hasta: toISO(endOfMonth(hoy)) }
    }
    case "este-anio":
      return { desde: toISO(startOfYear(hoy)), hasta: toISO(endOfYear(hoy)) }
    case "anio-pasado": {
      const pasado = subYears(hoy, 1)
      return { desde: toISO(startOfYear(pasado)), hasta: toISO(endOfYear(pasado)) }
    }
    default:
      return { desde: toISO(startOfYear(hoy)), hasta: toISO(endOfYear(hoy)) }
  }
}

interface Props {
  value: RangoParams
  onChange: (r: RangoParams) => void
}

export function SelectorRango({ value, onChange }: Props) {
  const [preset, setPreset] = useState<Preset>("este-anio")

  function handlePreset(p: string) {
    const pr = p as Preset
    setPreset(pr)
    if (pr !== "personalizado") {
      onChange(presetToRango(pr))
    }
  }

  function handleDesde(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, desde: e.target.value })
  }

  function handleHasta(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, hasta: e.target.value })
  }

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <Select value={preset} onValueChange={handlePreset}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="este-mes">Este mes</SelectItem>
          <SelectItem value="trimestre">Último trimestre</SelectItem>
          <SelectItem value="este-anio">Este año</SelectItem>
          <SelectItem value="anio-pasado">Año pasado</SelectItem>
          <SelectItem value="personalizado">Personalizado</SelectItem>
        </SelectContent>
      </Select>

      {preset === "personalizado" && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Label className="text-xs text-slate-500 whitespace-nowrap">Desde</Label>
            <Input
              type="date"
              value={value.desde}
              onChange={handleDesde}
              className="w-36 h-8 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <Label className="text-xs text-slate-500 whitespace-nowrap">Hasta</Label>
            <Input
              type="date"
              value={value.hasta}
              onChange={handleHasta}
              className="w-36 h-8 text-sm"
            />
          </div>
        </div>
      )}
    </div>
  )
}

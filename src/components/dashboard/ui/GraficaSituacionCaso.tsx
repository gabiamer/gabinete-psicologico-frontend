import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { CasoSituacionRow } from "@/services/reportesService"

const COLORS: Record<string, string> = {
  "Acompañamiento psicológico":     "var(--chart-3)",
  "Buen proceso":                   "var(--chart-2)",
  "Proceso terminado":              "var(--chart-1)",
  "Orientación vocacional":         "var(--chart-4)",
  "Derivado a consultorio externo": "var(--chart-5)",
}

const chartConfig = {
  total: { label: "Casos" },
} satisfies ChartConfig

interface Props { data: CasoSituacionRow[] }

export function GraficaSituacionCaso({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Casos por Situación</CardTitle>
        <CardDescription>Distribución de casos según la situación actual del proceso</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="situacion"
              tickLine={false}
              axisLine={false}
              width={190}
              tick={{ fontSize: 11 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" radius={4}>
              {data.map((entry) => (
                <Cell key={entry.situacion} fill={COLORS[entry.situacion] ?? "var(--chart-1)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

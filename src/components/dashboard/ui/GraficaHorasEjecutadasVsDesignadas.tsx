import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { HorasEjecutadasVsDesignadasRow } from "@/services/reportesService"

const chartConfig = {
  designadas: { label: "Designadas", color: "var(--chart-1)" },
  ejecutadas:  { label: "Ejecutadas",  color: "var(--chart-3)" },
} satisfies ChartConfig

interface Props { data: HorasEjecutadasVsDesignadasRow[] }

export function GraficaHorasEjecutadasVsDesignadas({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Ejecutadas vs Designadas</CardTitle>
        <CardDescription>Comparación mensual de capacidad asignada vs horas reales de atención</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="designadas" fill="var(--color-designadas)" radius={4} />
            <Bar dataKey="ejecutadas"  fill="var(--color-ejecutadas)"  radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

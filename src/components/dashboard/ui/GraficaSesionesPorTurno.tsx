import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SesionesPorTurnoRow } from "@/services/reportesService"

const chartConfig = {
  manana: { label: "Mañana", color: "var(--chart-1)" },
  tarde:  { label: "Tarde",  color: "var(--chart-4)" },
} satisfies ChartConfig

interface Props { data: SesionesPorTurnoRow[] }

export function GraficaSesionesPorTurno({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones por Turno</CardTitle>
        <CardDescription>Cantidad de sesiones atendidas en mañana y tarde por mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="manana" fill="var(--color-manana)" radius={4} />
            <Bar dataKey="tarde"  fill="var(--color-tarde)"  radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

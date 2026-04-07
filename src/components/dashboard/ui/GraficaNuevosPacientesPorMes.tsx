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
import type { NuevosPacientesPorMesRow } from "@/services/reportesService"

const chartConfig = {
  universitarios: { label: "Universitarios", color: "var(--chart-1)" },
  externos:        { label: "Externos",        color: "var(--chart-4)" },
} satisfies ChartConfig

interface Props { data: NuevosPacientesPorMesRow[] }

export function GraficaNuevosPacientesPorMes({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nuevos Pacientes por Mes</CardTitle>
        <CardDescription>Ingresos mensuales de pacientes universitarios y externos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="universitarios" fill="var(--color-universitarios)" radius={[4, 4, 0, 0]} stackId="a" />
            <Bar dataKey="externos"        fill="var(--color-externos)"        radius={[4, 4, 0, 0]} stackId="a" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

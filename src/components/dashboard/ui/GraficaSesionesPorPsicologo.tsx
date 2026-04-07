import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SesionesPorPsicologoRow } from "@/services/reportesService"

const chartConfig = {
  total: { label: "Sesiones", color: "var(--chart-4)" },
} satisfies ChartConfig

interface Props { data: SesionesPorPsicologoRow[] }

export function GraficaSesionesPorPsicologo({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones por Psicólogo</CardTitle>
        <CardDescription>Cantidad de sesiones atendidas por cada profesional</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="psicologo" tickLine={false} axisLine={false} width={120} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

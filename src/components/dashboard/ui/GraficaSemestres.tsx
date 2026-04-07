import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SemestreRow } from "@/services/reportesService"

const chartConfig = {
  total: { label: "Pacientes", color: "var(--chart-2)" },
} satisfies ChartConfig

interface Props { data: SemestreRow[] }

export function GraficaSemestres({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pacientes por Semestre</CardTitle>
        <CardDescription>Distribución de pacientes universitarios según semestre</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="semestre" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

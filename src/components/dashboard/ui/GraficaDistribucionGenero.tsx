import { Pie, PieChart, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DistribucionGeneroRow } from "@/services/reportesService"

const COLORS = ["var(--chart-1)", "var(--chart-3)", "var(--chart-5)"]

const chartConfig = {
  Masculino:       { label: "Masculino",       color: "var(--chart-1)" },
  Femenino:        { label: "Femenino",        color: "var(--chart-3)" },
  "Sin especificar": { label: "Sin especificar", color: "var(--chart-5)" },
} satisfies ChartConfig

interface Props { data: DistribucionGeneroRow[] }

export function GraficaDistribucionGenero({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribución por Género</CardTitle>
        <CardDescription>Proporción de pacientes según género registrado</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="genero" />} />
            <ChartLegend content={<ChartLegendContent nameKey="genero" />} />
            <Pie data={data} dataKey="total" nameKey="genero" cx="50%" cy="50%" innerRadius={60} outerRadius={100}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

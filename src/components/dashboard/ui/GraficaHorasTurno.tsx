import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { HorasTurnoRow } from "@/services/reportesService"

const chartConfig = {
  designadas_manana: {
    label: "Designadas Mañana",
    color: "var(--chart-1)",
  },
  designadas_tarde: {
    label: "Designadas Tarde",
    color: "var(--chart-2)",
  },
  usadas_manana: {
    label: "Usadas Mañana",
    color: "var(--chart-3)",
  },
  usadas_tarde: {
    label: "Usadas Tarde",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig

interface Props {
  data: HorasTurnoRow[]
}

export function GraficaHorasTurno({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas de Uso por Turno</CardTitle>
        <CardDescription>Horas designadas vs usadas — mañana y tarde</CardDescription>
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="designadas_manana" fill="var(--color-designadas_manana)" radius={4} />
            <Bar dataKey="designadas_tarde" fill="var(--color-designadas_tarde)" radius={4} />
            <Bar dataKey="usadas_manana" fill="var(--color-usadas_manana)" radius={4} />
            <Bar dataKey="usadas_tarde" fill="var(--color-usadas_tarde)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

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
import type { HorasGeneroRow } from "@/services/reportesService"

const chartConfig = {
  mujeres: {
    label: "Mujeres",
    color: "var(--chart-2)",
  },
  varones: {
    label: "Varones",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface Props {
  data: HorasGeneroRow[]
}

export function GraficaHorasGenero({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horas Usadas por Género</CardTitle>
        <CardDescription>Distribución de horas por género</CardDescription>
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
            <Bar dataKey="mujeres" fill="var(--color-mujeres)" radius={4} />
            <Bar dataKey="varones" fill="var(--color-varones)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

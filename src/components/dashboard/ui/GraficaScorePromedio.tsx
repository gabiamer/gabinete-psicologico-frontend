import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ScorePromedioRow } from "@/services/reportesService"

const chartConfig = {
  estres:    { label: "Estrés",    color: "var(--chart-1)" },
  ansiedad:  { label: "Ansiedad",  color: "var(--chart-3)" },
  depresion: { label: "Depresión", color: "var(--chart-5)" },
} satisfies ChartConfig

interface Props { data: ScorePromedioRow[] }

export function GraficaScorePromedio({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Score Promedio por Mes</CardTitle>
        <CardDescription>Promedio mensual de escalas de estrés, ansiedad y depresión</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line dataKey="estres"    type="monotone" stroke="var(--color-estres)"    strokeWidth={2} dot={false} />
            <Line dataKey="ansiedad"  type="monotone" stroke="var(--color-ansiedad)"  strokeWidth={2} dot={false} />
            <Line dataKey="depresion" type="monotone" stroke="var(--color-depresion)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

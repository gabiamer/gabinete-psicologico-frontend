import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { SesionesPorMesRow } from "@/services/reportesService"

const chartConfig = {
  total: { label: "Sesiones", color: "var(--chart-2)" },
} satisfies ChartConfig

interface Props { data: SesionesPorMesRow[] }

export function GraficaSesionesPorMes({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones por Mes</CardTitle>
        <CardDescription>Total de sesiones realizadas cada mes</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(v) => v.slice(0, 3)} />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line dataKey="total" type="monotone" stroke="var(--color-total)" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

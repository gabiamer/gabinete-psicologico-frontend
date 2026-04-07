import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
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
import type { TipologiaGeneroRow } from "@/services/reportesService"

const chartConfig = {
  masculino: {
    label: "Masculino",
    color: "var(--chart-1)",
  },
  femenino: {
    label: "Femenino",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface Props {
  data: TipologiaGeneroRow[]
}

export function GraficaTipologias({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipologías de Atención por Género</CardTitle>
        <CardDescription>Distribución por tipo de atención y género</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[400px]">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{ left: 8, right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="tipologia"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={160}
              tickFormatter={(v) => (v.length > 20 ? v.slice(0, 18) + "…" : v)}
            />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="masculino" fill="var(--color-masculino)" radius={4} />
            <Bar dataKey="femenino" fill="var(--color-femenino)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

import { useMemo } from "react"
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
import type { HorasDepartamentoRow } from "@/services/reportesService"

interface Props {
  data: HorasDepartamentoRow[]
}

export function GraficaHorasDepartamento({ data }: Props) {
  const depKeys = useMemo(() => {
    const keys = new Set<string>()
    data.forEach(row =>
      Object.keys(row)
        .filter(k => k !== "mes" && k !== "mesNumero")
        .forEach(k => keys.add(k))
    )
    return Array.from(keys)
  }, [data])

  const chartConfig = useMemo(() => {
    return depKeys.reduce<ChartConfig>((acc, key, i) => {
      acc[key] = {
        label: key,
        color: `var(--chart-${(i % 5) + 1})`,
      }
      return acc
    }, {})
  }, [depKeys])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apoyo a Departamentos UCB</CardTitle>
        <CardDescription>Sesiones de atención por departamento académico</CardDescription>
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
            {depKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                fill={`var(--chart-${(i % 5) + 1})`}
                radius={4}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

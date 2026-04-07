import { Pie, PieChart, Cell } from "recharts"
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
  type ChartConfig,
} from "@/components/ui/chart"
import type { CasoGravedadRow } from "@/services/reportesService"

const colorMap: Record<string, string> = {
  leve: "var(--chart-2)",
  moderado: "var(--chart-3)",
  grave: "var(--chart-4)",
  "muy grave": "var(--chart-5)",
  "riesgo de vida": "var(--chart-1)",
}

const chartConfig = {
  value: {
    label: "Total",
  },
} satisfies ChartConfig

interface Props {
  data: CasoGravedadRow[]
}

export function GraficaGravedad({ data }: Props) {
  const pieData = data.map((row) => ({
    name: row.gravedad,
    value: row.total,
    fill: colorMap[row.gravedad.toLowerCase()] ?? "var(--chart-1)",
    gravedad: row.gravedad,
    total: row.total,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Casos por Gravedad</CardTitle>
        <CardDescription>Distribución de casos según nivel de gravedad</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={pieData} dataKey="value" nameKey="name">
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-4 flex flex-col gap-1 px-4 pb-4">
          {data.map((row) => (
            <div key={row.gravedad} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-3 w-3 rounded-sm flex-shrink-0"
                style={{
                  backgroundColor:
                    colorMap[row.gravedad.toLowerCase()] ?? "var(--chart-1)",
                }}
              />
              <span className="text-muted-foreground">
                {row.gravedad}: <span className="font-medium text-foreground">{row.total}</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

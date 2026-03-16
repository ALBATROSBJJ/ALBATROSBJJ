"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"

const weeklyData = {
  calories: { consumed: 18500, target: 21000 },
  protein: { consumed: 1200, target: 1260 },
  carbs: { consumed: 2000, target: 2200 },
  fats: { consumed: 600, target: 630 },
};

const energyBalanceData = [
  { day: 'Lun', intake: 2800, expenditure: 2500, surplus: 300 },
  { day: 'Mar', intake: 2600, expenditure: 2700, surplus: -100 },
  { day: 'Mié', intake: 3000, expenditure: 2400, surplus: 600 },
  { day: 'Jue', intake: 2700, expenditure: 2800, surplus: -100 },
  { day: 'Vie', intake: 3200, expenditure: 3000, surplus: 200 },
  { day: 'Sáb', intake: 3500, expenditure: 2200, surplus: 1300 },
  { day: 'Dom', intake: 2400, expenditure: 1800, surplus: 600 },
];

const chartConfig = {
  intake: {
    label: "Ingesta",
    color: "hsl(var(--primary))",
  },
  expenditure: {
    label: "Gasto",
    color: "hsl(var(--secondary))",
  },
}

export default function DashboardPage() {
  const renderMacroProgress = (key: 'calories' | 'protein' | 'carbs' | 'fats', title: string) => {
    const { consumed, target } = weeklyData[key];
    const percentage = (consumed / target) * 100;
    return (
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          <p className="text-sm font-mono tracking-tighter">
            <span className="font-bold text-foreground">{consumed.toLocaleString()}</span> / {target.toLocaleString()}
          </p>
        </div>
        <Progress value={percentage} className="h-2" indicatorClassName="bg-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Dashboard de Rendimiento</h1>
        <p className="text-muted-foreground">Análisis de la semana: prepárate para el combate.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Adherencia Semanal</CardTitle>
            <CardDescription>Cumplimiento de macros y calorías.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderMacroProgress('calories', 'Calorías (kcal)')}
            {renderMacroProgress('protein', 'Proteína (g)')}
            {renderMacroProgress('carbs', 'Carbohidratos (g)')}
            {renderMacroProgress('fats', 'Grasas (g)')}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Balance Energético Diario</CardTitle>
            <CardDescription>Ingesta vs. Gasto calórico.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <ResponsiveContainer>
                <BarChart data={energyBalanceData} margin={{ top: 20, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="intake" fill="var(--color-intake)" radius={4} />
                  <Bar dataKey="expenditure" fill="var(--color-expenditure)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Órdenes del Coach</CardTitle>
            <CardDescription>Análisis táctico de tu semana.</CardDescription>
          </CardHeader>
          <CardContent>
            <blockquote className="border-l-2 border-primary pl-4">
              <p className="text-sm text-muted-foreground">
                "Balance energético positivo en 5 de 7 días. Estás en fase de carga, bien. Pero el martes te quedaste corto. Eso es un error de novato. En el campamento, cada caloría cuenta. No quiero volver a ver números rojos en tu gasto. La proteína está al 95%, aceptable, pero no perfecto. La perfección gana peleas. Ajusta el timing de tu batido post-entreno del martes. Quiero 100% de adherencia la próxima semana. ¿Entendido?"
              </p>
            </blockquote>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

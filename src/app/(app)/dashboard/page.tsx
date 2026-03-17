"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import React from "react"
import { useDailyData } from "@/context/DailyDataProvider"

type Biometrics = {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityLevel: number;
};

// Data for the weekly chart
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
  surplus: {
    label: "Balance Neto",
  },
  intake: {
    label: "Superávit",
    color: "hsl(var(--primary))",
  },
  expenditure: {
    label: "Déficit",
    color: "hsl(var(--destructive))",
  },
}

export default function DashboardPage() {
  const { intakeCalories, expenditureCalories } = useDailyData();

  // Data for today's consumption is now based on shared context
  const dailyConsumed = {
    calories: intakeCalories,
    protein: 190, // Note: This is still mock data
    carbs: 350,   // Note: This is still mock data
    fats: 80,     // Note: This is still mock data
    expenditure: expenditureCalories,
  };


  const [biometrics] = React.useState<Biometrics>({
    gender: 'male',
    weight: 84,
    height: 180,
    age: 28,
    activityLevel: 1.55,
  });
  const [goal] = React.useState<'maintain' | 'lose' | 'gain'>('gain');
  const [dailyTargets, setDailyTargets] = React.useState({
    calories: 3200,
    protein: 185,
    carbs: 380,
    fats: 90,
  });

  const calculateTargets = React.useCallback(() => {
    let bmr;
    if (biometrics.gender === 'male') {
      bmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) + 5;
    } else {
      bmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) - 161;
    }

    const tdee = bmr * biometrics.activityLevel;
    
    let targetCalories = tdee;
    if (goal === 'lose') {
      targetCalories *= 0.85;
    } else if (goal === 'gain') {
      targetCalories *= 1.15;
    }
    
    const proteinG = biometrics.weight * 2.2;
    const fatG = biometrics.weight * 0.9;
    const carbsKcal = targetCalories - (proteinG * 4) - (fatG * 9);
    const carbsG = carbsKcal / 4;
    
    setDailyTargets({
      calories: Math.round(targetCalories),
      protein: Math.round(proteinG),
      fats: Math.round(fatG),
      carbs: Math.round(carbsG),
    });
  }, [biometrics, goal]);

  React.useEffect(() => {
    calculateTargets();
  }, [calculateTargets]);

  const tdee = React.useMemo(() => {
    let bmr;
    if (biometrics.gender === 'male') {
      bmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) + 5;
    } else {
      bmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) - 161;
    }
    return bmr * biometrics.activityLevel;
  }, [biometrics]);

  const targetNetBalance = Math.round(dailyTargets.calories - tdee);

  const renderMacroProgress = (key: 'protein' | 'carbs' | 'fats', title: string) => {
    const consumed = dailyConsumed[key as keyof typeof dailyConsumed];
    const target = dailyTargets[key as keyof typeof dailyTargets];
    const percentage = target > 0 ? (consumed / target) * 100 : 0;
    return (
      <div>
        <div className="flex justify-between items-baseline mb-1">
          <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
          <p className="text-sm font-mono tracking-tighter">
            <span className="font-bold text-foreground">{consumed.toLocaleString()}</span> / {target.toLocaleString()} g
          </p>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
    )
  }
  
  const DailyCalorieSummary = () => {
    const netBalance = dailyConsumed.calories - dailyConsumed.expenditure;

    return (
      <div>
        <h3 className="text-lg font-bold tracking-tight mb-4">Balance Calórico del Día</h3>
        <div className="p-4 rounded-md border bg-secondary/50 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Ingesta</span>
            <span className="font-mono tracking-tighter font-bold text-foreground">{dailyConsumed.calories.toLocaleString()} kcal</span>
          </div>
           <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Gasto</span>
            <span className="font-mono tracking-tighter font-bold text-foreground">{dailyConsumed.expenditure.toLocaleString()} kcal</span>
          </div>
          <Separator />
           <div className="flex justify-between items-center">
            <span className="font-medium">Balance Neto</span>
            <span className={`font-mono tracking-tighter font-bold ${netBalance >= 0 ? 'text-primary' : 'text-destructive'}`}>
                {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()} kcal
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Meta Neta Diaria</span>
            <span className={`font-mono tracking-tighter ${targetNetBalance >= 0 ? 'text-primary/80' : 'text-destructive/80'}`}>
                {targetNetBalance >= 0 ? '+' : ''}{targetNetBalance.toLocaleString()} kcal
            </span>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Dashboard de Rendimiento</h1>
        <p className="text-muted-foreground">Análisis de la semana: prepárate para el combate.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Adherencia Diaria</CardTitle>
            <CardDescription>Cumplimiento de objetivos para hoy.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <DailyCalorieSummary />
              <Separator />
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-4">Macros de Combate</h3>
                <div className="space-y-4">
                    {renderMacroProgress('protein', 'Proteína (g)')}
                    {renderMacroProgress('carbs', 'Carbohidratos (g)')}
                    {renderMacroProgress('fats', 'Grasas (g)')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Balance Neto Semanal</CardTitle>
            <CardDescription>Balance calórico neto (ingesta - gasto) de los últimos 7 días.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <ResponsiveContainer>
                <BarChart data={energyBalanceData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }} barGap={4}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="kcal" />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent
                      formatter={(value) => `${value.toLocaleString()} kcal`}
                      indicator="dot"
                    />}
                  />
                  <ReferenceLine 
                    y={targetNetBalance} 
                    label={{ value: 'Meta Neta', position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                    stroke="hsl(var(--ring))" 
                    strokeDasharray="2 6" 
                  />
                  <Bar dataKey="surplus" radius={4}>
                    {energyBalanceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.surplus >= 0 ? "var(--color-intake)" : "var(--color-expenditure)"} />
                    ))}
                  </Bar>
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

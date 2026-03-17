
"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import React, { useMemo } from "react"
import { useDailyData } from "@/context/DailyDataProvider"
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { subDays, startOfDay, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Skeleton } from "@/components/ui/skeleton"

// Type definitions from bitacora/page.tsx
type MealLog = {
  id: string;
  logDate: string; // ISO String
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbohydrates: number;
};
type TrainingSession = {
  id: string;
  logDate: string; // ISO String
  estimatedCaloriesBurned: number;
};

const chartConfig = {
  intake: {
    label: "Ingesta",
    color: "hsl(var(--primary))",
  },
  expenditure: {
    label: "Gasto",
    color: "hsl(var(--muted-foreground))",
  },
}

export default function DashboardPage() {
  const { dailyTargets, isDataLoading: isTargetsLoading } = useDailyData(); // Keep this for targets from laboratorio
  const { user } = useUser();
  const firestore = useFirestore();

  const sevenDaysAgo = useMemo(() => startOfDay(subDays(new Date(), 6)), []);

  const mealLogsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, `perfiles/${user.uid}/mealLogs`),
        where('logDate', '>=', sevenDaysAgo.toISOString())
    );
  }, [user, firestore, sevenDaysAgo]);
  const { data: mealLogs, isLoading: isLoadingMeals } = useCollection<MealLog>(mealLogsQuery);

  const trainingSessionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(
        collection(firestore, `perfiles/${user.uid}/trainingSessions`),
        where('logDate', '>=', sevenDaysAgo.toISOString())
    );
  }, [user, firestore, sevenDaysAgo]);
  const { data: trainingSessions, isLoading: isLoadingTrainings } = useCollection<TrainingSession>(trainingSessionsQuery);

  const isLoading = isLoadingMeals || isLoadingTrainings || isTargetsLoading;

  const { dailyConsumed, energyBalanceData } = useMemo(() => {
    const today = startOfDay(new Date());
    const todayStr = today.toISOString().split('T')[0];

    const todayLogs = mealLogs?.filter(log => log.logDate.startsWith(todayStr)) ?? [];
    const todaySessions = trainingSessions?.filter(session => session.logDate.startsWith(todayStr)) ?? [];

    const consumed = {
        calories: todayLogs.reduce((sum, log) => sum + log.totalCalories, 0),
        protein: todayLogs.reduce((sum, log) => sum + log.totalProtein, 0),
        carbs: todayLogs.reduce((sum, log) => sum + log.totalCarbohydrates, 0),
        fats: todayLogs.reduce((sum, log) => sum + log.totalFat, 0),
        expenditure: todaySessions.reduce((sum, session) => sum + session.estimatedCaloriesBurned, 0),
    };
    
    const balanceData = [...Array(7)].map((_, i) => {
        const day = startOfDay(subDays(new Date(), i));
        const dayStr = day.toISOString().split('T')[0];
        
        const dayLogs = mealLogs?.filter(log => log.logDate.startsWith(dayStr)) ?? [];
        const daySessions = trainingSessions?.filter(session => session.logDate.startsWith(dayStr)) ?? [];

        return {
            day: format(day, 'E', { locale: es }),
            intake: dayLogs.reduce((sum, log) => sum + log.totalCalories, 0),
            expenditure: daySessions.reduce((sum, session) => sum + session.estimatedCaloriesBurned, 0),
        };
    }).reverse();

    return { dailyConsumed: consumed, energyBalanceData: balanceData };

  }, [mealLogs, trainingSessions]);

  const renderMacroProgress = (key: 'protein' | 'carbs' | 'fats', title: string) => {
    const consumed = dailyConsumed[key as keyof typeof dailyConsumed];
    const target = dailyTargets[key as keyof typeof dailyTargets];
    const percentage = target > 0 ? (consumed / target) * 100 : 0;
    
    if (isLoading) {
        return (
            <div>
                <div className="flex justify-between items-baseline mb-1">
                    <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
                    <Skeleton className="h-5 w-1/3" />
                </div>
                <Skeleton className="h-2 w-full" />
            </div>
        );
    }
    
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
    
    if (isLoading) {
        return (
          <div>
            <h3 className="text-lg font-bold tracking-tight mb-4">Balance Calórico del Día</h3>
            <div className="p-4 rounded-md border bg-secondary/50 space-y-4">
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Ingesta</span><Skeleton className="h-5 w-1/4" /></div>
                <div className="flex justify-between items-center"><span className="text-muted-foreground">Gasto</span><Skeleton className="h-5 w-1/4" /></div>
                <Separator />
                <div className="flex justify-between items-center"><span className="font-medium">Balance Neto</span><Skeleton className="h-6 w-1/4" /></div>
                <div className="flex justify-between items-center text-sm"><span className="text-muted-foreground">Objetivo Calórico</span><Skeleton className="h-5 w-1/4" /></div>
            </div>
        </div>
        )
    }

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
            <span className="text-muted-foreground">Objetivo Calórico</span>
            <span className="font-mono tracking-tighter text-primary/80">
                {dailyTargets.calories.toLocaleString()} kcal
            </span>
          </div>
        </div>
      </div>
    );
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const netBalance = data.intake - data.expenditure;
        const colorClass = netBalance >= 0 ? 'text-primary' : 'text-destructive';

        return (
        <div className="p-3 bg-card border rounded-md shadow-lg text-sm">
            <p className="font-bold mb-2">{label}</p>
            <div className="space-y-1">
            <p>Ingesta: <span className="font-mono font-medium">{data.intake.toLocaleString()} kcal</span></p>
            <p>Gasto: <span className="font-mono font-medium">{data.expenditure.toLocaleString()} kcal</span></p>
            <p className={`font-bold ${colorClass}`}>
                Balance Neto: 
                <span className="font-mono font-medium"> {netBalance >= 0 ? '+' : ''}{netBalance.toLocaleString()} kcal</span>
            </p>
            </div>
        </div>
        );
    }
    return null;
  };


  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Dashboard de Rendimiento</h1>
        <p className="text-muted-foreground">Análisis de la semana: prepárate para el combate.</p>
      </header>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <div className="grid gap-6 lg:col-span-1">
          <Card>
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
        </div>
        
        <div className="grid gap-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-black tracking-tighter">Balance Energético Semanal</CardTitle>
              <CardDescription>Ingesta vs. Gasto Calórico de los últimos 7 días.</CardDescription>
            </CardHeader>
            <CardContent>
               <ChartContainer config={chartConfig} className="h-[300px] w-full">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                <ResponsiveContainer>
                  <BarChart data={energyBalanceData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }} barGap={4}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} unit="kcal" />
                    <Tooltip
                      cursor={false}
                      content={<CustomTooltip />}
                    />
                     <ChartLegend content={<ChartLegendContent />} />
                    <ReferenceLine 
                      y={dailyTargets.calories} 
                      label={{ value: 'Meta Ingesta', position: 'insideTopRight', fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                      stroke="hsl(var(--ring))" 
                      strokeDasharray="2 6" 
                    />
                    <Bar dataKey="intake" fill="var(--color-intake)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expenditure" fill="var(--color-expenditure)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                )}
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-black tracking-tighter">Instrucciones Generales</CardTitle>
            <CardDescription>Guía para optimizar tu rendimiento y disciplina.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-5">
                <li>Mantén un balance energético acorde a tus objetivos durante toda la semana. Evita variaciones grandes entre días.</li>
                <li>Asegura una ingesta adecuada de proteína diaria para favorecer la recuperación y el rendimiento.</li>
                <li>Procura respetar los horarios de comida, especialmente después del entrenamiento.</li>
                <li>Hidrátate correctamente a lo largo del día.</li>
                <li>Da prioridad a alimentos de buena calidad nutricional y evita omitir comidas.</li>
                <li>Mantén constancia y registra tus alimentos para un mejor seguimiento.</li>
                <li>El progreso depende de la disciplina diaria. Enfócate en mejorar pequeños detalles semana a semana.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

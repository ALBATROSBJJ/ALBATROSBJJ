"use client";

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Weight, Ruler, Cake, Activity, Target } from 'lucide-react';

type Biometrics = {
  gender: 'male' | 'female';
  weight: number;
  height: number;
  age: number;
  activityLevel: number;
};

export default function LaboratorioPage() {
  const [biometrics, setBiometrics] = React.useState<Biometrics>({
    gender: 'male',
    weight: 84,
    height: 180,
    age: 28,
    activityLevel: 1.55,
  });

  const [goal, setGoal] = React.useState<'maintain' | 'lose' | 'gain'>('maintain');
  const [bmr, setBmr] = React.useState<number | null>(null);
  const [tdee, setTdee] = React.useState<number | null>(null);
  const [macros, setMacros] = React.useState<{ protein: number, fat: number, carbs: number } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBiometrics(prev => ({ ...prev, [name]: Number(value) }));
  };

  const calculateAll = React.useCallback(() => {
    // BMR (Mifflin-St Jeor)
    let calculatedBmr;
    if (biometrics.gender === 'male') {
      calculatedBmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) + 5;
    } else {
      calculatedBmr = (10 * biometrics.weight) + (6.25 * biometrics.height) - (5 * biometrics.age) - 161;
    }
    setBmr(Math.round(calculatedBmr));

    // TDEE
    const calculatedTdee = calculatedBmr * biometrics.activityLevel;
    
    let targetCalories = calculatedTdee;
    if (goal === 'lose') {
      targetCalories *= 0.85; // 15% deficit
    } else if (goal === 'gain') {
      targetCalories *= 1.15; // 15% surplus
    }
    setTdee(Math.round(targetCalories));
    
    // Macros
    const proteinG = biometrics.weight * 2.2;
    const fatG = biometrics.weight * 0.9;
    const proteinKcal = proteinG * 4;
    const fatKcal = fatG * 9;
    const carbsKcal = targetCalories - proteinKcal - fatKcal;
    const carbsG = carbsKcal / 4;
    setMacros({
      protein: Math.round(proteinG),
      fat: Math.round(fatG),
      carbs: Math.round(carbsG < 0 ? 0 : carbsG)
    });

  }, [biometrics, goal]);

  React.useEffect(() => {
    calculateAll();
  }, [calculateAll]);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Laboratorio Biométrica</h1>
        <p className="text-muted-foreground">Calibra tu motor. La precisión es letal.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-black tracking-tighter"><User/>Datos del Atleta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Sexo</Label>
                <RadioGroup defaultValue="male" value={biometrics.gender} onValueChange={(value: 'male' | 'female') => setBiometrics(prev => ({ ...prev, gender: value }))}>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Masculino</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Femenino</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className="flex items-center gap-2"><Weight className="h-4 w-4"/>Peso (kg)</Label>
                <Input id="weight" name="weight" type="number" value={biometrics.weight} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className="flex items-center gap-2"><Ruler className="h-4 w-4"/>Altura (cm)</Label>
                <Input id="height" name="height" type="number" value={biometrics.height} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2"><Cake className="h-4 w-4"/>Edad</Label>
                <Input id="age" name="age" type="number" value={biometrics.age} onChange={handleInputChange} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel" className="flex items-center gap-2"><Activity className="h-4 w-4"/>Nivel de Actividad</Label>
                 <Select value={String(biometrics.activityLevel)} onValueChange={(value) => setBiometrics(prev => ({ ...prev, activityLevel: Number(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentario (oficina)</SelectItem>
                    <SelectItem value="1.375">Ligero (1-3 días/sem)</SelectItem>
                    <SelectItem value="1.55">Moderado (3-5 días/sem)</SelectItem>
                    <SelectItem value="1.725">Intenso (6-7 días/sem)</SelectItem>
                    <SelectItem value="1.9">Atleta (2x día)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="flex items-center gap-2"><Target className="h-4 w-4"/>Objetivo</Label>
                <RadioGroup defaultValue="maintain" value={goal} onValueChange={(value: 'maintain' | 'lose' | 'gain') => setGoal(value)}>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="lose" id="lose" />
                      <Label htmlFor="lose">Bajar Peso</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="maintain" id="maintain" />
                      <Label htmlFor="maintain">Mantener</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="gain" id="gain" />
                      <Label htmlFor="gain">Subir Masa</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-black tracking-tighter">Resultados Tácticos</CardTitle>
              <CardDescription>Tus objetivos diarios calculados.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="p-6 rounded-md border bg-secondary/50">
                  <h3 className="text-muted-foreground tracking-widest uppercase text-sm">Objetivo Calórico Diario</h3>
                  <p className="text-5xl font-black text-primary tracking-tighter">{tdee?.toLocaleString() ?? '...'} <span className="text-3xl text-muted-foreground">kcal</span></p>
                  <p className="text-sm text-muted-foreground mt-1">Metabolismo Basal (BMR): {bmr?.toLocaleString() ?? '...'} kcal</p>
              </div>

              <div>
                <h3 className="text-lg font-bold tracking-tight mb-4">Macros de Combate</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-md border">
                    <h4 className="text-muted-foreground">Proteína</h4>
                    <p className="text-3xl font-black tracking-tighter">{macros?.protein ?? '...'}g</p>
                    <p className="text-xs text-muted-foreground">2.2g / kg de peso</p>
                  </div>
                  <div className="p-4 rounded-md border">
                    <h4 className="text-muted-foreground">Grasas</h4>
                    <p className="text-3xl font-black tracking-tighter">{macros?.fat ?? '...'}g</p>
                     <p className="text-xs text-muted-foreground">0.9g / kg de peso</p>
                  </div>
                   <div className="p-4 rounded-md border">
                    <h4 className="text-muted-foreground">Carbohidratos</h4>
                    <p className="text-3xl font-black tracking-tighter">{macros?.carbs ?? '...'}g</p>
                     <p className="text-xs text-muted-foreground">Energía explosiva</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

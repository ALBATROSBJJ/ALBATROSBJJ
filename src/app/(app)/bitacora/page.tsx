"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Utensils, Dumbbell } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth, useFirestore } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const mealLogSchema = z.object({
  mealType: z.enum(['Desayuno', 'Almuerzo', 'Cena', 'Snack'], { required_error: "Debes seleccionar un tipo de comida." }),
  totalCalories: z.coerce.number().min(0, "Las calorías no pueden ser negativas."),
  totalProtein: z.coerce.number().min(0, "La proteína no puede ser negativa."),
  totalFat: z.coerce.number().min(0, "Las grasas no pueden ser negativas."),
  totalCarbohydrates: z.coerce.number().min(0, "Los carbohidratos no pueden ser negativos."),
  notes: z.string().optional(),
});

const trainingSessionSchema = z.object({
  activityType: z.string().min(1, "Debes especificar un tipo de actividad."),
  durationMinutes: z.coerce.number().min(1, "La duración debe ser de al menos 1 minuto."),
  intensityLevel: z.enum(['Baja', 'Moderada', 'Alta'], { required_error: "Debes seleccionar una intensidad." }),
  estimatedCaloriesBurned: z.coerce.number().min(0, "Las calorías quemadas no pueden ser negativas."),
  notes: z.string().optional(),
});

export default function BitacoraPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const mealForm = useForm<z.infer<typeof mealLogSchema>>({
    resolver: zodResolver(mealLogSchema),
    defaultValues: {
      mealType: "Almuerzo",
      totalCalories: 0,
      totalProtein: 0,
      totalFat: 0,
      totalCarbohydrates: 0,
      notes: "",
    },
  });

  const trainingForm = useForm<z.infer<typeof trainingSessionSchema>>({
    resolver: zodResolver(trainingSessionSchema),
    defaultValues: {
      activityType: "",
      durationMinutes: 30,
      intensityLevel: "Moderada",
      estimatedCaloriesBurned: 0,
      notes: "",
    },
  });

  const onMealSubmit = (values: z.infer<typeof mealLogSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para añadir registros.",
      });
      return;
    }

    const mealLogData = {
      ...values,
      userId: user.uid,
      logDate: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const mealLogsRef = collection(firestore, `perfiles/${user.uid}/mealLogs`);
    addDocumentNonBlocking(mealLogsRef, mealLogData);
    
    toast({
      title: "Registro de Comida Guardado",
      description: `Se ha añadido tu ${values.mealType}.`,
    });
    
    mealForm.reset();
    setIsDialogOpen(false);
  };

  const onTrainingSubmit = (values: z.infer<typeof trainingSessionSchema>) => {
    if (!user || !firestore) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para añadir registros.",
      });
      return;
    }
    
    const trainingSessionData = {
      ...values,
      userId: user.uid,
      logDate: new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const trainingSessionsRef = collection(firestore, `perfiles/${user.uid}/trainingSessions`);
    addDocumentNonBlocking(trainingSessionsRef, trainingSessionData);

    toast({
      title: "Registro de Entrenamiento Guardado",
      description: `Se ha añadido tu sesión de ${values.activityType}.`,
    });

    trainingForm.reset();
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="p-4 md:p-8 space-y-8">
        <header>
          <h1 className="text-3xl font-black tracking-tighter">Bitácora de Combate</h1>
          <p className="text-muted-foreground">Registra cada comida, cada entreno. La data es tu mejor arma.</p>
        </header>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Historial de Operaciones</CardTitle>
              <CardDescription>Tu registro diario de rendimiento.</CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Registro
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md min-h-[500px] flex items-center justify-center bg-background/50">
              <p className="text-muted-foreground">Aquí se mostrará tu historial de comidas y entrenamientos.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-xl">
          <DialogHeader>
            <DialogTitle>Añadir a la Bitácora</DialogTitle>
            <DialogDescription>
              Registra una comida o un entrenamiento para mantener tu historial al día.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="comida" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="comida"><Utensils className="mr-2 h-4 w-4"/>Comida</TabsTrigger>
              <TabsTrigger value="entrenamiento"><Dumbbell className="mr-2 h-4 w-4"/>Entrenamiento</TabsTrigger>
            </TabsList>
            <TabsContent value="comida">
              <Form {...mealForm}>
                <form onSubmit={mealForm.handleSubmit(onMealSubmit)} className="space-y-4 pt-4">
                  <FormField control={mealForm.control} name="mealType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Comida</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger><SelectValue placeholder="Selecciona un tipo" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Desayuno">Desayuno</SelectItem>
                          <SelectItem value="Almuerzo">Almuerzo</SelectItem>
                          <SelectItem value="Cena">Cena</SelectItem>
                          <SelectItem value="Snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={mealForm.control} name="totalCalories" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorías Totales (kcal)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <div className="grid grid-cols-3 gap-4">
                     <FormField control={mealForm.control} name="totalProtein" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Proteína (g)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={mealForm.control} name="totalFat" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grasas (g)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                      <FormField control={mealForm.control} name="totalCarbohydrates" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carbs (g)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                   </div>
                  <FormField control={mealForm.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas (Opcional)</FormLabel>
                      <FormControl><Textarea placeholder="Ej: Me sentí con mucha energía..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <Button type="submit">Guardar Comida</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="entrenamiento">
               <Form {...trainingForm}>
                <form onSubmit={trainingForm.handleSubmit(onTrainingSubmit)} className="space-y-4 pt-4">
                  <FormField control={trainingForm.control} name="activityType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Actividad</FormLabel>
                      <FormControl><Input placeholder="Ej: Jiu-Jitsu, Sparring, Pesas" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={trainingForm.control} name="durationMinutes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración (min)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                     <FormField control={trainingForm.control} name="intensityLevel" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Intensidad</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Selecciona intensidad" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Baja">Baja</SelectItem>
                            <SelectItem value="Moderada">Moderada</SelectItem>
                            <SelectItem value="Alta">Alta</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={trainingForm.control} name="estimatedCaloriesBurned" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorías Quemadas (kcal)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={trainingForm.control} name="notes" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas (Opcional)</FormLabel>
                      <FormControl><Textarea placeholder="Ej: Foco en drills de guardia..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <DialogFooter>
                    <Button type="submit">Guardar Entrenamiento</Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, XCircle } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from "@/components/ui/separator";

// Based on docs/backend.json
type FoodItem = {
  id: string;
  nombre: string;
  calorias: number;
};


export default function AlimentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const firestore = useFirestore();

  const alimentosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'alimentos'));
  }, [firestore]);

  const { data: alimentos, isLoading } = useCollection<FoodItem>(alimentosQuery);
  
  const filteredAlimentos = alimentos?.filter(alimento =>
    (alimento?.nombre ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isDataEmpty = !isLoading && (!alimentos || alimentos.length === 0);

  const handleAddFood = (food: FoodItem) => {
    setSelectedFoods(prev => [...prev, food]);
    setTotalCalories(prev => prev + food.calorias);
  };

  const handleClearFoods = () => {
    setSelectedFoods([]);
    setTotalCalories(0);
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Base de Datos de Alimentos</h1>
        <p className="text-muted-foreground">Busca en el arsenal nutricional y suma tus calorías.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Buscador de Munición</CardTitle>
              <CardDescription>Encuentra cualquier alimento y añádelo a tu contador.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar alimento (ej. 'Pechuga de pollo', 'Arroz integral'...)"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isDataEmpty && (
                <div className="mt-6 p-4 text-sm text-center bg-secondary/50 border border-dashed rounded-md">
                    <p><span className="font-bold">Tu base de datos está vacía.</span><br/> Agrega documentos a la colección 'alimentos' en Firestore para ver tus datos aquí.</p>
                </div>
              )}

              {!isDataEmpty && <div className="mt-6 border rounded-md">
                {isLoading ? (
                  <div className="space-y-4 p-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alimento</TableHead>
                        <TableHead className="text-right">Calorías (100g)</TableHead>
                        <TableHead className="w-[80px] text-center">Acción</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAlimentos && filteredAlimentos.length > 0 ? (
                        filteredAlimentos.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.nombre}</TableCell>
                            <TableCell className="text-right">{item.calorias} kcal</TableCell>
                            <TableCell className="text-center">
                              <Button variant="ghost" size="icon" onClick={() => handleAddFood(item)}>
                                <PlusCircle className="h-5 w-5 text-primary" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                         <TableRow>
                           <TableCell colSpan={3} className="text-center h-24">
                             No se encontraron alimentos con ese nombre.
                           </TableCell>
                         </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Contador de Calorías</CardTitle>
              <CardDescription>Las calorías de los alimentos que selecciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 min-h-[100px]">
              {selectedFoods.length > 0 ? (
                <div className="space-y-2">
                  {selectedFoods.map((food, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-secondary/50">
                      <span>{food.nombre}</span>
                      <span className="font-mono">{food.calorias} kcal</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground pt-4">
                  Añade alimentos para empezar a contar.
                </div>
              )}
            </CardContent>
            <Separator />
            <CardFooter className="flex-col items-stretch pt-4 space-y-4">
               <div className="flex justify-between items-baseline">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-black text-primary tracking-tighter">{totalCalories} kcal</span>
              </div>
              {selectedFoods.length > 0 && (
                <Button variant="destructive" onClick={handleClearFoods} className="w-full">
                  <XCircle className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

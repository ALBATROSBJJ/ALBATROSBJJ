"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

// Based on docs/backend.json
type FoodItem = {
  id: string;
  name: string;
  category: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbohydratesPer100g: number;
};

// Mock data to show if the database is empty
const mockAlimentos: FoodItem[] = [
    { id: '1', name: 'Pechuga de Pollo', category: 'Carnes', caloriesPer100g: 165, proteinPer100g: 31, fatPer100g: 3.6, carbohydratesPer100g: 0 },
    { id: '2', name: 'Arroz Integral', category: 'Cereales', caloriesPer100g: 111, proteinPer100g: 2.6, fatPer100g: 0.9, carbohydratesPer100g: 23 },
    { id: '3', name: 'Brócoli', category: 'Verduras', caloriesPer100g: 34, proteinPer100g: 2.8, fatPer100g: 0.4, carbohydratesPer100g: 7 },
    { id: '4', name: 'Huevo', category: 'General', caloriesPer100g: 155, proteinPer100g: 13, fatPer100g: 11, carbohydratesPer100g: 1.1 },
    { id: '5', name: 'Salmón', category: 'Pescados', caloriesPer100g: 208, proteinPer100g: 20, fatPer100g: 13, carbohydratesPer100g: 0 },
];


export default function AlimentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const alimentosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'alimentos'));
  }, [firestore]);

  const { data: alimentos, isLoading } = useCollection<FoodItem>(alimentosQuery);
  
  const displayData = (alimentos && alimentos.length > 0) ? alimentos : (isLoading ? [] : mockAlimentos);

  const filteredAlimentos = displayData.filter(alimento =>
    (alimento?.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const isUsingMockData = !isLoading && (!alimentos || alimentos.length === 0);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Base de Datos de Alimentos</h1>
        <p className="text-muted-foreground">Busca en el arsenal nutricional. El conocimiento es poder.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Buscador de Munición</CardTitle>
          <CardDescription>Encuentra cualquier alimento y sus datos de inteligencia (macros).</CardDescription>
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

          {isUsingMockData && (
            <div className="mt-4 p-3 text-sm text-center bg-secondary/50 border border-dashed rounded-md">
                <p><span className="font-bold">Mostrando datos de ejemplo.</span><br/> Tu colección 'alimentos' en Firestore está vacía. Agrega documentos para ver tus datos aquí.</p>
            </div>
          )}

          <div className="mt-6 border rounded-md">
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
                    <TableHead className="text-right">Calorías (por 100g)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlimentos && filteredAlimentos.length > 0 ? (
                    filteredAlimentos.map(item => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.caloriesPer100g} kcal</TableCell>
                      </TableRow>
                    ))
                  ) : (
                     <TableRow>
                      <TableCell colSpan={2} className="text-center h-24">
                        {searchTerm ? "No se encontraron alimentos con ese nombre." : "No hay alimentos para mostrar."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

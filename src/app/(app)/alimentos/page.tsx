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

export default function AlimentosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const firestore = useFirestore();

  const alimentosQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'alimentos'));
  }, [firestore]);

  const { data: alimentos, isLoading } = useCollection<FoodItem>(alimentosQuery);

  const filteredAlimentos = alimentos?.filter(alimento =>
    alimento.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                        {alimentos === null && !isLoading ? "La base de datos puede estar vacía o no se pudo cargar." : "No se encontraron alimentos."}
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

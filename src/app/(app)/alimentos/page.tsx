import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function AlimentosPage() {
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
            <Input placeholder="Buscar alimento (ej. 'Pechuga de pollo', 'Arroz integral'...)" className="pl-10" />
          </div>
          <div className="mt-6 border rounded-md min-h-[400px] flex items-center justify-center bg-background/50">
            <p className="text-muted-foreground">Los resultados de la búsqueda aparecerán aquí.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

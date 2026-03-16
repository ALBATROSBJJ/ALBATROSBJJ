import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function BitacoraPage() {
  return (
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
          <Button>
            <PlusCircle className="mr-2 h-4 w-4"/>
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
  );
}

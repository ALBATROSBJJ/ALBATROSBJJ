import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Aplicaciones</h1>
        <p className="text-muted-foreground">Explora aplicaciones y herramientas adicionales.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace de Apps</CardTitle>
          <CardDescription>Próximamente: Conecta nuevas herramientas para potenciar tu rendimiento.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md min-h-[500px] flex items-center justify-center bg-background/50">
            <p className="text-muted-foreground">Este espacio estará dedicado a futuras integraciones y aplicaciones.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

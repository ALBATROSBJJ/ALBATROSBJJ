'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Download } from "lucide-react";

export default function AppsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Aplicaciones</h1>
        <p className="text-muted-foreground">Explora aplicaciones y herramientas adicionales.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Tu Aplicación Publicada</CardTitle>
          <CardDescription>Accede a tu aplicación desde aquí.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md min-h-[500px] flex flex-col items-center justify-center bg-background/50 text-center gap-4 p-4">
            <p className="text-muted-foreground max-w-md">
              He añadido un enlace a tu aplicación. Ten en cuenta que esta es una aplicación web, por lo que no se descarga como un archivo APK (que es para Android). Puedes visitarla directamente en tu navegador.
            </p>
            <Button asChild className="font-bold">
              <Link href="https://radiant-souffle-a7fe2d.netlify.app" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Visitar App
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

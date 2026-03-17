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
          <CardTitle>Descarga la APK</CardTitle>
          <CardDescription>Descarga el archivo de instalación para Android.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md min-h-[500px] flex flex-col items-center justify-center bg-background/50 text-center gap-4 p-4">
            <p className="text-muted-foreground max-w-md">
              Usa este botón para descargar el archivo APK de la aplicación para dispositivos Android.
            </p>
            <Button asChild className="font-bold">
              <Link href="https://drive.google.com/file/d/15x9Bx9C9E9Up1k_j-qjU-bc7tNC6IThT/view?usp=drive_link" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                Descargar APK
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

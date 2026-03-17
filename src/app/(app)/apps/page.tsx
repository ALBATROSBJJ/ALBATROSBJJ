'use client';

import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const APK_URL = "https://github.com/ALBATROSBJJ/mi-app/releases/download/1.0/app-debug.1.apk";
const DOWNLOAD_PASSWORD = "8342";

export default function AppsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const handleDownload = () => {
    if (password === DOWNLOAD_PASSWORD) {
      // Correct password, trigger download
      downloadLinkRef.current?.click();
      setIsDialogOpen(false);
      setPassword("");
      toast({
        title: "Descarga Iniciada",
        description: "El archivo APK ha comenzado a descargarse.",
      });
    } else {
      // Incorrect password
      toast({
        variant: "destructive",
        title: "Contraseña Incorrecta",
        description: "Favor de ponerte en contacto con el administrador.",
      });
    }
  };

  return (
    <>
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
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="font-bold">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar APK
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Contraseña Requerida</DialogTitle>
                    <DialogDescription>
                      Introduce la contraseña para iniciar la descarga.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="password" className="text-right">
                        Contraseña
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                        onKeyDown={(e) => e.key === 'Enter' && handleDownload()}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDownload}>Confirmar y Descargar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Hidden link to trigger the download */}
      <a ref={downloadLinkRef} href={APK_URL} download style={{ display: 'none' }}>Download</a>
    </>
  );
}

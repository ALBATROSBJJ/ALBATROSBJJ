import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-black tracking-tighter">Únete al Campamento</CardTitle>
          <CardDescription>Crea tu perfil de atleta para empezar a dominar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="name">Nombre de Atleta</Label>
                <Input id="name" placeholder="Tu Nombre de Guerra" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="atleta@email.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full font-bold">
              Crear Cuenta
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline text-primary font-bold">
              Inicia Sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { doc, serverTimestamp } from "firebase/firestore";
import type { AuthError } from "firebase/auth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from "@/firebase";
import { initiateEmailSignUp } from "@/firebase/non-blocking-login";
import { Home } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Por favor, introduce un email válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningUp, setIsSigningUp] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  // Create user profile document after successful signup and auth state change
  useEffect(() => {
    if (isSigningUp && user && firestore) {
      const { email } = form.getValues();
      const name = form.getValues().name;
      const [firstName, ...lastName] = name.split(' ');

      const userProfileRef = doc(firestore, `perfiles/${user.uid}`);
      const userProfileData = {
        id: user.uid,
        email: email,
        firstName: firstName || "",
        lastName: lastName.join(' ') || "",
        age: 0,
        gender: "male",
        heightCm: 0,
        weightKg: 0,
        activityLevel: 1.2,
        athleticDiscipline: "MMA",
        goal: "maintain",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      setDocumentNonBlocking(userProfileRef, userProfileData, { merge: false });
      
      setIsSigningUp(false);
      // The other effect will handle redirection.
    }
  }, [isSigningUp, user, firestore, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSigningUp(true);
    initiateEmailSignUp(auth, values.email, values.password, (error: AuthError) => {
      let description = "Ocurrió un error inesperado. Inténtalo de nuevo.";
      if (error.code === 'auth/email-already-in-use') {
        description = "Este email ya está en uso. Prueba a iniciar sesión.";
      }
      toast({
        variant: "destructive",
        title: "Error de Registro",
        description,
      });
      setIsSigningUp(false);
    });
  };

  if (isUserLoading || user) {
    return <div className="flex items-center justify-center min-h-screen"></div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-card">
      <Link href="/" className="absolute top-4 left-4">
        <Button variant="outline"><Home className="mr-2 h-4 w-4"/>Volver al Inicio</Button>
      </Link>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-black tracking-tighter">Únete al Campamento</CardTitle>
          <CardDescription>Crea tu perfil de atleta para empezar a dominar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="name">Nombre de Atleta</FormLabel>
                    <FormControl>
                      <Input id="name" placeholder="Tu Nombre de Guerra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="atleta@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="grid gap-2">
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full font-bold" disabled={form.formState.isSubmitting || isSigningUp}>
                {isSigningUp ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          </Form>
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

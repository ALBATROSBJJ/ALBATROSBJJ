"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUfcWeightCategory } from '@/lib/ufc';
import { Separator } from '@/components/ui/separator';

export default function PerfilPage() {
  const [biometrics, setBiometrics] = useState({
    name: 'Atleta de Élite',
    email: 'atleta@albatros.dev',
    weight: 84,
    height: 180,
    age: 28,
    gender: 'male',
  });

  const weightCategory = getUfcWeightCategory(biometrics.weight);

  return (
    <div className="p-4 md:p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-black tracking-tighter">Perfil Guerrero</h1>
        <p className="text-muted-foreground">Tus datos, tu identidad de combate.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Datos Biométricos</CardTitle>
              <CardDescription>Mantén tu información actualizada para cálculos precisos.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre de Atleta</Label>
                  <Input id="name" defaultValue={biometrics.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={biometrics.email} readOnly />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input id="weight" type="number" defaultValue={biometrics.weight} onChange={(e) => setBiometrics(prev => ({...prev, weight: Number(e.target.value)}))}/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input id="height" type="number" defaultValue={biometrics.height} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Edad</Label>
                  <Input id="age" type="number" defaultValue={biometrics.age} />
                </div>
              </div>

               <div className="space-y-2">
                <Label>Sexo</Label>
                <RadioGroup defaultValue={biometrics.gender} className="flex space-x-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Femenino</Label>
                  </div>
                </RadioGroup>
              </div>

            </CardContent>
            <CardContent>
                 <Button className="font-bold">Guardar Cambios</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="font-black tracking-tighter">Categoría de Peso</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-4xl font-black text-primary tracking-tighter">{weightCategory.split(' (')[0]}</p>
                <p className="text-muted-foreground">{weightCategory.split(' (')[1].replace(')','')}</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Zona de Peligro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button variant="outline" className="w-full">Cambiar Contraseña</Button>
               <Button variant="destructive" className="w-full">Eliminar Cuenta</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

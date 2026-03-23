'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Phone, ChevronsRight, Flame, HeartPulse, BrainCircuit } from 'lucide-react';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'inicio', name: 'Inicio' },
  { id: 'conocenos', name: 'Conócenos' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'productos', name: 'Productos' },
  { id: 'contacto', name: 'Contacto' },
];

export default function WelcomePage() {
  const [activeSection, setActiveSection] = useState('inicio');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      {/* Pill Navigation */}
      <nav className="fixed top-1/2 right-4 -translate-y-1/2 z-50">
        <div className="flex flex-col items-center gap-3 bg-card/50 backdrop-blur-sm p-2 rounded-full border">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center"
              aria-label={`Ir a ${section.name}`}
            >
              <div
                className={cn(
                  'h-3 w-3 rounded-full bg-muted-foreground/50 transition-all duration-300',
                  activeSection === section.id ? 'bg-primary scale-150' : 'group-hover:bg-primary/80'
                )}
              />
              <span className="absolute right-full mr-3 px-2 py-1 bg-card border rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {section.name}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Header */}
       <header className="fixed top-0 left-0 right-0 z-40 bg-gray-900/60 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Logo />
          <Button asChild>
            <Link href="/login">
              Acceso Atletas <ChevronsRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="scroll-mt-20">
        {/* Section: Inicio */}
        <section
          id="inicio"
          ref={(el) => (sectionRefs.current[0] = el)}
          className="h-screen flex items-center justify-center relative overflow-hidden"
        >
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Luchador preparándose para el combate"
            data-ai-hint="fighter training"
            fill
            className="object-cover z-0"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white p-4">
            <h1 className="font-headline text-6xl md:text-8xl tracking-wider text-primary">ALBATROS</h1>
            <p className="mt-4 text-xl md:text-2xl font-light max-w-2xl mx-auto">
              Donde la ciencia y el combate se encuentran. Nutrición táctica para atletas de élite.
            </p>
            <Button size="lg" className="mt-8 font-bold text-lg" onClick={() => scrollToSection('conocenos')}>
              Descubre Más
            </Button>
          </div>
        </section>

        {/* Section: Conócenos */}
        <section
          id="conocenos"
          ref={(el) => (sectionRefs.current[1] = el)}
          className="min-h-screen flex items-center py-20"
        >
          <div className="container mx-auto grid md:grid-cols-1 gap-12 items-center px-4">
            <div className="space-y-6 md:text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Nuestra Misión: <span className="text-primary">Forjar Campeones</span></h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                En Albatros, no creemos en las casualidades. Creemos en la preparación implacable, la disciplina y la ciencia aplicada al rendimiento. Somos un equipo de nutricionistas, entrenadores y ex-atletas dedicados a una sola cosa: llevar tu potencial al límite.
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nuestra filosofía es simple: cada gramo de comida es una herramienta, cada entrenamiento es una misión y cada día es una oportunidad para ser más letal. Fusionamos la última tecnología en análisis biométrico con la experiencia real del combate para crear sistemas nutricionales que construyen máquinas de pelear.
              </p>
            </div>
          </div>
        </section>
        
        {/* Section: Servicios */}
        <section
          id="servicios"
          ref={(el) => (sectionRefs.current[2] = el)}
          className="min-h-screen flex items-center bg-secondary py-20"
        >
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Nuestros <span className="text-primary">Servicios de Élite</span></h2>
                  <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Arsenal completo para tu preparación. No dejamos nada al azar.</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                  <Card className="p-8 text-center flex flex-col items-center">
                    <Flame className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Planes Nutricionales Tácticos</h3>
                    <p className="text-muted-foreground">Dietas personalizadas basadas en tu biometría, disciplina y objetivos. Máxima eficiencia energética y recuperación.</p>
                  </Card>
                  <Card className="p-8 text-center flex flex-col items-center">
                    <HeartPulse className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Seguimiento Biométrico Avanzado</h3>
                    <p className="text-muted-foreground">Análisis de composición corporal, metabolismo y marcadores de rendimiento para ajustes precisos y en tiempo real.</p>
                  </Card>
                   <Card className="p-8 text-center flex flex-col items-center">
                    <BrainCircuit className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Consultoría de Rendimiento</h3>
                    <p className="text-muted-foreground">Asesoramiento uno a uno para estrategias de corte de peso, picos de rendimiento y suplementación estratégica.</p>
                  </Card>
              </div>
          </div>
        </section>

        {/* Section: Productos */}
        <section
          id="productos"
          ref={(el) => (sectionRefs.current[3] = el)}
          className="min-h-screen flex items-center py-20"
        >
           <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Equipamiento y <span className="text-primary">Suplementación</span></h2>
                   <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Herramientas y combustible de grado profesional. Solo lo mejor.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card className="group overflow-hidden">
                      <Image src="https://picsum.photos/seed/protein/400/300" data-ai-hint="protein powder" alt="Proteína" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Proteína Isolatada</h3>
                          <p className="text-muted-foreground text-sm mt-1">Recuperación muscular de alta velocidad.</p>
                          <p className="text-primary font-bold text-lg mt-2">$1,200 MXN</p>
                      </CardContent>
                  </Card>
                   <Card className="group overflow-hidden">
                      <Image src="https://picsum.photos/seed/creatine/400/300" data-ai-hint="creatine supplement" alt="Creatina" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Creatina Monohidratada</h3>
                          <p className="text-muted-foreground text-sm mt-1">Potencia y fuerza explosiva garantizadas.</p>
                          <p className="text-primary font-bold text-lg mt-2">$800 MXN</p>
                      </CardContent>
                  </Card>
                   <Card className="group overflow-hidden">
                      <Image src="https://picsum.photos/seed/gloves/400/300" data-ai-hint="boxing gloves" alt="Guantes" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Guantes de Sparring</h3>
                          <p className="text-muted-foreground text-sm mt-1">Protección y durabilidad para el combate diario.</p>
                          <p className="text-primary font-bold text-lg mt-2">$2,500 MXN</p>
                      </CardContent>
                  </Card>
                  <Card className="group overflow-hidden">
                      <Image src="https://picsum.photos/seed/rashguard/400/300" data-ai-hint="rashguard apparel" alt="Rashguard" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Rashguard Táctico</h3>
                          <p className="text-muted-foreground text-sm mt-1">Compresión y movilidad para grappling.</p>
                          <p className="text-primary font-bold text-lg mt-2">$950 MXN</p>
                      </CardContent>
                  </Card>
              </div>
           </div>
        </section>

        {/* Section: Contacto */}
        <footer
          id="contacto"
          ref={(el) => (sectionRefs.current[4] = el)}
          className="bg-card py-20"
        >
          <div className="container mx-auto text-center px-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Establecer <span className="text-primary">Contacto</span></h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">¿Listo para el siguiente nivel? Aquí nos encuentras. No pierdas nuestro tiempo.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Ubicación</h3>
                        <p className="text-muted-foreground">Calle 114, Cd. Caulcel Supermanzana 2,
                        <br/>Cp: 97314. Merida Yucatán</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg">
                        <Phone className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Teléfono</h3>
                        <p className="text-muted-foreground">+52 55 1234 5678</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg">
                        <Mail className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Email</h3>
                        <p className="text-muted-foreground">contacto@albatros.mma</p>
                    </div>
                </div>
            </div>
             <div className="mt-16 border-t pt-8 text-sm text-muted-foreground">
                <p>&copy; {new Date().getFullYear()} Albatros Performance. Todos los derechos reservados. Forjado en combate.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  { id: 'rendimiento', name: 'Rendimiento' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'contacto', name: 'Contacto' },
];

export default function WelcomePage() {
  const [activeSection, setActiveSection] = useState('inicio');
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const navRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const initialScrollTop = useRef(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Intersection Observer to set active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0.5 }
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

  const scrollToSection = useCallback((id: string, behavior: 'smooth' | 'auto' = 'smooth') => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior, block: 'center' });
  }, []);

  const snapToSection = useCallback(() => {
    const currentScroll = window.scrollY + window.innerHeight / 2;
    let closestSectionId = sections[0].id;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const sectionTop = ref.offsetTop;
        const sectionHeight = ref.offsetHeight;
        const sectionCenter = sectionTop + sectionHeight / 2;
        const distance = Math.abs(currentScroll - sectionCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestSectionId = sections[index].id;
        }
      }
    });
    scrollToSection(closestSectionId, 'smooth');
  }, [scrollToSection]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    initialScrollTop.current = window.scrollY;
    setIsInteracting(true);
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaY = moveEvent.clientY - startY.current;
      const dragMultiplier = 3; // Adjust drag sensitivity
      window.scrollTo(0, initialScrollTop.current - deltaY * dragMultiplier);
    };

    const onMouseUp = () => {
      isDragging.current = false;
      setIsInteracting(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      
      snapToSection();
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startY.current = e.touches[0].clientY;
    initialScrollTop.current = window.scrollY;
    setIsInteracting(true);

    const onTouchMove = (moveEvent: TouchEvent) => {
        if (!isDragging.current) return;
        const deltaY = moveEvent.touches[0].clientY - startY.current;
        const dragMultiplier = 3;
        window.scrollTo(0, initialScrollTop.current - deltaY * dragMultiplier);
    };

    const onTouchEnd = () => {
        isDragging.current = false;
        setIsInteracting(false);
        
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('touchend', onTouchEnd);
        
        snapToSection();
    };

    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
  };

  return (
    <div className="relative bg-background text-foreground min-h-screen">
      {/* Pill Navigation */}
      <nav 
        className={cn(
            "fixed top-1/2 right-4 -translate-y-1/2 z-50 flex transition-all duration-300",
            isInteracting ? "opacity-100 scale-105" : "opacity-70"
        )}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => { if(!isDragging.current) setIsInteracting(false); }}
      >
        <div 
          ref={navRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="flex flex-col items-center gap-3 bg-black/30 backdrop-blur-lg p-2 rounded-full border border-neutral-700 cursor-grab active:cursor-grabbing"
        >
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
              <span className="absolute right-full mr-3 px-2 py-1 bg-card border rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
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
            src="/prox.png"
            alt="Banner de Albatros"
            fill
            className="object-cover z-0"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center text-white p-4">
            <h1 className="font-headline text-5xl md:text-8xl tracking-wider text-primary">ALBATROS</h1>
            <p className="mt-4 text-lg md:text-2xl font-light max-w-2xl mx-auto">
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
          className="min-h-screen flex items-center py-20 px-4"
        >
          <div className="container mx-auto">
            <div className="space-y-6 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">Nuestra Misión: <span className="text-primary">Forjar Campeones</span></h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                En Albatros, no creemos en las casualidades. Creemos en la preparación implacable, la disciplina y la ciencia aplicada al rendimiento. Somos un equipo de nutricionistas, entrenadores y ex-atletas dedicados a una sola cosa: llevar tu potencial al límite.
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Nuestra filosofía es simple: cada gramo de comida es una herramienta, cada entrenamiento es una misión y cada día es una oportunidad para ser más letal. Fusionamos la última tecnología en análisis biométrico con la experiencia real del combate para crear sistemas nutricionales que construyen máquinas de pelear.
              </p>
            </div>
          </div>
        </section>
        
        {/* Section: Rendimiento */}
        <section
          id="rendimiento"
          ref={(el) => (sectionRefs.current[2] = el)}
          className="min-h-screen flex items-center py-20 relative"
        >
          <Image
            src="/prox.png"
            alt="Nuestro Rendimiento"
            fill
            className="object-cover z-0"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter text-white">Nuestro <span className="text-primary">Rendimiento</span></h2>
                  <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">Arsenal completo para tu preparación. No dejamos nada al azar.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="p-8 text-center flex flex-col items-center bg-card/70 backdrop-blur-sm border-white/10">
                    <Flame className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Planes Nutricionales Tácticos</h3>
                    <p className="text-muted-foreground">Dietas personalizadas basadas en tu biometría, disciplina y objetivos. Máxima eficiencia energética y recuperación.</p>
                  </Card>
                  <Card className="p-8 text-center flex flex-col items-center bg-card/70 backdrop-blur-sm border-white/10">
                    <HeartPulse className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Seguimiento Biométrico Avanzado</h3>
                    <p className="text-muted-foreground">Análisis de composición corporal, metabolismo y marcadores de rendimiento para ajustes precisos y en tiempo real.</p>
                  </Card>
                   <Card className="p-8 text-center flex flex-col items-center bg-card/70 backdrop-blur-sm border-white/10">
                    <BrainCircuit className="h-12 w-12 text-primary mb-4"/>
                    <h3 className="text-2xl font-bold mb-2">Consultoría de Rendimiento</h3>
                    <p className="text-muted-foreground">Asesoramiento uno a uno para estrategias de corte de peso, picos de rendimiento y suplementación estratégica.</p>
                  </Card>
              </div>
          </div>
        </section>

        {/* Section: Servicios */}
        <section
          id="servicios"
          ref={(el) => (sectionRefs.current[3] = el)}
          className="min-h-screen flex items-center py-20"
        >
           <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">Nuestros <span className="text-primary">Servicios</span></h2>
                   <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Nuestro espacio multi disciplinar y complementario.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="group overflow-hidden">
                      <Image src="/bjj.png" data-ai-hint="jiu-jitsu" alt="Jiu Jitsu Brasileño" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Jiu Jitsu Brasileño</h3>
                          <p className="text-muted-foreground text-sm mt-1">Arte marcial enfocado en el control y la sumisión en el suelo, donde la técnica supera a la fuerza.</p>
                          <p className="text-primary font-bold text-lg mt-2">$600 MXN</p>
                      </CardContent>
                  </Card>
                   <Card className="group overflow-hidden">
                      <Image src="/kick.png" data-ai-hint="creatine supplement" alt="Kick Boxing" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Kick Boxing</h3>
                          <p className="text-muted-foreground text-sm mt-1">Entrenamiento de combate que combina golpes de puño y patadas.</p>
                          <p className="text-primary font-bold text-lg mt-2">$600 MXN</p>
                      </CardContent>
                  </Card>
                  <Card className="group overflow-hidden">
                      <Image src="/combo.png" alt="Promoción" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">PROMOCION</h3>
                          <p className="text-muted-foreground text-sm mt-1">Jiu Jitsu y Kick Boxing; complementandose como una.</p>
                          <p className="text-primary font-bold text-lg mt-2">$900 MXN</p>
                      </CardContent>
                  </Card>
                   <Card className="group overflow-hidden">
                      <Image src="/prox.png" alt="Proximamente" width={400} height={300} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <CardContent className="p-4">
                          <h3 className="text-xl font-bold">Proximamente</h3>
                          <p className="text-muted-foreground text-sm mt-1">Muy pronto.</p>
                          <p className="text-primary font-bold text-lg mt-2">ESTAR ATENTOS...</p>
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
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter">Establecer <span className="text-primary">Contacto</span></h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">¿Listo para el siguiente nivel? Aquí nos encuentras. No pierdas nuestro tiempo.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                <a href="https://maps.app.goo.gl/BMvCRRp3eTGmjU8K9" target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row items-center gap-4 p-4 -m-4 rounded-lg hover:bg-accent transition-colors">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg flex-shrink-0">
                        <MapPin className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Ubicación</h3>
                        <p className="text-muted-foreground">Calle 114, Cd. Caulcel Supermanzana 2,
                        <br/>Cp: 97314. Merida Yucatán</p>
                    </div>
                </a>
                <a href="https://wa.me/message/MLU5C2HUNOCEN1" target="_blank" rel="noopener noreferrer" className="flex flex-col md:flex-row items-center gap-4 p-4 -m-4 rounded-lg hover:bg-accent transition-colors">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg flex-shrink-0">
                        <Phone className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Teléfono</h3>
                        <p className="text-muted-foreground">+52 990 144 3886</p>
                    </div>
                </a>
                 <div className="flex flex-col md:flex-row items-center gap-4 p-4 -m-4 rounded-lg hover:bg-accent transition-colors">
                    <div className="bg-primary/10 text-primary p-4 rounded-lg flex-shrink-0">
                        <Mail className="h-8 w-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Email</h3>
                        <p className="text-muted-foreground">administrador@albatrosbjj.com</p>
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

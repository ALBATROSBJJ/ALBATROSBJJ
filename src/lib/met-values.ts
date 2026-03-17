export type Activity = {
  name: string;
  met: number;
};

export const activities: Activity[] = [
  { name: 'Caminar (moderado)', met: 3.5 },
  { name: 'Correr (moderado)', met: 8.0 },
  { name: 'Subir escaleras', met: 8.8 },
  { name: 'Levantamiento de pesas (general)', met: 5.0 },
  { name: 'Entrenamiento HIIT', met: 8.0 },
  { name: 'Cardio (general)', met: 7.3 },
  { name: 'Taekwondo', met: 10.3 },
  { name: 'Jiu-Jitsu Brasileño', met: 10.0 },
  { name: 'Kickboxing', met: 10.3 },
  { name: 'Sparring (general)', met: 7.8 },
  { name: 'Entrenamiento técnico (drills)', met: 5.0 },
];

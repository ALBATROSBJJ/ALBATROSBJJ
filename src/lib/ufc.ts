export const getUfcWeightCategory = (weightKg: number): string => {
  if (weightKg <= 56.7) return 'Flyweight (Peso Mosca)';
  if (weightKg <= 61.2) return 'Bantamweight (Peso Gallo)';
  if (weightKg <= 65.8) return 'Featherweight (Peso Pluma)';
  if (weightKg <= 70.3) return 'Lightweight (Peso Ligero)';
  if (weightKg <= 77.1) return 'Welterweight (Peso Wélter)';
  if (weightKg <= 83.9) return 'Middleweight (Peso Mediano)';
  if (weightKg <= 93.0) return 'Light Heavyweight (Peso Semipesado)';
  if (weightKg <= 120.2) return 'Heavyweight (Peso Pesado)';
  return 'Super Heavyweight (Fuera de categoría)';
};

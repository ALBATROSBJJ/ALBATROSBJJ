'use server';

import {
  generateTacticalRecipes,
  type GenerateTacticalRecipesInput,
  type GenerateTacticalRecipesOutput,
} from '@/ai/flows/generate-tactical-recipes';

type ActionResult = {
  recipes: GenerateTacticalRecipesOutput | null;
  error?: string;
};

export async function getTacticalRecipes(input: GenerateTacticalRecipesInput): Promise<ActionResult> {
  try {
    const recipes = await generateTacticalRecipes(input);
    return { recipes };
  } catch (e: any) {
    console.error('Error in getTacticalRecipes server action:', e);
    return { recipes: null, error: 'No se pudieron generar las recetas debido a un error del servidor.' };
  }
}

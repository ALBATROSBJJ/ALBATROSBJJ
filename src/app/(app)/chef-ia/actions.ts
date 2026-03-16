"use server";

import { generateTacticalRecipes, type GenerateTacticalRecipesInput, type GenerateTacticalRecipesOutput } from "@/ai/flows/generate-tactical-recipes";
import { z } from "zod";

const inputSchema = z.object({
  weightKg: z.coerce.number().positive(),
  calorieTarget: z.coerce.number().positive(),
  proteinTargetG: z.coerce.number().positive(),
  fatTargetG: z.coerce.number().positive(),
  carbTargetG: z.coerce.number().positive(),
  dietaryRestrictions: z.array(z.string()).optional(),
  mealType: z.string().optional(),
});

export async function getTacticalRecipes(data: GenerateTacticalRecipesInput): Promise<{ recipes: GenerateTacticalRecipesOutput | null, error: string | null }> {
  const parsed = inputSchema.safeParse(data);
  if (!parsed.success) {
    return { recipes: null, error: "Invalid input data." };
  }

  try {
    const recipes = await generateTacticalRecipes(parsed.data);
    return { recipes, error: null };
  } catch (e) {
    console.error(e);
    return { recipes: null, error: "Failed to generate recipes. The AI coach is busy. Try again later." };
  }
}

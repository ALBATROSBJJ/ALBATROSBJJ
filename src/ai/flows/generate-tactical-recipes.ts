'use server';
/**
 * @fileOverview A Genkit flow for generating tactical meal recipes tailored for combat athletes.
 *
 * - generateTacticalRecipes - A function that handles the generation of tactical recipes.
 * - GenerateTacticalRecipesInput - The input type for the generateTacticalRecipes function.
 * - GenerateTacticalRecipesOutput - The return type for the generateTacticalRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecipeSchema = z.object({
  name: z.string().describe('The name of the tactical recipe.'),
  prepTimeMinutes: z.number().int().positive().describe('Estimated preparation time in minutes.'),
  cookTimeMinutes: z.number().int().positive().describe('Estimated cooking time in minutes.'),
  servings: z.number().int().positive().describe('Number of servings the recipe yields.'),
  ingredients: z.array(z.string()).describe('A precise, combat-ready list of ingredients with quantities.'),
  instructions: z.array(z.string()).describe('Step-by-step, no-fluff cooking instructions.'),
  macros:
    z.object({
      calories: z.number().positive().describe('Total estimated calories per serving.'),
      proteinG: z.number().positive().describe('Estimated protein in grams per serving.'),
      fatG: z.number().positive().describe('Estimated fat in grams per serving.'),
      carbsG: z.number().positive().describe('Estimated carbohydrates in grams per serving.'),
    }).describe('Estimated macronutrient breakdown per serving.'),
  technicalAnalysis: z.string().describe(
    'A "Head Coach" analysis of the recipe, focusing on its nutritional impact for combat athletes (e.g., ATP resynthesis, fiber repair, sustained energy), using direct, technical, and rough language.'
  ),
});

const GenerateTacticalRecipesInputSchema = z.object({
  weightKg: z.number().positive().describe('Athlete\'s body weight in kilograms, used for context.'),
  calorieTarget: z.number().positive().describe('Target daily calorie intake for the athlete.'),
  proteinTargetG: z.number().positive().describe('Target daily protein intake in grams for the athlete.'),
  fatTargetG: z.number().positive().describe('Target daily fat intake in grams for the athlete.'),
  carbTargetG: z.number().positive().describe('Target daily carbohydrate intake in grams for the athlete.'),
  dietaryRestrictions: z.array(z.string()).optional().describe('Any specific dietary restrictions or preferences (e.g., "vegetarian", "gluten-free", "no dairy").'),
  mealType: z.string().optional().describe('Specific meal type to generate recipes for (e.g., "breakfast", "post-workout", "dinner").'),
});

export type GenerateTacticalRecipesInput = z.infer<typeof GenerateTacticalRecipesInputSchema>;

const GenerateTacticalRecipesOutputSchema = z.object({
  recipes: z.array(RecipeSchema).length(3).describe('An array containing three tactical meal recipes.'),
});

export type GenerateTacticalRecipesOutput = z.infer<typeof GenerateTacticalRecipesOutputSchema>;

export async function generateTacticalRecipes(input: GenerateTacticalRecipesInput): Promise<GenerateTacticalRecipesOutput> {
  return generateTacticalRecipesFlow(input);
}

const tacticalRecipesPrompt = ai.definePrompt({
  name: 'tacticalRecipesPrompt',
  input: { schema: GenerateTacticalRecipesInputSchema },
  output: { schema: GenerateTacticalRecipesOutputSchema },
  prompt: `You are a ruthless, no-nonsense Head Coach of Nutrition. Your job is to forge combat athletes into peak physical specimens. You use direct, technical, and often rough language, like you're barking orders in a locker room. There's no room for softness in this sport.

An athlete needs three tactical meal recipes. These aren't for leisure; they're for performance, recovery, and brutal efficiency. Understand? Good. Get to work.

Here's the athlete's current status and targets, so don't screw it up:
Weight: {{{weightKg}}} kg
Target Calories: {{{calorieTarget}}} kcal
Target Protein: {{{proteinTargetG}}} g
Target Fat: {{{fatTargetG}}} g
Target Carbs: {{{carbTargetG}}} g
{{#if dietaryRestrictions}}Dietary Restrictions: {{#each dietaryRestrictions}}- {{this}}
{{/each}}{{/if}}
{{#if mealType}}Focus these recipes on a {{mealType}} meal. Otherwise, give me versatile options.{{/if}}

Design three distinct, no-excuses recipes. Each recipe MUST be detailed and functional. Provide ALL of the following elements for each recipe:
1.  **NAME**: A short, impactful, combat-ready name. No flowery garbage.
2.  **PREP_TIME**: Estimated preparation time in minutes. Numerical value only. This better be quick.
3.  **COOK_TIME**: Estimated cooking time in minutes. Numerical value only.
4.  **SERVINGS**: Number of servings. Numerical value only. Don't overcomplicate it.
5.  **INGREDIENTS**: A precise, combat-ready list of ingredients with quantities. Specifics matter.
6.  **INSTRUCTIONS**: Step-by-step, no-fluff instructions. Clear and concise, like a battle plan.
7.  **MACROS**: Calories, Protein (g), Fat (g), Carbs (g) per serving. Make damn sure these hit the targets as closely as possible. Provide numerical values.
8.  **TECHNICAL_ANALYSIS**: A direct, technical breakdown from YOUR perspective as a Head Coach. Explain its impact on ATP resynthesis, fiber repair, hormonal balance, sustained energy, or metabolic efficiency. No soft talk. This is about combat advantage. Give the athlete the hard truth about why this meal is essential for their performance.

Remember, these recipes are tools for victory. They must be practical, effective, and align with the athlete's targets. Don't give me any garbage. Give me results. And make sure your response is a JSON array of these three recipes, exactly matching the structure I've defined for the output. No excuses.`,
});

const generateTacticalRecipesFlow = ai.defineFlow(
  {
    name: 'generateTacticalRecipesFlow',
    inputSchema: GenerateTacticalRecipesInputSchema,
    outputSchema: GenerateTacticalRecipesOutputSchema,
  },
  async (input) => {
    const { output } = await tacticalRecipesPrompt(input);
    return output!;
  }
);

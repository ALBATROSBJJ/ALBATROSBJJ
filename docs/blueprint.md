# **App Name**: ALBATROS | Smart Nutrition Tracker

## Core Features:

- User Authentication: Secure sign-up and login for athletes using Email/Password authentication.
- Athlete Profile Management: Allows athletes to manage biometrics, define personal goals, and view automatic UFC weight category classification. Personal data is stored securely in Firestore at '/perfiles/{userId}'.
- Food Database Search: Enables searching and displaying food nutrition data from a publicly accessible Firestore 'alimentos' collection.
- Biometric Calculators: Provides precision calculations for Basal Metabolic Rate (BMR), Total Daily Energy Expenditure (TDEE), Combat Macros (protein, fats, carbs), and sport-specific energy expenditure (MET values).
- AI Tactical Recipe Generator: A tool that leverages Google Gemini 1.5 Flash via Genkit to generate 3 detailed recipes with ingredients, steps, macros, and 'Technical Analysis' from the perspective of a 'Head Coach de Nutrición'.
- Nutrition and Training Logbook: Allows athletes to log daily food intake and training activities, storing data in Firestore for historical tracking and performance analysis.
- Weekly Performance Dashboard: Visualizes key performance indicators like biometric trends, macro adherence, and energy balance over a weekly period, inspired by a UFC aesthetic.

## Style Guidelines:

- Background color: Deep black (#0D0D0D) providing a high-contrast and aggressive foundation, suitable for a dark theme inspired by the UFC combat environment.
- Primary color: Vibrant combat red (#D20A0A) used for crucial highlights and interactive elements, conveying energy and intensity.
- Foreground color: Crisp white/silver (#FAFAFA) ensuring maximum legibility for text and primary UI elements against the dark background.
- Secondary color: Dark grey (#262626) for subtle depth and differentiation of secondary UI components, maintaining a professional and technical feel.
- Accent color: Pure white (#FFFFFF) for additional emphasis and visual breaks, offering absolute contrast against all other colors.
- All text uses 'Inter', a modern sans-serif font. Text will feature extensive use of `font-black`, `italic`, and `tracking-tighter` to evoke a professional, technical, and high-impact visual style. Note: currently only Google Fonts are supported.
- Design features 'sharp borders' with a `--radius: 0.25rem`, avoiding rounded elements to align with an aggressive, technical aesthetic.
- Icons should be angular, sharp, and minimalist to reflect the aggressive and professional 'combat tech' theme. Icons from Lucide-React are well-suited.
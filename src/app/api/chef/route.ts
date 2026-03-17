import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { calorias, proteina, carbs, grasas, tipo } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Eres un nutricionista deportivo profesional.

Responde únicamente en español, de forma clara y natural.

Genera un plan alimenticio con:
- Calorías: ${calorias}
- Proteína: ${proteina}g
- Carbohidratos: ${carbs}g
- Grasas: ${grasas}g
- Tipo de comida: ${tipo}

Usa alimentos comunes en México.
Organiza el resultado por comidas (desayuno, comida, cena).
Incluye cantidades aproximadas en gramos. Responde SOLO en español. No uses inglés.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ result: text });

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error generando plan" }, { status: 500 });
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // 🔐 Validar API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Falta GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const body = await req.json();
    const { calorias, proteina, carbs, grasas, tipo } = body;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", // 🔥 mejor versión
    });

    const prompt = `
Eres un nutricionista deportivo profesional.

Responde SIEMPRE en español.
NO uses inglés en ninguna parte.

Genera un plan alimenticio con:
- Calorías: ${calorias}
- Proteína: ${proteina}g
- Carbohidratos: ${carbs}g
- Grasas: ${grasas}g
- Tipo de comida: ${tipo}

Usa alimentos comunes en México.
Organiza el resultado por comidas (desayuno, comida, cena).
Incluye cantidades aproximadas en gramos.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return Response.json({ result: text });

  } catch (error) {
    console.error("ERROR GEMINI:", error);

    return Response.json(
      { error: "Error generando plan" },
      { status: 500 }
    );
  }
}
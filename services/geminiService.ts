
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";
import { Scenario } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchScenario = async (theme: string, articles: string): Promise<Scenario> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a scenario for the theme: ${theme} (${articles}).`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            context: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  isCorrect: { type: Type.BOOLEAN },
                  constitutionalReference: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["text", "isCorrect", "constitutionalReference", "explanation"]
              }
            }
          },
          required: ["title", "context", "choices"]
        }
      },
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as Scenario;
  } catch (error) {
    console.error("Error fetching scenario:", error);
    // Fallback scenario in case of API error
    return {
      title: "The Silent Barrier",
      context: "A local library refuses entry to a specific group citing 'internal protocols'. You are the local observer.",
      choices: [
        {
          text: "Challenge the protocol citing the Right to Equality.",
          isCorrect: true,
          constitutionalReference: "Article 15",
          explanation: "Discrimination on grounds of religion, race, caste, sex or place of birth is prohibited in public spaces."
        },
        {
          text: "Accept the rules as the library is a private-managed entity.",
          isCorrect: false,
          constitutionalReference: "Article 15(2)",
          explanation: "Public access spaces cannot deny entry based on discriminatory criteria even if managed locally."
        },
        {
          text: "Start an uncoordinated protest outside the gate.",
          isCorrect: false,
          constitutionalReference: "Article 19",
          explanation: "While assembly is a right, it must be peaceful and without arms, and systemic legal challenges are preferred first."
        }
      ]
    };
  }
};

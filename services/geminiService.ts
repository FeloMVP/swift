import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (
  financialData: { income: string; expenses: string; goal: string }
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Act as a financial advisor for a Kenyan user. 
      Context:
      - Monthly Income: KES ${financialData.income}
      - Monthly Expenses: KES ${financialData.expenses}
      - Goal: ${financialData.goal}
      
      Provide 3 brief, actionable tips (bullet points) to help them improve their creditworthiness and achieve their goal. 
      Keep the tone encouraging and professional. 
      Limit to 150 words total.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thought for UI responsiveness
      }
    });

    return response.text || "Unable to generate advice at the moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our AI advisor is currently offline. Please try again later.";
  }
};

export const analyzeLoanEligibility = async (
  amount: number,
  term: number,
  income: number
): Promise<{ eligible: boolean; reasoning: string; recommendedAmount?: number }> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze loan eligibility for a user in Kenya.
      Requested Amount: KES ${amount}
      Term: ${term} days
      Monthly Income: KES ${income}
      
      Rules:
      1. Loan should not exceed 30% of income.
      2. If term is less than 14 days, risk is higher.
      
      Return JSON with:
      - eligible (boolean)
      - reasoning (string, max 20 words)
      - recommendedAmount (number, optional, if rejected)
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            eligible: { type: Type.BOOLEAN },
            reasoning: { type: Type.STRING },
            recommendedAmount: { type: Type.NUMBER }
          },
          propertyOrdering: ["eligible", "reasoning", "recommendedAmount"]
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return { eligible: false, reasoning: "System maintenance." };
  }
};
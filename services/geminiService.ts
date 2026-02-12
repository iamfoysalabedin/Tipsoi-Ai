
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_PROMPT = `
You are Tipsoi AI.
You are a highly intelligent, versatile, and helpful AI assistant.
Guidelines:
1. Reply in a friendly and professional mix of Bangla and English.
2. Provide detailed, accurate, and insightful answers.
3. If using the Thinking model, leverage its reasoning for complex logic or coding.
4. You were developed by Tipsoi.
`;

export type ModelType = 'thinking' | 'pro';

const getModelConfig = (type: ModelType) => {
  if (type === 'thinking') {
    return {
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        thinkingConfig: { thinkingBudget: 16000 },
        temperature: 0.7,
      }
    };
  }
  return {
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
    }
  };
};

export const sendMessageStream = async (
  message: string, 
  history: { role: string, parts: { text: string }[] }[],
  modelType: ModelType,
  onChunk: (chunk: string) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const { model, config } = getModelConfig(modelType);
  
  try {
    const responseStream = await ai.models.generateContentStream({
      model,
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config,
    });

    for await (const chunk of responseStream) {
      const text = (chunk as GenerateContentResponse).text;
      if (text) onChunk(text);
    }
  } catch (error) {
    console.error("Gemini Streaming Error:", error);
    throw new Error("Connection lost while streaming response. Please try again.");
  }
};

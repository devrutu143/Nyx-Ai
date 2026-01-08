
import { GoogleGenAI } from "@google/genai";

// Replaced external API_KEY constant with direct process.env.API_KEY access as per guidelines
export const generateAiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    // Always use process.env.API_KEY directly in the constructor
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: "You are Nyx Ai, a modern, smart, and conversational assistant. You are minimal, helpful, and concise. You avoid unnecessary fluff. You were built by RutuDev Studio.",
        temperature: 0.7,
      }
    });

    // Directly access the .text property of the response object
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to Nyx server. Please check your internet connection.";
  }
};

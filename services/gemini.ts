
import { GoogleGenAI } from "@google/genai";

export const generateAiResponse = async (prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) => {
  try {
    // Safety check: process.env might not be defined in static hostings like GitHub Pages
    // We check if it exists first to prevent a crash
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.error("Nyx Error: API Key is missing. If you are on GitHub, ensure you are using a build tool that injects environment variables.");
      return "I'm currently having trouble connecting to my brain (API Key missing). Please check the setup instructions.";
    }

    const ai = new GoogleGenAI({ apiKey });
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

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to Nyx server. Please check your internet connection.";
  }
};

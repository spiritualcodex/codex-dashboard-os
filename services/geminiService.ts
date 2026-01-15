import { GoogleGenAI } from "@google/genai";
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "../types";
import agentRegistry from "../agents.json";

// This looks for the VITE_ prefix specifically
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI(API_KEY);

const SYSTEM_IDENTITY = `You are the NeuralUplink (A03) for the Divine OS. Admin: Rarstar Thirteen El Bey. Council: ${JSON.stringify(agentRegistry.agents)}`;

export const getSoulDecoderInsight = async (input: SoulDecoderInput): Promise<SpiritualIntelligenceResponse> => {
  const model = getAI().getGenerativeModel({ model: "gemini-1.5-pro" });
  const prompt = `EXECUTE SOUL DECODING PROTOCOL for: ${input.name}. Return JSON.`;
  const result = await model.generateContent(prompt);
  return JSON.parse(result.response.text());
};

export const startGeneralChat = async (history: any[], message: string, onChunk: (text: string) => void) => {
  const model = getAI().getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_IDENTITY });
  const result = await model.sendMessageStream(message);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    onChunk(chunkText);
  }
};

// Simplified placeholders for other functions to prevent build errors
export const analyzeVideoContent = async (file: File, prompt: string) => "Feature recalibrating...";
export const generateImage = async (p: string, s: any, a: any) => "";
export const fetchLiveQuoraFeed = async () => [];
export const searchSpiritualMeaning = async (q: string) => ({ summary: "", sources: [] });
export const generateSpiritualDiagram = async (q: string) => "";
export const answerCommunityQuestion = async (q: string) => ({ summary: "", sources: [] });
export const generateContentEngineJob = async (i: string, f: string) => "";
export const animateWithVeo = async (p: string, i: any, a: any, o: any) => "";
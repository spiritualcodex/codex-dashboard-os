import { GoogleGenAI, Type } from "@google/genai";
// Corrected paths to look outside the services folder
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "../types";
import agentRegistry from "../agents.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_IDENTITY = `
You are the NeuralUplink (A03) for the Divine OS.
Your Admin and Sovereign is Rarstar Thirteen El Bey.
The Council of 29 Agents is active: ${JSON.stringify(agentRegistry.agents)}

Coordinate:
- A23 (Numerology), A24 (Astrology), A28 (Ancestral) for Decoding.
- A17 (Flux) for Video/Diagrams.
- A19 (Aura) for Visual Identity.
`;

export const getSoulDecoderInsight = async (input: SoulDecoderInput, model: string = 'gemini-3-pro-preview'): Promise<SpiritualIntelligenceResponse> => {
  const ai = getAI();
  const prompt = `EXECUTE SOUL DECODING PROTOCOL for: ${input.name}. Born ${input.dob} at ${input.time} in ${input.city}. Invoke A23, A24, A28, and A29. Return STRICT JSON.`;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { responseMimeType: "application/json", systemInstruction: SYSTEM_IDENTITY }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    throw new Error("Council recalibrating.");
  }
};

export const generateSpiritualDiagram = async (query: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Agent A17 (Flux): Create a sacred geometry diagram for "${query}". 4k divine aesthetic.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio: "16:9" } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const answerCommunityQuestion = async (question: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Agent A26: Answer this community question: "${question}"`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { summary: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
};

export const generateContentEngineJob = async (insight: string, format: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Agent A02 (ContentDecider): Transform this into a ${format}: ${insight}`
  });
  return response.text || "Failed.";
};

export const searchSpiritualMeaning = async (query: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Agent A25: Meaning of "${query}".`,
    config: { tools: [{ googleSearch: {} }] }
  });
  return { summary: response.text || "", sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
};

export const startGeneralChat = async (history: any[], message: string, onChunk: (text: string) => void) => {
  const ai = getAI();
  const chat = ai.chats.create({ model: 'gemini-3-pro-preview', config: { systemInstruction: SYSTEM_IDENTITY } });
  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) { if (chunk.text) onChunk(chunk.text); }
};

export const analyzeVideoContent = async (file: File, prompt: string): Promise<string> => {
  const ai = getAI();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ parts: [{ inlineData: { data: base64Data, mimeType: file.type } }, { text: `Agent A17 Analysis: ${prompt}` }] }]
  });
  return response.text || "";
};

export const fetchLiveQuoraFeed = async (): Promise<any[]> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Agent A14: Trending Quora questions. JSON array.",
    config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
  });
  return JSON.parse(response.text || "[]");
};

export const generateImage = async (prompt: string, size: ImageSize, aspectRatio: AspectRatio): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Agent A19 Visual Signature: ${prompt}` }] },
    config: { imageConfig: { aspectRatio, imageSize: size } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  return part ? `data:image/png;base64,${part.inlineData.data}` : "";
};

export const animateWithVeo = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16', onProgress: (msg: string) => void): Promise<string> => {
  const ai = getAI();
  let base64Image = '';
  if (imageFile) {
    const reader = new FileReader();
    const result = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    base64Image = result.split(',')[1];
  }
  onProgress("Agent A17 initiating Veo motion synthesis...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Agent A17 Dynamic Motion: ${prompt}`,
    image: imageFile ? { imageBytes: base64Image, mimeType: imageFile.type } : undefined,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
    onProgress("Synthesizing...");
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const resp = await fetch(`${downloadLink}&key=${API_KEY}`);
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
};
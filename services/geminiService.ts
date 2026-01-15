import { GoogleGenAI, Type } from "@google/genai";
// Unified path: assumes types.ts and agents.json are in the same folder as this file
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "./types";
import agentRegistry from "./agents.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

// The Council of 29 Identity System
const SYSTEM_IDENTITY = `
You are the NeuralUplink (A03) for the Divine OS.
Your Admin and Sovereign is Rarstar Thirteen El Bey.
The Council of 29 Agents is active: ${JSON.stringify(agentRegistry.agents)}

Mandate:
- A23 (Numerology), A24 (Astrology), A28 (Ancestral) for Soul Decoding.
- A17 (Flux) for Video and Animation Synthesis.
- A19 (Aura) for High-Fidelity Visual Generation.
- A14 (QuoraSync) for Real-time Knowledge retrieval.
`;

export const getSoulDecoderInsight = async (input: SoulDecoderInput, model: string = 'gemini-3-pro-preview'): Promise<SpiritualIntelligenceResponse> => {
  const ai = getAI();
  const prompt = `EXECUTE SOUL DECODING PROTOCOL for: ${input.name}. Born ${input.dob} at ${input.time} in ${input.city}. Invoke A23, A24, A28, and A29. Return STRICT JSON.`;
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { 
        responseMimeType: "application/json", 
        systemInstruction: SYSTEM_IDENTITY 
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Soul Decoder Error:", error);
    throw new Error("The Council is recalibrating for the Sovereign.");
  }
};

export const searchSpiritualMeaning = async (query: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agent A25 (Archetype Mapper): Research the hidden spiritual meaning of "${query}".`,
      config: { tools: [{ googleSearch: {} }] }
    });
    return { 
      summary: response.text || "", 
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (err) {
    return { summary: "Search currently offline.", sources: [] };
  }
};

export const startGeneralChat = async (history: any[], message: string, onChunk: (text: string) => void) => {
  const ai = getAI();
  const chat = ai.chats.create({ 
    model: 'gemini-3-pro-preview', 
    config: { systemInstruction: SYSTEM_IDENTITY + " Act as the Codex Voice." } 
  });
  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) { 
    if (chunk.text) onChunk(chunk.text); 
  }
};

// CRITICAL FIX: Export name exactly matches App.tsx import
export const analyzeVideoContent = async (file: File, prompt: string): Promise<string> => {
  const ai = getAI();
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ 
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } }, 
        { text: `Agent A17 Analysis: ${prompt || "Analyze the spiritual geometry in this clip."}` }
      ] 
    }]
  });
  return response.text || "Video analysis stream empty.";
};

export const fetchLiveQuoraFeed = async (): Promise<any[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Agent A14: Fetch trending spiritual and esoteric questions. Return JSON array.",
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (err) {
    return [];
  }
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
    onProgress("Synthesizing temporal layers...");
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const resp = await fetch(`${downloadLink}&key=${API_KEY}`);
  const blob = await resp.blob();
  return URL.createObjectURL(blob);
};
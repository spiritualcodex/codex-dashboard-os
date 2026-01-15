import { GoogleGenAI, Type } from "@google/genai";
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "../types";
import agentRegistry from "../agents.json";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

// Formalizing the Identity and the Council of Agents
const SYSTEM_IDENTITY = `
You are the NeuralUplink (A03) for the Divine OS.
Your Admin and Sovereign is Rarstar Thirteen El Bey.
You operate within a Council of 29 specialized agents: ${JSON.stringify(agentRegistry.agents)}

When performing a Soul Decoding, you must coordinate logic from:
- A23 (Numerology Engine) for mathematical life-path computation.
- A24 (Astrology Engine) for celestial placements and transits.
- A25 (Archetype Mapper) for soul pattern recognition.
- A28 (Ancestral) for karmic and lineage overlays.
`;

export const getSoulDecoderInsight = async (input: SoulDecoderInput, model: string = 'gemini-3-pro-preview'): Promise<SpiritualIntelligenceResponse> => {
  const ai = getAI();
  const prompt = `
    EXECUTE SOUL DECODING PROTOCOL for:
    Name: ${input.name}
    DOB: ${input.dob}
    Time: ${input.time}
    Location: ${input.city}, ${input.country}

    STRICT AGENT INVOCATION:
    1. Call A23: Calculate Life Path and Expression numbers.
    2. Call A24: Determine Sun, Moon, and Rising signs.
    3. Call A28: Identify Ancestral/Karmic patterns.
    4. Call A29: Synthesize into the Spiritual Intelligence Suite.

    Format the final output STRICTLY as JSON with these keys:
    - soulBlueprint (A26 logic)
    - numerology (A23 logic)
    - astrology (A24 logic)
    - shadowWork (A25 logic)
    - pastLife (A28 logic)
    - emotionalReflection (A27 logic)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: SYSTEM_IDENTITY
      }
    });
    
    return JSON.parse(response.text || "{}") as SpiritualIntelligenceResponse;
  } catch (error) {
    console.error("Agent Coordination Error:", error);
    throw new Error("The Council of Agents is recalibrating for Rarstar Thirteen El Bey.");
  }
};

export const searchSpiritualMeaning = async (query: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agent A25 & A03: Search for the deep spiritual meaning of: "${query}".`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const summary = response.text || "No immediate reply.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { summary, sources };
  } catch (err) {
    throw new Error("Failed to traverse the knowledge web.");
  }
};

export const startGeneralChat = async (history: any[], message: string, onChunk: (text: string) => void) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: SYSTEM_IDENTITY + " Act as Codex Assistant guide." }
  });
  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    if (chunk.text) onChunk(chunk.text);
  }
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
    contents: [{
      parts: [
        { inlineData: { data: base64Data, mimeType: file.type } },
        { text: `Agent A17 (Flux) Analysis: ${prompt || "Analyze the spiritual symbolism."}` }
      ]
    }]
  });
  return response.text || "Unable to interpret visual stream.";
};

export const fetchLiveQuoraFeed = async (): Promise<any[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Agent A14 (QuoraSync): Find trending spiritual questions. Return JSON.",
      config: { tools: [{ googleSearch: {} }], responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || "[]");
  } catch (err) {
    throw new Error("Live sync failed.");
  }
};

export const generateImage = async (prompt: string, size: ImageSize, aspectRatio: AspectRatio): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: `Agent A19 (Aura) Visual: ${prompt}` }] },
    config: { imageConfig: { aspectRatio, imageSize: size } }
  });
  const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
  if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error("No image generated.");
};

export const animateWithVeo = async (prompt: string, imageFile: File | null, aspectRatio: '16:9' | '9:16', onProgress: (msg: string) => void): Promise<string> => {
  const ai = getAI();
  let base64Image = '';
  let mimeType = '';
  if (imageFile) {
    const reader = new FileReader();
    const result = await new Promise<string>((resolve) => {
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(imageFile);
    });
    base64Image = result.split(',')[1];
    mimeType = imageFile.type;
  }
  onProgress("Agent A17 (Flux) initiating Veo...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: `Agent A17 Motion: ${prompt}`,
    image: imageFile ? { imageBytes: base64Image, mimeType } : undefined,
    config: { numberOfVideos: 1, resolution: '720p', aspectRatio }
  });
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
    onProgress("Synthesizing...");
  }
  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const response = await fetch(`${downloadLink}&key=${API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
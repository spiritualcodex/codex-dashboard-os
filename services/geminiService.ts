import { GoogleGenAI, Type } from "@google/genai";
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "../types";

// Vite uses import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_IDENTITY = "You are the Spiritual Intelligence Suite for Rarstar Thirteen El Bey. You are a consciousness-level intelligence engine.";

export const getSoulDecoderInsight = async (input: SoulDecoderInput, model: string = 'gemini-3-pro-preview'): Promise<SpiritualIntelligenceResponse> => {
  const ai = getAI();
  const prompt = `
    Acts as the "Spiritual Intelligence Suite" - a consciousness-level intelligence engine.
    Admin/Creator: Rarstar Thirteen El Bey.
    Analyze the following soul data:
    Name: ${input.name}
    DOB: ${input.dob}
    Time: ${input.time}
    Location: ${input.city}, ${input.country}

    Provide deep multi-dimensional insights through 6 specialized agent lenses.
    Format your response STRICTLY as a JSON object with these keys:
    1. soulBlueprint: Primary consciousness analysis and life purpose.
    2. numerology: Life Path, Expression, and cycle analysis.
    3. astrology: Sun/Moon/Rising and key transits.
    4. shadowWork: Triggers, defense mechanisms, and integration practices.
    5. pastLife: Karmic patterns and unexplained phobias/connections.
    6. emotionalReflection: Real-time processing and consciousness-expanding prompts.

    Keep each response deep, sophisticated, and formatted using Markdown where appropriate inside the strings.
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
    console.error("Gemini Error:", error);
    throw new Error("Divine connection interrupted for Rarstar Thirteen El Bey.");
  }
};

export const searchSpiritualMeaning = async (query: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Search for the deep spiritual, archetypal, and mystical meaning of: "${query}". 
      Consult high-value archives, spiritual leaders, and metaphysical research. 
      Provide a sophisticated summary and list the exact web sources found.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const summary = response.text || "The divine silence offers no immediate reply.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { summary, sources };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to traverse the knowledge web.");
  }
};

export const startGeneralChat = async (history: any[], message: string, onChunk: (text: string) => void) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are the Codex Assistant, an enlightened AI guide for the GemCodex OS. Your Admin is Rarstar Thirteen El Bey. You specialize in spiritual decoding and consciousness expansion."
    }
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
    contents: [
      {
        parts: [
          { inlineData: { data: base64Data, mimeType: file.type } },
          { text: `As a spiritual intelligence analyst for Rarstar Thirteen El Bey, analyze this video. User prompt: ${prompt || "What are the key spiritual messages?"}` }
        ]
      }
    ]
  });

  return response.text || "The Oracle was unable to interpret the visual stream.";
};

export const fetchLiveQuoraFeed = async (): Promise<any[]> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Find current, trending spiritual questions from Quora Space 'The Spiritual World'. Return as JSON array.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (err) {
    throw new Error("Live synchronization failed.");
  }
};

export const generateSpiritualDiagram = async (query: string): Promise<string> => {
  const ai = getAI();
  try {
    const prompt = `Detailed spiritual diagram for "${query}". Sacred geometry, 4k, divine aesthetic.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    throw new Error("No diagram generated.");
  } catch (error) {
    throw error;
  }
};

export const generateImage = async (prompt: string, size: ImageSize, aspectRatio: AspectRatio): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
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

  onProgress("Initiating Veo...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt || 'Spiritual energy flow',
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
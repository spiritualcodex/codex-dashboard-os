
import { GoogleGenAI, Type } from "@google/genai";
import { SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSoulDecoderInsight = async (input: SoulDecoderInput, model: string = 'gemini-3-pro-preview'): Promise<SpiritualIntelligenceResponse> => {
  const ai = getAI();
  const prompt = `
    Acts as the "Spiritual Intelligence Suite" - a consciousness-level intelligence engine.
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

    Keep each response deep, sophisticated, and formatting using Markdown where appropriate inside the strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });
    
    return JSON.parse(response.text || "{}") as SpiritualIntelligenceResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Divine connection interrupted.");
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
    // Grounding chunks are expected to be available here
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
      systemInstruction: "You are the Codex Assistant, an enlightened AI guide for the GemCodex OS. You specialize in spiritual decoding, ancestral wisdom, and consciousness expansion. You are wise, helpful, and sophisticated."
    }
  });

  const response = await chat.sendMessageStream({ message });
  for await (const chunk of response) {
    if (chunk.text) onChunk(chunk.text);
  }
};

export const analyzeVideoContent = async (file: File, prompt: string): Promise<string> => {
  const ai = getAI();
  
  // Convert file to base64
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
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type
            }
          },
          {
            text: `As a spiritual intelligence analyst, analyze this video. 
            User prompt: ${prompt || "What are the key spiritual messages and symbolic elements in this video?"}`
          }
        ]
      }
    ]
  });

  return response.text || "The Oracle was unable to interpret the visual stream.";
};

export const fetchLiveQuoraFeed = async (): Promise<any[]> => {
  const ai = getAI();
  try {
    const prompt = `
      Acts as the "Live Quora Matrix Synchronizer". 
      Find current, trending spiritual questions from the Quora Space "The Spiritual World".
      Return as JSON array with: id, author, content, timeAgo, category.
    `;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              author: { type: Type.STRING },
              content: { type: Type.STRING },
              timeAgo: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ["id", "author", "content", "timeAgo", "category"]
          }
        }
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (err) {
    console.error(err);
    throw new Error("Live synchronization failed.");
  }
};

export const answerCommunityQuestion = async (question: string): Promise<{ summary: string; sources: any[] }> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Acts as "The Spiritual Engine". Answer this community question with depth and grounding: "${question}"`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const summary = response.text || "Recalibrating...";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return { summary, sources };
  } catch (err) {
    throw new Error("Traversal failed.");
  }
};

export const generateSpiritualDiagram = async (query: string): Promise<string> => {
  const ai = getAI();
  try {
    const prompt = `A highly detailed spiritual diagram and sacred geometry representation explaining the essence of "${query}". 4k resolution, divine aesthetic.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No diagram");
  } catch (error) {
    throw error;
  }
};

export const generateContentEngineJob = async (insight: string, format: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Transform this into a ${format}: ${insight}`
  });
  return response.text || "Failed.";
};

export const generateImage = async (prompt: string, size: ImageSize, aspectRatio: AspectRatio): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: [{ text: prompt }] },
    config: { imageConfig: { aspectRatio, imageSize: size } }
  });
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  throw new Error("No image");
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
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

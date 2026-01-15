export enum View {
  DASHBOARD = 'DASHBOARD',
  USERS = 'USERS',
  MEANINGS = 'MEANINGS',
  HERBS = 'HERBS',
  PRODUCTS = 'PRODUCTS',
  DAILY_MESSAGES = 'DAILY_MESSAGES',
  SOUL_PROFILES = 'SOUL_PROFILES',
  VIDEOS = 'VIDEOS',
  SOUL_DECODER = 'SOUL_DECODER',
  STUDIO = 'STUDIO',
  MEDIA_JOBS = 'MEDIA_JOBS',
  SETTINGS = 'SETTINGS',
  INNER_CIRCLE = 'INNER_CIRCLE',
  EVENT_LOGS = 'EVENT_LOGS',
  QUORA_QUEUE = 'QUORA_QUEUE',
  QUESTIONS_LIBRARY = 'QUESTIONS_LIBRARY',
  DECODER_SESSIONS = 'DECODER_SESSIONS',
  AI_INTERVIEWER = 'AI_INTERVIEWER',
  FULL_READING_HUB = 'FULL_READING_HUB',
  MISSION_STATUS = 'MISSION_STATUS',
  VIDEO_ANALYSIS = 'VIDEO_ANALYSIS'
}

export interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

export interface SpiritualSymbol {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
  affiliateLink?: string;
}

export interface Herb {
  id: string;
  name: string;
  spiritualBenefit: string;
  physicalBenefit: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  category: string;
  isFeatured: boolean;
}

export interface DailyMessage {
  id: string;
  date: string;
  message: string;
  affirmation: string;
  toolName: string;
  toolUrl: string;
  toolImage: string;
  mood: string;
}

export interface SoulProfile {
  id: string;
  name: string;
  dob: string;
  sunSign: string;
  moonSign: string;
  risingSign: string;
  lifePath: number;
  image: string;
}

export interface MediaJob {
  id: string;
  title: string;
  mode: 'short_runway' | 'long_pictory';
  script: string;
  status: 'ready' | 'processing' | 'done';
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  tags: string[];
}

export interface CommunityQuestion {
  id: string;
  author: string;
  authorTitle?: string;
  content: string;
  date: string;
  answersCount: number;
  category: string;
}

// Soul Decoder 2.0 Inputs
export interface SoulDecoderInput {
  name: string;
  dob: string;
  time: string;
  city: string;
  country: string;
}

// 6-Agent Spiritual Intelligence Suite
export interface SpiritualIntelligenceResponse {
  soulBlueprint: string;
  numerology: string;
  astrology: string;
  shadowWork: string;
  pastLife: string;
  emotionalReflection: string;
}

// Media Generation Settings
export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '16:9' | '9:16' | '3:4' | '4:3';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
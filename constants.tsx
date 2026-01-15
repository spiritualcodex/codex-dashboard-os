
import { SpiritualSymbol, Herb, Product, DailyMessage, User, SoulProfile, MediaJob, Video, CommunityQuestion } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Rarstar Thirteen El Bey', email: 'yb2obelbey@gmail.com', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rarstar' },
  { id: '2', name: 'Leila Cloud', email: 'leila@example.com', photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leila' }
];

export const SPIRITUAL_SYMBOLS: SpiritualSymbol[] = [
  { id: '1', title: 'Archangel Michael', category: 'Archangels', description: 'Protection, courage, strength.', imageUrl: 'https://images.unsplash.com/photo-1519810755548-39cd217da494?auto=format&fit=crop&w=400&q=80' },
  { id: '2', title: 'Flying', category: 'Dreams', description: 'Spiritual ascension, freedom.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' },
  { id: '3', title: 'Wolf', category: 'Spirit Animals', description: 'Intuition, instinct, freedom.', imageUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=400&q=80' },
  { id: '4', title: 'Lavender', category: 'Herbs', description: 'Calming, cleansing.', imageUrl: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=400&q=80' },
  { id: '5', title: 'Unlocking Spiritual Growth', category: 'Growth', description: 'Techniques and insights for consistent spiritual evolution.', imageUrl: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=400&q=80' }
];

export const COMMUNITY_QUESTIONS: CommunityQuestion[] = [
  { id: 'q1', author: 'Rarstar Thirteen El Bey', content: 'When I pass and my spirit leaves my body do I meet my guardian angel and recognise her or him first or do members of my family who have passed meet me firstly.', date: 'Sat', answersCount: 3, category: 'Life After Death' },
  { id: 'q2', author: 'Tessa Lynne', authorTitle: 'Therapist and author', content: 'Has a soul ever finished its journey?', date: 'Fri', answersCount: 1, category: 'Reincarnation' }
];

export const HERBS: Herb[] = [
  { id: '1', name: 'Lavender', spiritualBenefit: 'calms the mind and spirit, promotes peaceful sleep', physicalBenefit: 'promotes relaxation, reduces anxiety and stress', imageUrl: 'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Sage', spiritualBenefit: 'brings wisdom, clarity, and mental focus', physicalBenefit: 'improves cognitive function, enhances wisdom', imageUrl: 'https://images.unsplash.com/photo-1627933924194-e0c204558e8b?auto=format&fit=crop&w=400&q=80' }
];

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Essential Aura Healing', price: 19.99, description: 'Complete guide to aura cleansing and energy protection.', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=400&q=80', category: 'Meditation and Mindfulness', isFeatured: true },
  { id: '2', name: 'Moonlit Energy Grid', price: 14.99, description: 'Crystal grid layout for manifesting lunar intentions.', imageUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&w=400&q=80', category: 'Spiritual growth', isFeatured: true }
];

export const DAILY_MESSAGES: DailyMessage[] = [
  { id: '1', date: '5 November 2024', message: 'You are on the path to enlightenment.', affirmation: 'I am a being of love and light.', toolName: 'Aura Cleansing', toolUrl: '#', toolImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=50&q=80', mood: 'Inspired' }
];

export const SOUL_PROFILES: SoulProfile[] = [
  { id: '1', name: 'Leila Cloud', dob: '1978-12-05', sunSign: 'Sagittarius', moonSign: 'Saturn', risingSign: 'Gemini', lifePath: 7, image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Leila' }
];

export const MEDIA_JOBS: MediaJob[] = [
  { id: '1', title: 'Spiritual Meaning of Michael', mode: 'short_runway', script: 'A short punchy line about Michael...', status: 'ready' }
];

export const MISSION_STATUSES = [
  { id: '1', title: 'Awakening Phase', status: 'Completed', progress: 100, icon: 'Sparkles' },
  { id: '2', title: 'Chakra Alignment', status: 'In Progress', progress: 65, icon: 'Activity' },
  { id: '3', title: 'Ancestral Linkage', status: 'Pending', progress: 12, icon: 'Link' }
];

export const EVENT_LOGS_DATA = [
  { id: 'e1', timestamp: '2024-11-05 14:22', event: 'Neural Link Established', details: 'Core consciousness successfully synced with Divine OS.', severity: 'success' },
  { id: 'e2', timestamp: '2024-11-05 15:45', event: 'Soul Decoding Session', details: 'User Rarstar Thirteen requested a blueprint synthesis.', severity: 'info' },
  { id: 'e3', timestamp: '2024-11-05 16:10', event: 'External Feed Interruption', details: 'Quora Live Feed briefly lost sync with matrix.', severity: 'warning' }
];

export const QUESTIONS_LIBRARY_DATA = [
  { id: 'ql1', question: 'What is the significance of the number 13?', category: 'Numerology', popularity: 'High' },
  { id: 'ql2', question: 'How do I distinguish between a dream and a spiritual visit?', category: 'Dreamwork', popularity: 'Medium' },
  { id: 'ql3', question: 'Which herb is best for grounding after meditation?', category: 'Herbalism', popularity: 'High' }
];

export const VIDEOS: Video[] = [
  { 
    id: 'yeqgx7yaGEk', 
    title: 'The Eternal Codex Archives', 
    url: 'https://www.youtube.com/@TheEternalCodex', 
    thumbnail: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=800&q=80', 
    tags: ['wisdom', 'ancient', 'sandscript', 'tablets'] 
  },
  { 
    id: 'y0RiTN0_ovE', 
    title: 'Weaving Wisdom Journeys', 
    url: 'https://youtu.be/y0RiTN0_ovE', 
    thumbnail: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=800&q=80', 
    tags: ['spirituality', 'sage', 'yoda-wisdom'] 
  },
  { 
    id: 'lpJ5f5wbX4M', 
    title: 'Spiritual Meanings Feed', 
    url: 'https://www.youtube.com/@Spiritualmeanings67', 
    thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80', 
    tags: ['meanings', 'daily'] 
  },
  { 
    id: '8KIgg6bfKfg', 
    title: 'Magic AI Tools Alchemy', 
    url: 'https://www.youtube.com/@MagicAITools-pr2ys/playlists', 
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', 
    tags: ['ai', 'digital-magic'] 
  }
];

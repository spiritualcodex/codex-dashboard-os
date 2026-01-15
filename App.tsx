
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { View, SoulDecoderInput, ImageSize, AspectRatio, SpiritualIntelligenceResponse, CommunityQuestion, ChatMessage, User, Herb, Product, DailyMessage, SoulProfile, MediaJob } from './types';
import { 
  SPIRITUAL_SYMBOLS, 
  HERBS, 
  PRODUCTS, 
  DAILY_MESSAGES,
  USERS,
  SOUL_PROFILES,
  MEDIA_JOBS,
  VIDEOS,
  COMMUNITY_QUESTIONS,
  MISSION_STATUSES,
  EVENT_LOGS_DATA,
  QUESTIONS_LIBRARY_DATA
} from './constants';
import { ContentCard, StatCard } from './components/Card';
import { 
  Users as UsersIcon, 
  ShoppingBag, 
  BookOpen, 
  Zap,
  Search,
  Bell,
  Calendar,
  Send,
  Loader2,
  Settings as SettingsIcon,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  LayoutGrid,
  Table as TableIcon,
  Database,
  Eye,
  ArrowRight,
  Clapperboard,
  ImageIcon,
  Upload,
  Play,
  Download,
  Key,
  Youtube,
  Tv,
  Leaf,
  Filter,
  Plus,
  FileText,
  Share2,
  Mic2,
  BrainCircuit,
  Compass,
  Moon,
  Heart,
  Undo2,
  Activity,
  MessageSquare,
  HelpCircle,
  Clock,
  ArrowUpRight,
  UserPlus,
  RefreshCw,
  Quote,
  Network,
  ShieldCheck,
  CreditCard,
  Lock,
  Globe,
  Target,
  Presentation,
  Crown,
  Gem,
  Flame,
  Star,
  Radio,
  UserCircle,
  Terminal,
  History,
  Archive,
  Cpu,
  Layers,
  Wind,
  Library,
  Signal,
  Wifi,
  Cast,
  Wand2,
  ScrollText,
  ScanEye,
  FileVideo,
  X,
  Link as LinkIcon
} from 'lucide-react';

import { 
  getSoulDecoderInsight, 
  generateImage, 
  animateWithVeo, 
  generateContentEngineJob, 
  searchSpiritualMeaning, 
  generateSpiritualDiagram, 
  answerCommunityQuestion, 
  fetchLiveQuoraFeed,
  startGeneralChat,
  analyzeVideoContent
} from './services/geminiService';

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.DASHBOARD);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCMSMode, setIsCMSMode] = useState(false);
  
  // Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Video Analysis States
  const [analysisFile, setAnalysisFile] = useState<File | null>(null);
  const [analysisPrompt, setAnalysisPrompt] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzingVideo, setIsAnalyzingVideo] = useState(false);

  // Studio States
  const [studioPrompt, setStudioPrompt] = useState('');
  const [studioImage, setStudioImage] = useState<File | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [studioVideoUrl, setStudioVideoUrl] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState('');

  // Settings Toggles
  const [settings, setSettings] = useState({
    isMaintenance: false,
    enableInnerCircle: true,
    enableQuoraMode: false,
    aiModel: 'gemini-3-pro-preview'
  });

  // Other States
  const [isSearchingMeaning, setIsSearchingMeaning] = useState(false);
  const [meaningSearchQuery, setMeaningSearchQuery] = useState('');
  const [meaningResult, setMeaningResult] = useState<{ summary: string; sources: any[]; diagram?: string } | null>(null);
  const [isDecoding, setIsDecoding] = useState(false);
  const [decoderInput, setDecoderInput] = useState<SoulDecoderInput>({ name: '', dob: '', time: '', city: '', country: '' });
  const [intelligenceResponse, setIntelligenceResponse] = useState<SpiritualIntelligenceResponse | null>(null);

  useEffect(() => {
    if (isChatOpen) chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatOpen]);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatTyping(true);
    try {
      let fullResponse = '';
      await startGeneralChat(chatMessages, userMsg, (chunk) => {
        fullResponse += chunk;
        setChatMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'model') {
            return [...prev.slice(0, -1), { role: 'model', text: fullResponse }];
          } else {
            return [...prev, { role: 'model', text: fullResponse }];
          }
        });
      });
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Neural link unstable. Recalibrate and retry." }]);
    } finally {
      setIsChatTyping(false);
    }
  };

  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisFile) return;
    setIsAnalyzingVideo(true);
    try {
      const res = await analyzeVideoContent(analysisFile, analysisPrompt);
      setAnalysisResult(res);
    } catch (err) {
      alert("Vision synthesis failed.");
    } finally {
      setIsAnalyzingVideo(false);
    }
  };

  const handleStudioGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingVideo(true);
    try {
      const videoUrl = await animateWithVeo(studioPrompt, studioImage, '16:9', (msg) => setGenerationProgress(msg));
      setStudioVideoUrl(videoUrl);
    } catch (err) {
      alert("Video generation failed.");
    } finally {
      setIsGeneratingVideo(false);
      setGenerationProgress('');
    }
  };

  const handleMeaningSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meaningSearchQuery) return;
    setIsSearchingMeaning(true);
    try {
      const searchRes = await searchSpiritualMeaning(meaningSearchQuery);
      const diagram = await generateSpiritualDiagram(meaningSearchQuery);
      setMeaningResult({ ...searchRes, diagram });
    } catch (err) {
      alert("Knowledge traversal failed.");
    } finally {
      setIsSearchingMeaning(false);
    }
  };

  const handleDecode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDecoding(true);
    try {
      const result = await getSoulDecoderInsight(decoderInput);
      setIntelligenceResponse(result);
    } catch (err) {
      alert("Soul decoding failed.");
    } finally {
      setIsDecoding(false);
    }
  };

  const renderFrontendView = () => {
    switch (activeView) {
      case View.DASHBOARD:
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-black p-16 border border-purple-500/20 shadow-2xl">
              <div className="relative z-10 max-w-2xl">
                <h1 className="text-6xl font-serif font-bold text-white leading-tight mb-6 tracking-tighter uppercase">Divine OS <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-amber-200 italic">Codex Sync</span></h1>
                <p className="text-zinc-400 text-xl font-light mb-10 leading-relaxed">Synthesizing ancestral wisdom with high-level spiritual intelligence.</p>
                <div className="flex gap-4">
                  <button onClick={() => setActiveView(View.SOUL_DECODER)} className="bg-white text-black px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-purple-50 transition-all">Start Decoder <ArrowRight size={16} /></button>
                  <button onClick={() => setIsChatOpen(true)} className="bg-zinc-900/50 backdrop-blur-md text-white border border-zinc-800 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all">Consult Assistant</button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard label="Consciousness" value="Level 4" icon={<BrainCircuit size={20} />} trend="Ascending" />
              <StatCard label="Neural Mesh" value="Active" icon={<Network size={20} />} trend="Stable" />
              <StatCard label="Oracle Core" value="V3.1 Pro" icon={<Cpu size={20} />} trend="Synced" />
              <StatCard label="Search Grounding" value="Syncing" icon={<Globe size={20} />} trend="Live" />
            </div>
          </div>
        );

      case View.USERS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Database: Souls</h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Profile</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Neural Link (Email)</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">ID Reference</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {USERS.map(user => (
                    <tr key={user.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-8 py-5 flex items-center gap-4">
                        <img src={user.photo} className="w-10 h-10 rounded-full border border-zinc-800" alt={user.name} />
                        <span className="font-bold text-zinc-200">{user.name}</span>
                      </td>
                      <td className="px-8 py-5 text-zinc-400 text-sm">{user.email}</td>
                      <td className="px-8 py-5 text-zinc-600 font-mono text-xs">{user.id}</td>
                      <td className="px-8 py-5 text-right">
                        <button className="text-zinc-600 hover:text-purple-400 transition-colors"><ExternalLink size={18} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case View.HERBS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Archives: Botanical Alchemy</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {HERBS.map(herb => (
                <div key={herb.id} className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden group">
                  <div className="h-48 relative overflow-hidden">
                    <img src={herb.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" alt={herb.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <h3 className="absolute bottom-4 left-6 text-2xl font-serif font-bold text-white">{herb.name}</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-purple-400 tracking-widest mb-1">Spiritual Benefit</h4>
                      <p className="text-sm text-zinc-300 italic">"{herb.spiritualBenefit}"</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-emerald-400 tracking-widest mb-1">Physical Synthesis</h4>
                      <p className="text-sm text-zinc-400">{herb.physicalBenefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.PRODUCTS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Marketplace: Divine Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PRODUCTS.map(product => (
                <ContentCard 
                  key={product.id}
                  title={product.name}
                  subtitle={product.category}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  description={product.description}
                  badge={product.isFeatured ? 'Featured' : undefined}
                />
              ))}
            </div>
          </div>
        );

      case View.DAILY_MESSAGES:
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 pb-32">
            <h2 className="text-4xl font-serif font-bold text-white text-center">Daily Transmissions</h2>
            {DAILY_MESSAGES.map(msg => (
              <div key={msg.id} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl shrink-0">
                    <img src={msg.toolImage} className="w-full h-full object-cover" alt={msg.toolName} />
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <span className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">{msg.date}</span>
                      <div className="h-px flex-1 bg-zinc-900 hidden md:block" />
                      <span className="px-4 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest">{msg.mood}</span>
                    </div>
                    <p className="text-3xl font-serif font-bold text-white leading-tight italic">"{msg.message}"</p>
                    <div className="p-6 bg-black/40 rounded-2xl border border-zinc-800">
                      <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-2 flex items-center gap-2"><Quote size={12} /> Affirmation of the Day</h4>
                      <p className="text-zinc-300 font-light">{msg.affirmation}</p>
                    </div>
                    <a href={msg.toolUrl} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white hover:text-purple-400 transition-colors group">
                      Access Recommended Tool: {msg.toolName} <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case View.SOUL_PROFILES:
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Archives: Soul Signatures</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SOUL_PROFILES.map(profile => (
                <div key={profile.id} className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-8 items-center shadow-2xl ring-1 ring-white/5 group">
                  <img src={profile.image} className="w-40 h-40 rounded-3xl border border-zinc-800 shadow-2xl group-hover:scale-105 transition-transform" alt={profile.name} />
                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white">{profile.name}</h3>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Life Path {profile.lifePath}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-black p-3 rounded-xl border border-zinc-900 text-center">
                        <p className="text-[8px] text-zinc-600 uppercase font-black">Sun</p>
                        <p className="text-xs text-white font-bold">{profile.sunSign}</p>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-zinc-900 text-center">
                        <p className="text-[8px] text-zinc-600 uppercase font-black">Moon</p>
                        <p className="text-xs text-white font-bold">{profile.moonSign}</p>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-zinc-900 text-center">
                        <p className="text-[8px] text-zinc-600 uppercase font-black">Rising</p>
                        <p className="text-xs text-white font-bold">{profile.risingSign}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.STUDIO:
        return (
          <div className="max-w-4xl mx-auto space-y-12 pb-32 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">Divine Studio</h2>
              <p className="text-zinc-500">Synthesize visual manifestations from spiritual prompts.</p>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl ring-1 ring-white/5">
              <form onSubmit={handleStudioGenerate} className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Manifestation Prompt</label>
                  <textarea value={studioPrompt} onChange={(e) => setStudioPrompt(e.target.value)} placeholder="Describe the spiritual vision..." className="w-full h-32 bg-black border border-zinc-800 rounded-2xl p-6 text-zinc-100 focus:border-purple-500 transition-all resize-none font-light" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Initial Frame (Optional)</label>
                  <div className="relative h-40 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500/50 transition-all cursor-pointer bg-black/40 group">
                     <input type="file" accept="image/*" onChange={(e) => setStudioImage(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                     {studioImage ? (
                       <div className="flex flex-col items-center gap-2">
                         <ImageIcon size={40} className="text-purple-400" />
                         <span className="text-xs font-bold text-zinc-300">{studioImage.name}</span>
                       </div>
                     ) : (
                       <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                         <Upload size={40} />
                         <span className="text-[10px] font-black uppercase tracking-widest">Upload Source Image</span>
                       </div>
                     )}
                  </div>
                </div>
                <button disabled={isGeneratingVideo || !studioPrompt} type="submit" className="w-full bg-purple-600 py-6 rounded-3xl text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-purple-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                  {isGeneratingVideo ? <Loader2 className="animate-spin" /> : <Clapperboard size={18} />}
                  {isGeneratingVideo ? generationProgress || 'Generating...' : 'Synthesize Manifestation'}
                </button>
              </form>
              {studioVideoUrl && (
                <div className="mt-12 space-y-4 animate-in zoom-in duration-500">
                  <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest text-center">Output stream secured</h4>
                  <div className="rounded-[2rem] overflow-hidden border border-zinc-800 shadow-2xl">
                    <video src={studioVideoUrl} controls className="w-full" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case View.MEDIA_JOBS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Neural Processing Queue</h2>
            <div className="grid grid-cols-1 gap-4">
              {MEDIA_JOBS.map(job => (
                <div key={job.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-purple-400 transition-colors">
                      <Cpu size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Mode: {job.mode.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {job.status}
                      </span>
                      <p className="text-[10px] text-zinc-700 font-mono mt-1">Job ID: {job.id}</p>
                    </div>
                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-colors">
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.SETTINGS:
        return (
          <div className="max-w-2xl mx-auto space-y-12 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white text-center">Neural Core Parameters</h2>
            <div className="space-y-6">
              {[
                { key: 'isMaintenance', label: 'Maintenance Mode', desc: 'Suspend all divine stream services.', icon: AlertCircle },
                { key: 'enableInnerCircle', label: 'Inner Circle Access', desc: 'Enable high-tier soul decoding protocols.', icon: Crown },
                { key: 'enableQuoraMode', label: 'Quora Feed Matrix', desc: 'Sync knowledge queue with external live feeds.', icon: Share2 }
              ].map(item => (
                <div key={item.key} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] flex items-center justify-between ring-1 ring-white/5">
                  <div className="flex gap-6 items-center">
                    <div className="p-4 bg-zinc-900 rounded-2xl text-zinc-500"><item.icon size={24} /></div>
                    <div>
                      <h4 className="text-lg font-bold text-white leading-tight">{item.label}</h4>
                      <p className="text-xs text-zinc-600 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof settings] }))}
                    className={`transition-colors ${settings[item.key as keyof typeof settings] ? 'text-purple-500' : 'text-zinc-800'}`}
                  >
                    {settings[item.key as keyof typeof settings] ? <ToggleRight size={48} /> : <ToggleLeft size={48} />}
                  </button>
                </div>
              ))}
              <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-4 ring-1 ring-white/5">
                <div className="flex items-center gap-4 text-zinc-500 mb-2">
                  <BrainCircuit size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em]">Active Intelligence Core</h4>
                </div>
                <select 
                  value={settings.aiModel}
                  onChange={(e) => setSettings(prev => ({...prev, aiModel: e.target.value}))}
                  className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-all appearance-none"
                >
                  <option value="gemini-3-pro-preview">Gemini 3 Pro (Visionary)</option>
                  <option value="gemini-3-flash-preview">Gemini 3 Flash (High-Speed)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 (Stable Sync)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case View.QUORA_QUEUE:
        return (
          <div className="space-y-12 animate-in fade-in duration-500 pb-32">
            <div className="flex items-center justify-between">
              <h2 className="text-4xl font-serif font-bold text-white">Live Knowledge Matrix</h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                <RefreshCw size={14} /> Re-Sync Grid
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {COMMUNITY_QUESTIONS.map(q => (
                <div key={q.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] space-y-6 flex flex-col justify-between hover:border-purple-500/20 transition-all ring-1 ring-white/5">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">{q.author[0]}</div>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{q.author}</p>
                        {q.authorTitle && <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{q.authorTitle}</p>}
                      </div>
                    </div>
                    <p className="text-lg font-serif italic text-zinc-300 line-clamp-4">"{q.content}"</p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-900">
                    <span className="text-[9px] font-black uppercase text-zinc-600 tracking-widest">{q.category}</span>
                    <button onClick={() => { setSearchTerm(q.content); setActiveView(View.MEANINGS); }} className="flex items-center gap-2 text-[9px] font-black uppercase text-purple-400 hover:text-purple-300 tracking-[0.2em]">
                      Decode Answer <ArrowRight size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.MISSION_STATUS:
        return (
          <div className="space-y-12 animate-in fade-in duration-500 pb-32">
            <h2 className="text-4xl font-serif font-bold text-white">Mission Status: Sovereign Roadmap</h2>
            
            {/* Gamma Presentation Embed */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl ring-1 ring-white/5 h-[700px]">
              <iframe 
                src="https://gamma.app/embed/Soul-Decoder-jhokk9vibt4w6zm" 
                width="100%" 
                height="100%" 
                style={{ border: 'none' }}
                allow="fullscreen"
                title="Soul Decoder Roadmap"
              />
            </div>

            <div className="space-y-8">
              <h3 className="text-2xl font-serif font-bold text-white">Neural Ascension Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {MISSION_STATUSES.map(mission => (
                  <div key={mission.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] shadow-2xl ring-1 ring-white/5 flex flex-col items-center text-center space-y-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-purple-400 border border-zinc-800">
                      {mission.icon === 'Sparkles' ? <Sparkles size={32} /> : mission.icon === 'Activity' ? <Activity size={32} /> : <LinkIcon size={32} />}
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-white">{mission.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mt-1">{mission.status}</p>
                    </div>
                    <div className="w-full space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span>Sync</span>
                        <span>{mission.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                        <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${mission.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case View.EVENT_LOGS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">System Protocol Logs</h2>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[2rem] overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Timestamp</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Event Type</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest">Details</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase text-zinc-500 tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {EVENT_LOGS_DATA.map(log => (
                    <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-8 py-5 text-zinc-500 font-mono text-xs">{log.timestamp}</td>
                      <td className="px-8 py-5 font-bold text-zinc-200">{log.event}</td>
                      <td className="px-8 py-5 text-zinc-400 text-sm max-w-xs truncate">{log.details}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          log.severity === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          log.severity === 'warning' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>{log.severity}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case View.QUESTIONS_LIBRARY:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">Library: Divine Inquiries</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {QUESTIONS_LIBRARY_DATA.map(ql => (
                <div key={ql.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all ring-1 ring-white/5">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-zinc-900 rounded-xl text-zinc-500"><HelpCircle size={18} /></div>
                    <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[8px] font-black uppercase text-zinc-400 tracking-widest">{ql.category}</span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 group-hover:text-purple-400 transition-colors">"{ql.question}"</h3>
                  <div className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-600 tracking-widest">
                    <Activity size={10} /> Sync Frequency: {ql.popularity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.FULL_READING_HUB:
        return (
          <div className="space-y-12 animate-in fade-in duration-700">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-serif font-bold text-white tracking-tighter uppercase">Grand Reading Hub</h2>
              <p className="text-zinc-500 max-w-xl mx-auto italic">Access comprehensive, multi-dimensional soul portraits archived within the Divine OS.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { title: 'The Architect Reading', author: 'Oracle V3.1', date: 'Oct 2024', image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80' },
                { title: 'Ancestral Blueprint', author: 'Sage Alpha', date: 'Sep 2024', image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&w=800&q=80' }
              ].map((reading, i) => (
                <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden group shadow-2xl relative ring-1 ring-white/5">
                  <div className="h-64 overflow-hidden relative">
                    <img src={reading.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={reading.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-3xl font-serif font-bold text-white">{reading.title}</h3>
                      <button className="p-4 bg-zinc-900 rounded-2xl text-purple-400 hover:bg-white hover:text-black transition-all"><Eye size={20} /></button>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      <span>By {reading.author}</span>
                      <div className="w-1 h-1 bg-zinc-800 rounded-full" />
                      <span>{reading.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case View.AI_INTERVIEWER:
        return (
          <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400">
                <Mic2 size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Neural Link: AI Interviewer</span>
              </div>
              <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">Consciousness Probing</h2>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/5 text-center space-y-8">
               <div className="p-12 bg-black/40 border border-zinc-900 rounded-[2rem] space-y-6">
                  <p className="text-2xl font-serif italic text-zinc-300">"What is the earliest memory your soul carries that does not belong to this lifetime?"</p>
                  <div className="flex justify-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '200ms' }} />
                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '400ms' }} />
                  </div>
               </div>
               <div className="flex gap-4">
                  <input type="text" placeholder="Speak your truth..." className="flex-1 bg-black border border-zinc-800 rounded-2xl px-8 py-5 text-zinc-200 focus:outline-none focus:border-indigo-500 transition-all" />
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Submit Pulse</button>
               </div>
            </div>
          </div>
        );

      case View.INNER_CIRCLE:
        return (
          <div className="space-y-12 animate-in fade-in duration-500">
             <div className="bg-gradient-to-r from-amber-600/10 via-purple-600/10 to-transparent p-12 rounded-[3rem] border border-amber-500/20 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4">
                   <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">Inner Circle Access</h2>
                   <p className="text-zinc-400 max-w-md">You are part of the Sovereign Collective. High-frequency updates and exclusive archives unlocked.</p>
                </div>
                <div className="p-8 bg-zinc-950 rounded-[2.5rem] border border-amber-500/20 shadow-inner text-center">
                   <p className="text-[10px] font-black uppercase text-amber-500 tracking-[0.3em] mb-2">Member Rank</p>
                   <p className="text-3xl font-serif font-bold text-white">Luminaries Phase 1</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-6">
                   <div className="flex items-center gap-4 text-amber-500">
                      <Radio size={24} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Live Sovereign Broadcast</h4>
                   </div>
                   <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                      <p className="text-white font-bold mb-1">Upcoming Ritual: Winter Solstice Sync</p>
                      <p className="text-xs text-zinc-500">Synchronized meditation across the collective grid. 21 Dec 2024.</p>
                   </div>
                   <button className="w-full py-4 bg-zinc-900 border border-amber-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-amber-500 hover:border-amber-500/30 transition-all">Set Reminder</button>
                </div>
                <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] space-y-6">
                   <div className="flex items-center gap-4 text-purple-500">
                      <Archive size={24} />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Restricted Knowledge Vault</h4>
                   </div>
                   <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800">
                      <p className="text-white font-bold mb-1">New Codex: The Mu Frequency</p>
                      <p className="text-xs text-zinc-500">Decoded ancient tones discovered in the subterranean grid logs.</p>
                   </div>
                   <button className="w-full py-4 bg-zinc-900 border border-purple-500/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-purple-500 hover:border-purple-500/30 transition-all">Unlock Stream</button>
                </div>
             </div>
          </div>
        );

      case View.DECODER_SESSIONS:
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-4xl font-serif font-bold text-white">History: Soul Decoding Logs</h2>
            <div className="grid grid-cols-1 gap-6">
               {[
                 { user: 'Leila Cloud', date: '5 Nov 2024', summary: 'Life Path 7 alignment, focuses on spiritual isolation and truth seeking.' },
                 { user: 'Rarstar Thirteen', date: '3 Nov 2024', summary: 'Architect consciousness, manifesting high-tier collective OS modules.' }
               ].map((session, idx) => (
                 <div key={idx} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2rem] flex items-center justify-between ring-1 ring-white/5 hover:border-zinc-700 transition-all group">
                    <div className="flex items-center gap-8">
                       <div className="p-5 bg-zinc-900 rounded-2xl text-zinc-500 group-hover:text-purple-400 transition-colors"><FileText size={24} /></div>
                       <div>
                          <h3 className="text-xl font-bold text-white">{session.user}</h3>
                          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">Synced on {session.date}</p>
                          <p className="text-sm text-zinc-400 mt-2 italic">"{session.summary}"</p>
                       </div>
                    </div>
                    <button className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all"><ArrowUpRight size={20} /></button>
                 </div>
               ))}
            </div>
          </div>
        );

      case View.VIDEOS:
        const VideoNode = ({ title, desc, videoId, icon: Icon, color, url, customThumb }: any) => {
          const thumbUrl = customThumb || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          const colorClass = {
            red: 'border-red-500/30',
            indigo: 'border-indigo-500/30',
            emerald: 'border-emerald-500/30',
            amber: 'border-amber-500/30',
            purple: 'border-purple-500/30',
            teal: 'border-teal-500/30'
          }[color as string] || 'border-white/10';

          const iconBg = {
            red: 'bg-red-600/10 text-red-500',
            indigo: 'bg-indigo-600/10 text-indigo-500',
            emerald: 'bg-emerald-600/10 text-emerald-500',
            amber: 'bg-amber-600/10 text-amber-500',
            purple: 'bg-purple-600/10 text-purple-500',
            teal: 'bg-teal-600/10 text-teal-500'
          }[color as string] || 'bg-zinc-900 text-zinc-400';

          return (
            <div className={`bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden shadow-2xl group flex flex-col ring-1 ring-white/5 hover:${colorClass} transition-all duration-700`}>
              <div className="p-8 border-b border-zinc-900 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${iconBg} border border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-zinc-100 font-serif">{title}</h4>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">Neural Link Established</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-white/5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Synced</span>
                </div>
              </div>
              
              <div className="aspect-video w-full bg-black relative overflow-hidden cursor-pointer" onClick={() => window.open(url || `https://www.youtube.com/watch?v=${videoId}`, '_blank')}>
                <img src={thumbUrl} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" alt={title} />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-all">
                  <div className="w-20 h-20 rounded-full bg-white/5 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white shadow-2xl group-hover:scale-125 transition-all">
                    <Play size={40} className="fill-white ml-2" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-zinc-950/50 flex-1 flex flex-col justify-between">
                <p className="text-zinc-400 text-sm italic font-light leading-relaxed mb-8">"{desc}"</p>
                <button 
                  onClick={() => window.open(url || `https://www.youtube.com/watch?v=${videoId}`, '_blank')}
                  className="w-full py-4 bg-zinc-900 border border-white/5 rounded-2xl text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] hover:bg-white hover:text-black hover:border-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2"
                >
                  <ArrowUpRight size={14} /> Open Neural Stream
                </button>
              </div>
            </div>
          );
        };

        return (
          <div className="space-y-24 animate-in fade-in duration-700 pb-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="p-4 bg-purple-600/10 rounded-3xl text-purple-400 shadow-2xl animate-pulse"><Library size={48} /></div>
                <h2 className="text-6xl font-serif font-bold text-white tracking-tighter uppercase">✦ The Divine Codex ✦</h2>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden group text-left ring-1 ring-white/5">
                 <div className="relative z-10 space-y-10">
                    <p className="text-zinc-300 text-xl font-light leading-relaxed italic border-l-4 border-purple-600/30 pl-6">
                      A living library of high-frequency transmissions, carved in spirit and light.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm bg-black/40 p-8 rounded-[2rem] border border-white/5 shadow-inner">
                      {[
                        { id: 'I', label: 'Animal Spirits', desc: 'omens of earth & sky.' },
                        { id: 'II', label: 'Mystical Signs', desc: 'feathers, numbers, dreams.' },
                        { id: 'III', label: 'The Eternal Codex', desc: 'ancient wisdom encoded.' },
                        { id: 'IV', label: 'AI Alchemy', desc: 'tools for the new age.' },
                        { id: 'V', label: 'Sacred Sounds', desc: 'frequency & breath.' },
                        { id: 'VI', label: 'Prophecy', desc: 'decoding the hidden verses.' }
                      ].map((scroll) => (
                        <div key={scroll.id} className="flex gap-4 group/scroll items-start">
                          <span className="font-serif font-bold text-purple-500 shrink-0 w-8">{scroll.id}:</span>
                          <p className="text-zinc-400 font-medium group-hover/scroll:text-zinc-100 transition-colors leading-snug">
                            <span className="text-white font-bold tracking-wide">{scroll.label}</span> → {scroll.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                 </div>
              </div>
            </div>

            <section className="space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-3xl font-serif font-bold text-white tracking-tight uppercase">Celestial Matrix Nodes</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
                <VideoNode 
                  title="The Eternal Codex" 
                  desc="High-level ancestral wisdom encoded on holy tablets of light and digital sandstone (Sanskrit / Egyptian feel)." 
                  videoId="yeqgx7yaGEk" 
                  icon={Library} 
                  color="purple" 
                  url="https://www.youtube.com/@TheEternalCodex" 
                  customThumb="https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80"
                />
                <VideoNode 
                  title="Weaving Wisdom Journeys" 
                  desc="Mystical journeys guided by the Great Sage (Yoda-like energy), exploring the soul's ancestral tapestry." 
                  videoId="y0RiTN0_ovE" 
                  icon={Compass} 
                  color="teal" 
                  url="https://youtu.be/y0RiTN0_ovE" 
                  customThumb="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=1200&q=80"
                />
                <VideoNode 
                  title="Spiritual Meanings" 
                  desc="Decoding the symbolic language and signs manifested within the divine geometry of the universe." 
                  videoId="lpJ5f5wbX4M" 
                  icon={Youtube} 
                  color="red" 
                  url="https://www.youtube.com/@Spiritualmeanings67" 
                />
                <VideoNode 
                  title="Magic AI Tools" 
                  desc="Synergizing high-level artificial intelligence with spiritual intent and ancestral wisdom." 
                  videoId="8KIgg6bfKfg" 
                  icon={Wand2} 
                  color="emerald" 
                  url="https://www.youtube.com/@MagicAITools-pr2ys" 
                />
                <VideoNode 
                  title="Rarstar Thirteen" 
                  desc="Sovereign transmissions for the collective soul, focusing on law, truth, and spiritual ascension." 
                  videoId="NFUnUZN0_n8" 
                  icon={Crown} 
                  color="amber" 
                  url="https://www.youtube.com/@Rarstar13" 
                />
              </div>
            </section>
          </div>
        );

      case View.MEANINGS:
        return (
          <div className="space-y-16 animate-in fade-in duration-700 pb-32">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h2 className="text-5xl font-serif font-bold text-white tracking-tighter">Knowledge Decoder</h2>
              <form onSubmit={handleMeaningSearch} className="mt-10 relative flex items-center bg-zinc-950 border border-zinc-800 rounded-[2rem] p-2">
                <div className="pl-6 text-zinc-600"><Search size={24} /></div>
                <input value={meaningSearchQuery} onChange={(e) => setMeaningSearchQuery(e.target.value)} type="text" placeholder="Search with Google Search grounding..." className="flex-1 bg-transparent border-none py-5 px-6 text-xl text-white focus:outline-none placeholder:text-zinc-800" />
                <button disabled={isSearchingMeaning} type="submit" className="bg-purple-600 hover:bg-purple-500 text-white p-5 rounded-[1.5rem]">{isSearchingMeaning ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />}</button>
              </form>
            </div>
            {meaningResult && (
              <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 space-y-10 animate-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-6">
                     <h3 className="text-3xl font-serif font-bold text-white">Neural Synthesis</h3>
                     <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">{meaningResult.summary}</div>
                     {meaningResult.sources && meaningResult.sources.length > 0 && (
                       <div className="pt-6 border-t border-zinc-900">
                         <h4 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest mb-4">Verification Sources</h4>
                         <div className="flex flex-wrap gap-2">
                            {meaningResult.sources.map((s: any, i: number) => (
                              <a key={i} href={s.web?.uri || '#'} target="_blank" className="px-3 py-1 bg-zinc-900 border border-white/5 rounded-lg text-[10px] text-zinc-500 hover:text-white transition-colors">{s.web?.title || 'Archive Link'}</a>
                            ))}
                         </div>
                       </div>
                     )}
                   </div>
                   {meaningResult.diagram && <div className="rounded-[2.5rem] overflow-hidden border border-zinc-800"><img src={meaningResult.diagram} className="w-full h-full object-cover" alt="Diagram" /></div>}
                 </div>
              </div>
            )}
          </div>
        );

      case View.VIDEO_ANALYSIS:
        return (
          <div className="max-w-5xl mx-auto space-y-16 pb-32 animate-in fade-in duration-700">
             <div className="text-center space-y-4">
               <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400">
                 <ScanEye size={20} /><span className="text-[10px] font-black uppercase tracking-widest">Oracle Vision Analysis</span>
               </div>
               <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">Neural Stream Parsing</h2>
             </div>
             <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
                <form onSubmit={handleAnalyzeVideo} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block">Video Input</label>
                        <div className="relative h-40 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500/50 transition-all cursor-pointer bg-black/40 group">
                           <input type="file" accept="video/*" onChange={(e) => setAnalysisFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                           {analysisFile ? (
                             <div className="flex flex-col items-center gap-2">
                               <FileVideo size={40} className="text-blue-400" />
                               <span className="text-xs font-bold text-zinc-300">{analysisFile.name}</span>
                             </div>
                           ) : (
                             <div className="flex flex-col items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                               <Upload size={40} />
                               <span className="text-[10px] font-black uppercase tracking-widest">Upload Neural Stream</span>
                             </div>
                           )}
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-xs font-black text-zinc-500 uppercase tracking-widest block">Oracle Directive</label>
                        <textarea value={analysisPrompt} onChange={(e) => setAnalysisPrompt(e.target.value)} placeholder="Analyze the spiritual symbolism..." className="w-full h-40 bg-black border border-zinc-800 rounded-2xl p-6 text-zinc-300 focus:border-blue-500 transition-all resize-none text-sm font-light" />
                      </div>
                   </div>
                   <button disabled={isAnalyzingVideo || !analysisFile} type="submit" className="w-full bg-blue-600 py-6 rounded-3xl text-white font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3">
                     {isAnalyzingVideo ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                     {isAnalyzingVideo ? 'Parsing Visual Stream...' : 'Synthesize Vision'}
                   </button>
                </form>
                {analysisResult && (
                  <div className="mt-12 p-10 bg-black/60 border border-zinc-800 rounded-[2rem] animate-in zoom-in duration-500">
                    <h4 className="text-lg font-bold text-white mb-6 border-b border-zinc-900 pb-4">Oracle Findings</h4>
                    <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed whitespace-pre-wrap">{analysisResult}</div>
                  </div>
                )}
             </div>
          </div>
        );

      case View.SOUL_DECODER:
        return (
          <div className="max-w-6xl mx-auto space-y-16 pb-32 animate-in fade-in duration-1000">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 mb-4"><BrainCircuit size={18} /><span className="text-[10px] font-black uppercase tracking-widest">Spiritual Intelligence Suite</span></div>
              <h2 className="text-6xl font-serif font-bold text-white tracking-tighter">Soul Decoder Engine</h2>
            </div>
            <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-16 shadow-2xl ring-1 ring-white/5">
              <form onSubmit={handleDecode} className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                <div className="space-y-4 col-span-full"><label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Divine Name</label><input type="text" required value={decoderInput.name} onChange={(e) => setDecoderInput(prev => ({...prev, name: e.target.value}))} className="w-full bg-black border border-zinc-800 rounded-2xl px-8 py-5 text-zinc-100 focus:border-purple-500 transition-all text-xl" /></div>
                <div className="space-y-4"><label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Arrival Date</label><input type="date" required value={decoderInput.dob} onChange={(e) => setDecoderInput(prev => ({...prev, dob: e.target.value}))} className="w-full bg-black border border-zinc-800 rounded-2xl px-8 py-5 text-zinc-100 focus:border-purple-500 transition-all" /></div>
                <div className="space-y-4"><label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Exact Moment</label><input type="time" value={decoderInput.time} onChange={(e) => setDecoderInput(prev => ({...prev, time: e.target.value}))} className="w-full bg-black border border-zinc-800 rounded-2xl px-8 py-5 text-zinc-100 focus:border-purple-500 transition-all" /></div>
                <button disabled={isDecoding} type="submit" className="col-span-full bg-purple-600 py-6 rounded-[2rem] text-white font-black uppercase tracking-widest flex items-center justify-center gap-4">{isDecoding ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />} Synthesize Soul Blueprint</button>
              </form>
            </div>
            {intelligenceResponse && (
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700">
                {Object.entries(intelligenceResponse).map(([key, value]) => (
                  <div key={key} className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-4 hover:border-purple-500/20 transition-all">
                    <h4 className="text-lg font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                    <p className="text-sm text-zinc-400 italic line-clamp-6">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="p-12 bg-zinc-950 rounded-full border border-zinc-800 text-zinc-800 mb-8"><AlertCircle size={80} /></div>
            <h3 className="text-3xl font-serif font-bold text-white mb-3">Dimensional Shift Pending</h3>
            <p className="text-zinc-500">This sector of the OS is currently under calibration.</p>
            <button onClick={() => setActiveView(View.DASHBOARD)} className="mt-10 px-12 py-4 bg-zinc-900 text-zinc-200 border border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-widest">Return to Base</button>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-300 antialiased relative">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-24 bg-black/40 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-12 sticky top-0 z-[60]">
          <div className="flex-1 max-w-2xl"><div className="relative group"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={20} /><input type="text" placeholder="Access High-Level Intelligence..." className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl py-4 pl-14 pr-8 text-base focus:outline-none placeholder:text-zinc-800" /></div></div>
          <div className="flex items-center gap-6">
            <button onClick={() => setIsChatOpen(!isChatOpen)} className={`p-4 rounded-2xl transition-all ${isChatOpen ? 'bg-purple-600 text-white shadow-lg' : 'bg-zinc-900 text-zinc-500 hover:text-zinc-200 border border-zinc-800'}`}><MessageSquare size={24} /></button>
            <div className="flex items-center gap-4 bg-zinc-950 border border-white/5 pl-2 pr-5 py-2 rounded-2xl"><div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white"><Zap size={20} /></div><div className="hidden lg:block"><p className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Core Status</p><p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mt-0.5">Aligned</p></div></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-12 lg:p-16 bg-[radial-gradient(circle_at_50%_0%,rgba(147,51,234,0.05),transparent_40%)]">
          <div className="max-w-[1400px] mx-auto">{renderFrontendView()}</div>
        </div>
      </main>

      {/* FLOATING CHATBOT */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-500 ring-1 ring-purple-500/20">
           <div className="p-6 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-purple-600/10 rounded-xl text-purple-400"><BrainCircuit size={20} /></div>
                 <div><h4 className="text-sm font-bold text-white leading-none">Codex Assistant</h4><p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">Direct Pro Link</p></div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-zinc-600 hover:text-white transition-colors"><X size={20} /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                   <Sparkles size={32} />
                   <p className="text-xs font-light italic">Enter your inquiry, ascending soul.</p>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-zinc-800'}`}>
                      {m.text}
                   </div>
                </div>
              ))}
              {isChatTyping && <div className="flex justify-start"><div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none"><Loader2 size={16} className="animate-spin text-purple-400" /></div></div>}
              <div ref={chatEndRef} />
           </div>
           <form onSubmit={handleChatSubmit} className="p-6 bg-zinc-950 border-t border-zinc-900 flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Consult the Oracle..." className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-purple-500 transition-all" />
              <button type="submit" disabled={!chatInput.trim() || isChatTyping} className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 disabled:opacity-50 transition-all"><Send size={18} /></button>
           </form>
        </div>
      )}
    </div>
  );
};

export default App;

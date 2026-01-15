import React from 'react';
import { 
  LayoutDashboard, 
  Users as UsersIcon,
  BookOpen, 
  Leaf, 
  Sparkles, 
  ShoppingBag, 
  UserCircle, 
  Settings,
  Video as VideoIcon,
  Clapperboard,
  HardDrive,
  Target,
  Crown,
  History,
  Share2,
  HelpCircle,
  FileText,
  Mic2,
  Network,
  Presentation,
  ScanEye
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  activeView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
    { id: View.USERS, label: 'Users', icon: UsersIcon, section: 'Data' },
    { id: View.MEANINGS, label: 'Spiritual Meanings', icon: BookOpen, section: 'Data' },
    { id: View.HERBS, label: 'Herbs', icon: Leaf, section: 'Data' },
    { id: View.PRODUCTS, label: 'Products', icon: ShoppingBag, section: 'Data' },
    { id: View.DAILY_MESSAGES, label: 'Daily Messages', icon: Sparkles, section: 'Data' },
    { id: View.SOUL_PROFILES, label: 'Soul Profiles', icon: UserCircle, section: 'Data' },
    { id: View.VIDEOS, label: 'Videos', icon: VideoIcon, section: 'Data' },
    { id: View.SOUL_DECODER, label: 'Soul Decoder Input', icon: Target, section: 'Tools' },
    { id: View.FULL_READING_HUB, label: 'Full Reading Hub', icon: Network, section: 'Tools' },
    { id: View.VIDEO_ANALYSIS, label: 'Oracle Video Analysis', icon: ScanEye, section: 'Tools' },
    { id: View.STUDIO, label: 'Studio', icon: Clapperboard, section: 'Tools' },
    { id: View.AI_INTERVIEWER, label: 'AI Interviewer', icon: Mic2, section: 'Tools' },
    { id: View.MEDIA_JOBS, label: 'MediaJobs', icon: HardDrive, section: 'Tools' },
    { id: View.SETTINGS, label: 'SystemSettings', icon: Settings, section: 'System' },
    { id: View.MISSION_STATUS, label: 'Mission Status', icon: Presentation, section: 'System' },
    { id: View.INNER_CIRCLE, label: 'InnerCircle', icon: Crown, section: 'System' },
    { id: View.EVENT_LOGS, label: 'EventLogs', icon: History, section: 'System' },
    { id: View.QUORA_QUEUE, label: 'Quora Live Feed', icon: Share2, section: 'System' },
    { id: View.QUESTIONS_LIBRARY, label: 'QuestionsLibrary', icon: HelpCircle, section: 'System' },
    { id: View.DECODER_SESSIONS, label: 'DecoderSessions', icon: FileText, section: 'System' },
  ];

  const groupedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800 h-screen flex flex-col sticky top-0 overflow-y-auto overflow-x-hidden text-zinc-300">
      <div className="p-6">
        <h1 className="text-xl font-serif font-bold text-white tracking-tight">CODEX DASHBOARD</h1>
        <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-[0.2em] font-bold">Divine OS v2.0</p>
      </div>
      
      <nav className="flex-1 px-3 pb-8">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="mb-6">
            <h2 className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">{section}</h2>
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all duration-150 group ${
                      activeView === item.id 
                        ? 'bg-zinc-800 text-yellow-500' 
                        : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon size={16} className={activeView === item.id ? 'text-yellow-500' : 'text-zinc-500 group-hover:text-zinc-300'} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      {/* Footer Profile Section with Saint's Golden Glow */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950 sticky bottom-0">
        <div className="flex items-center gap-3 p-2">
          {/* Halo Container */}
          <div className="relative flex items-center justify-center">
            {/* The Outer Glow/Halo */}
            <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-md animate-pulse"></div>
            <div className="w-9 h-9 rounded-full bg-zinc-900 border border-yellow-500/30 flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Crown 
                size={16} 
                className="text-yellow-500 filter drop-shadow-[0_0_5px_rgba(234,179,8,0.8)]" 
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-200 truncate">Rarstar Thirteen El Bey</p>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-yellow-500"></span>
              </span>
              <p className="text-[10px] text-yellow-600/80 uppercase font-black tracking-widest">Divine Admin OS</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
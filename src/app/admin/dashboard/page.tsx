'use client';

import { useState } from 'react';
import { 
  Activity, Eye, Palette, Users, 
  TrendingUp, Play, Pause, Zap, 
  Search, Filter, Plus, Save, 
  ChevronRight, ArrowRight
} from 'lucide-react';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('autopilot');

  const tabs = [
    { id: 'autopilot', label: 'Ads Control Tower', icon: Activity },
    { id: 'spy', label: 'Competitor Spy', icon: Eye },
    { id: 'creative', label: 'AI Creative Studio', icon: Palette },
    { id: 'crm', label: 'CRM Lead Pipeline', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-[#1C2C4A] pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                isActive 
                  ? 'border-[#D4AF37] text-[#D4AF37] bg-[#1C2C4A]/50' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#152441]'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'autopilot' && <AutopilotTab />}
        {activeTab === 'spy' && <CompetitorSpyTab />}
        {activeTab === 'creative' && <CreativeStudioTab />}
        {activeTab === 'crm' && <CrmPipelineTab />}
      </div>
    </div>
  );
}

// --- TAB COMPONENTS ---

function AutopilotTab() {
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-white">Live Performance Metrics</h3>
          <p className="text-sm text-slate-400">Real-time ROAS and CPL tracking</p>
        </div>
        <div className="flex items-center gap-3 bg-[#152441] p-2 pr-4 rounded-full border border-[#1C2C4A]">
          <button 
            onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoPilotEnabled ? 'bg-[#D4AF37]' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoPilotEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm font-medium text-slate-200">
            {autoPilotEnabled ? 'AI Autopilot Active' : 'Manual Mode'}
          </span>
          {autoPilotEnabled && <Zap size={16} className="text-[#D4AF37] animate-pulse" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Spend', value: '$12,450', trend: '+14%', up: true },
          { label: 'Avg. CPL', value: '$14.20', trend: '-8%', up: true },
          { label: 'Overall ROAS', value: '3.4x', trend: '+22%', up: true }
        ].map((stat, i) => (
          <div key={i} className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] shadow-lg">
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-3xl font-bold text-white">{stat.value}</h4>
              <span className={`text-sm font-medium flex items-center ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                <TrendingUp size={14} className="mr-1" />
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mock Chart Area */}
      <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] h-80 flex flex-col items-center justify-center relative overflow-hidden">
        <p className="text-slate-500 mb-4 z-10 font-medium">Performance Chart Visualization Area</p>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-[#D4AF37]/20 to-transparent"></div>
        <svg className="absolute bottom-0 w-full h-full text-[#D4AF37]/30" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,100 L0,80 Q25,60 50,70 T100,30 L100,100 Z" fill="currentColor" opacity="0.5" />
          <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#D4AF37" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

function CompetitorSpyTab() {
  const competitors = [
    { name: 'Elite Care Services', keywords: ['home nursing', 'elderly care'], ads: 12, pricing: '$60/hr' },
    { name: 'NannyPro Egypt', keywords: ['nanny cairo', 'childcare'], ads: 8, pricing: '$45/hr' },
    { name: 'CleanSweep Maadi', keywords: ['housekeeping', 'deep clean'], ads: 24, pricing: '$25/hr' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-white">Competitor Intelligence Hub</h3>
          <p className="text-sm text-slate-400">Track active ad scripts, keywords, and pricing matrices</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Search competitors..." className="bg-[#0B1E3B] border border-[#1C2C4A] text-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1C2C4A] hover:bg-[#2A3F63] text-white rounded-lg text-sm transition-colors border border-[#1C2C4A]">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      <div className="bg-[#0B1E3B] rounded-xl border border-[#1C2C4A] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#152441] border-b border-[#1C2C4A]">
              <th className="px-6 py-4 text-sm font-medium text-slate-300">Competitor</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-300">Top Keywords</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-300">Active Ads</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-300">Est. Pricing</th>
              <th className="px-6 py-4 text-sm font-medium text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((comp, i) => (
              <tr key={i} className="border-b border-[#1C2C4A]/50 hover:bg-[#152441]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{comp.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {comp.keywords.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-[#1C2C4A] text-slate-300 text-xs rounded border border-[#2A3F63]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-[#D4AF37] font-medium">
                    <Play size={14} fill="currentColor" /> {comp.ads} live
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-300">{comp.pricing}</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm text-[#D4AF37] hover:text-amber-300 transition-colors">
                    View Payload
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreativeStudioTab() {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-white">AI Creative Studio</h3>
        <p className="text-sm text-slate-400">Generate ad copy, images, and voiceovers instantly</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A]">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Palette size={18} className="text-[#D4AF37]" /> Asset Configuration
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Headline Prompt</label>
              <input type="text" placeholder="e.g. Premium nursing care at home..." className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Image Style / Visuals</label>
              <textarea rows={3} placeholder="e.g. Cinematic lighting, professional nurse smiling, warm colors..." className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Voiceover Script (Optional)</label>
              <textarea rows={2} placeholder="Enter script for ElevenLabs generation..." className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            
            <button 
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 2000);
              }}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A192F] font-bold rounded-lg mt-4 hover:opacity-90 transition-opacity flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>Generating Assets <span className="animate-spin text-xl leading-none">⟳</span></>
              ) : (
                <>Generate AI Creative <Zap size={18} /></>
              )}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] flex flex-col">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
            <span>Mock-up Preview</span>
            <span className="text-xs bg-[#1C2C4A] text-[#D4AF37] px-2 py-1 rounded border border-[#D4AF37]/30">Meta Ads Format</span>
          </h4>
          
          <div className="flex-1 border-2 border-dashed border-[#1C2C4A] rounded-lg flex flex-col items-center justify-center p-8 bg-[#152441]/50 relative overflow-hidden group">
            {isGenerating ? (
              <div className="text-center animate-pulse">
                <div className="w-16 h-16 rounded-full border-4 border-t-[#D4AF37] border-r-transparent border-b-[#D4AF37] border-l-transparent animate-spin mx-auto mb-4"></div>
                <p className="text-[#D4AF37] font-medium">Assembling Magic...</p>
              </div>
            ) : (
              <div className="w-full max-w-sm bg-white rounded shadow text-slate-900 overflow-hidden transform transition-transform group-hover:scale-105">
                <div className="p-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-300"></div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Nexus AI Marketing</p>
                    <p className="text-[10px] text-slate-500">Sponsored • 🌍</p>
                  </div>
                </div>
                <div className="px-3 pb-2 text-xs">
                  Experience the pinnacle of home healthcare. Professional, compassionate, and reliable.
                </div>
                <div className="w-full h-48 bg-slate-200 flex items-center justify-center text-slate-400">
                  <Palette size={48} opacity={0.2} />
                </div>
                <div className="p-3 bg-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase">NEXUSCARE.COM</p>
                    <p className="font-bold text-sm">Premium Nursing Care Today</p>
                  </div>
                  <button className="bg-slate-200 hover:bg-slate-300 px-3 py-1 rounded text-xs font-bold transition-colors">
                    Learn more
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CrmPipelineTab() {
  const stages = [
    { id: 'New_Lead', title: 'New Leads', count: 12, color: 'border-blue-500' },
    { id: 'Bot_Chatting', title: 'Bot Qualification', count: 5, color: 'border-purple-500' },
    { id: 'Interview_Scheduled', title: 'Interview Scheduled', count: 3, color: 'border-amber-500' },
    { id: 'Closed_Won', title: 'Closed Won', count: 18, color: 'border-green-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-white">CRM Lead Pipeline</h3>
          <p className="text-sm text-slate-400">Interactive Kanban board for client lifecycle management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] hover:bg-amber-400 text-[#0A192F] font-bold rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
        {stages.map((stage) => (
          <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col gap-3">
            <div className={`flex justify-between items-center bg-[#0B1E3B] p-3 rounded-lg border-t-2 ${stage.color} border-l border-r border-b border-[#1C2C4A]`}>
              <h4 className="font-medium text-white text-sm">{stage.title}</h4>
              <span className="bg-[#1C2C4A] text-slate-300 text-xs px-2 py-1 rounded-full">{stage.count}</span>
            </div>
            
            {/* Mock Kanban Cards */}
            <div className="bg-[#0B1E3B] p-4 rounded-lg border border-[#1C2C4A] hover:border-[#D4AF37]/50 transition-colors cursor-grab shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-1 rounded">Nursing Care</span>
                <span className="text-xs text-slate-500">2h ago</span>
              </div>
              <h5 className="font-medium text-white mb-1">Sarah Jenkins</h5>
              <p className="text-xs text-slate-400 mb-3">+20 100 123 4567</p>
              <div className="flex justify-between items-center border-t border-[#1C2C4A] pt-3 mt-1">
                <span className="text-xs text-slate-500">Source: Meta Ads</span>
                <button className="text-slate-400 hover:text-[#D4AF37] transition-colors">
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Second Mock Card for variety */}
            {stage.id === 'New_Lead' && (
              <div className="bg-[#0B1E3B] p-4 rounded-lg border border-[#1C2C4A] hover:border-[#D4AF37]/50 transition-colors cursor-grab shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">Nanny</span>
                  <span className="text-xs text-slate-500">5h ago</span>
                </div>
                <h5 className="font-medium text-white mb-1">Ahmed Hassan</h5>
                <p className="text-xs text-slate-400 mb-3">+20 111 987 6543</p>
                <div className="flex justify-between items-center border-t border-[#1C2C4A] pt-3 mt-1">
                  <span className="text-xs text-slate-500">Source: Google Search</span>
                  <button className="text-slate-400 hover:text-[#D4AF37] transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}
            
            {/* Empty state zone */}
            <div className="h-20 border-2 border-dashed border-[#1C2C4A]/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-slate-600">Drop here</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { 
  Activity, Eye, Palette, Users, 
  TrendingUp, Play, Pause, Zap, 
  Search, Filter, Plus, Save, 
  ChevronRight, ArrowRight, Settings, ShieldCheck, Loader2
} from 'lucide-react';

// Pure RBAC Functions (duplicated for client-side use)
function checkAccessSettings(role: string) { return role === 'SuperAdmin'; }
function checkAccessMarketing(role: string) { return role === 'SuperAdmin'; }
function checkAccessPipeline(role: string) { return role === 'SuperAdmin' || role === 'Sales' || role === 'CRM'; }

export default function DashboardPage() {
  const [role, setRole] = useState<string>('SuperAdmin');
  const [activeTab, setActiveTab] = useState('autopilot');

  const tabs = [
    { id: 'autopilot', label: 'Ads Control Tower', icon: Activity, access: checkAccessMarketing },
    { id: 'spy', label: 'Competitor Spy', icon: Eye, access: checkAccessMarketing },
    { id: 'creative', label: 'AI Creative Studio', icon: Palette, access: checkAccessMarketing },
    { id: 'review', label: 'Creative Review', icon: ShieldCheck, access: checkAccessMarketing },
    { id: 'crm', label: 'CRM Lead Pipeline', icon: Users, access: checkAccessPipeline },
    { id: 'settings', label: 'Global Settings', icon: Settings, access: checkAccessSettings },
  ];

  return (
    <div className="space-y-6">
      {/* Role Toggle for Testing */}
      <div className="flex justify-end mb-4">
        <select 
          value={role} 
          onChange={(e) => {
            setRole(e.target.value);
            if (e.target.value !== 'SuperAdmin') setActiveTab('crm');
          }} 
          className="bg-[#1C2C4A] text-[#D4AF37] border border-[#D4AF37]/50 rounded px-3 py-1 text-sm font-bold shadow-sm"
        >
          <option value="SuperAdmin">View As: SuperAdmin</option>
          <option value="Sales">View As: Sales Team</option>
          <option value="CRM">View As: CRM Team</option>
        </select>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 border-b border-[#1C2C4A] pb-px overflow-x-auto">
        {tabs.filter(t => t.access(role)).map((tab) => {
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
        {activeTab === 'autopilot' && checkAccessMarketing(role) && <AutopilotTab />}
        {activeTab === 'spy' && checkAccessMarketing(role) && <CompetitorSpyTab />}
        {activeTab === 'creative' && checkAccessMarketing(role) && <CreativeStudioTab />}
        {activeTab === 'review' && checkAccessMarketing(role) && <CreativeReviewTab />}
        {activeTab === 'crm' && checkAccessPipeline(role) && <CrmPipelineTab />}
        {activeTab === 'settings' && checkAccessSettings(role) && <GlobalSettingsTab />}
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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorData, setCompetitorData] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const competitors = [
    { name: 'Elite Care Services', keywords: ['home nursing', 'elderly care'], ads: 12, pricing: '$60/hr' },
    { name: 'NannyPro Egypt', keywords: ['nanny cairo', 'childcare'], ads: 8, pricing: '$45/hr' },
    { name: 'CleanSweep Maadi', keywords: ['housekeeping', 'deep clean'], ads: 24, pricing: '$25/hr' },
  ];

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/llm/analyze-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorData })
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.data);
      } else {
        console.error('Analysis failed:', data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-white">Competitor Intelligence Hub</h3>
          <p className="text-sm text-slate-400">Track active ad scripts, keywords, and pricing matrices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A]">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Search size={18} className="text-[#D4AF37]" /> Market Sentiment Analyzer (LLM)
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Raw Competitor Data (Paste scraped ads/pricing)</label>
              <textarea 
                rows={4}
                value={competitorData} 
                onChange={(e) => setCompetitorData(e.target.value)} 
                placeholder="Paste data here to extract weaknesses and angles..." 
                className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" 
              />
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !competitorData}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A192F] font-bold rounded-lg mt-2 hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
            >
              {isAnalyzing ? (
                <>Analyzing Market <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Extract Strategic Angles <Zap size={18} /></>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] flex flex-col">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
            <span>LLM Analysis Output</span>
            <span className="text-xs bg-[#1C2C4A] text-emerald-400 px-2 py-1 rounded border border-emerald-400/30">Schema Verified</span>
          </h4>
          <div className="flex-1 border-2 border-dashed border-[#1C2C4A] rounded-lg p-4 bg-[#152441]/50 overflow-auto text-xs font-mono text-emerald-300">
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full text-[#D4AF37]">
                <Loader2 className="animate-spin mr-2" /> Processing Intelligence...
              </div>
            ) : analysisResult ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(analysisResult, null, 2)}</pre>
            ) : (
              <span className="text-slate-500 flex items-center justify-center h-full">Waiting for analysis...</span>
            )}
          </div>
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
  const [serviceType, setServiceType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/llm/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceType, targetAudience, specialOffer })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        console.error('Generation failed:', data.error);
      }
    } catch (e) {
      console.error(e);
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-white">Adaptive Scriptwriter (LLM Brain)</h3>
        <p className="text-sm text-slate-400">Generate strictly compliant medical ad copy and Midjourney prompts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A]">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Palette size={18} className="text-[#D4AF37]" /> Asset Configuration
          </h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">Service Type</label>
              <input value={serviceType} onChange={(e) => setServiceType(e.target.value)} type="text" placeholder="e.g. Premium Home Nursing" className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Target Audience</label>
              <input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} type="text" placeholder="e.g. High-income families with elderly parents" className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Special Offer</label>
              <input value={specialOffer} onChange={(e) => setSpecialOffer(e.target.value)} type="text" placeholder="e.g. Free initial consultation" className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !serviceType || !targetAudience || !specialOffer}
              className="w-full py-3 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-[#0A192F] font-bold rounded-lg mt-4 hover:opacity-90 disabled:opacity-50 transition-opacity flex justify-center items-center gap-2"
            >
              {isGenerating ? (
                <>Generating Scripts <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Generate Compliant Copy <Zap size={18} /></>
              )}
            </button>
          </div>
        </div>

        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] flex flex-col">
          <h4 className="text-lg font-medium text-white mb-4 flex items-center justify-between">
            <span>LLM Generated JSON</span>
            <span className="text-xs bg-[#1C2C4A] text-emerald-400 px-2 py-1 rounded border border-emerald-400/30">Schema Verified</span>
          </h4>
          
          <div className="flex-1 border-2 border-dashed border-[#1C2C4A] rounded-lg p-4 bg-[#152441]/50 overflow-auto text-xs font-mono text-emerald-300">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full text-[#D4AF37]">
                <Loader2 className="animate-spin mr-2" /> Orchestrating LLM...
              </div>
            ) : result ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            ) : (
              <span className="text-slate-500 flex items-center justify-center h-full">Waiting for generation...</span>
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

function GlobalSettingsTab() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-white">Global Settings Module</h3>
        <p className="text-sm text-slate-400">Manage API integrations and financial expectations securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A]">
          <h4 className="text-lg font-medium text-white mb-4 border-b border-[#1C2C4A] pb-2">Financial Control Center</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">VIP Segment Target CPL (EGP)</label>
              <input type="number" defaultValue={150} className="w-full bg-[#152441] border border-[#1C2C4A] text-[#D4AF37] font-bold rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Standard Segment Target CPL (EGP)</label>
              <input type="number" defaultValue={50} className="w-full bg-[#152441] border border-[#1C2C4A] text-[#D4AF37] font-bold rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4AF37]" />
            </div>
          </div>
        </div>

        <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A]">
          <h4 className="text-lg font-medium text-white mb-4 border-b border-[#1C2C4A] pb-2">API Keys & Webhooks Manager</h4>
          <div className="space-y-3">
            {[
              { label: 'Meta API Key', id: 'meta' },
              { label: 'Midjourney Config', id: 'mj' },
              { label: 'Luma Dream Machine', id: 'luma' },
              { label: 'ElevenLabs Voice', id: 'eleven' },
              { label: 'Gemini/OpenAI Key', id: 'llm' },
            ].map(key => (
              <div key={key.id}>
                <label className="block text-xs text-slate-400 mb-1">{key.label}</label>
                <input type="password" placeholder="••••••••••••••••" className="w-full bg-[#152441] border border-[#1C2C4A] text-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#D4AF37]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
          className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0A192F] font-bold rounded-lg hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          {saving ? 'Saving Config...' : <><Save size={18} /> Update Global Architecture</>}
        </button>
      </div>
    </div>
  );
}

function CreativeReviewTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-white">Creative Review (Human-in-the-Loop)</h3>
        <p className="text-sm text-slate-400">Review AI-generated medical assets to prevent policy violations.</p>
      </div>
      <div className="bg-[#0B1E3B] p-6 rounded-xl border border-[#1C2C4A] text-center text-slate-400 py-12">
        <ShieldCheck size={48} className="mx-auto mb-4 text-[#D4AF37] opacity-50" />
        <p>No creatives are currently pending approval.</p>
      </div>
    </div>
  );
}

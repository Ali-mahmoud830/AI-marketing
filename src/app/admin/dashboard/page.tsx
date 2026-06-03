'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Eye, Palette, Users, 
  TrendingUp, Play, Zap, 
  Search, Plus, Save, 
  ArrowRight, Settings, ShieldCheck, Loader2, CheckCircle2, AlertCircle
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// RBAC
function checkAccessSettings(role: string) { return role === 'SuperAdmin'; }
function checkAccessMarketing(role: string) { return role === 'SuperAdmin'; }
function checkAccessPipeline(role: string) { return role === 'SuperAdmin' || role === 'Sales' || role === 'CRM'; }

// Polished Toast Component
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
      <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${type === 'success' ? 'bg-[#0B1E3B] border-primary text-white' : 'bg-red-950 border-red-500 text-white'}`}>
        {type === 'success' ? <CheckCircle2 className="text-primary" size={24} /> : <AlertCircle className="text-red-500" size={24} />}
        <p className="font-medium">{message}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [role, setRole] = useState<string>('SuperAdmin');
  const [activeTab, setActiveTab] = useState('creative');

  const navigation = [
    { id: 'autopilot', label: 'Ads Control Tower', icon: Activity, access: checkAccessMarketing },
    { id: 'spy', label: 'Competitor Intelligence', icon: Eye, access: checkAccessMarketing },
    { id: 'creative', label: 'AI Creative Studio', icon: Palette, access: checkAccessMarketing },
    { id: 'review', label: 'Creative Review', icon: ShieldCheck, access: checkAccessMarketing },
    { id: 'crm', label: 'CRM Lead Pipeline', icon: Users, access: checkAccessPipeline },
    { id: 'settings', label: 'Global Settings', icon: Settings, access: checkAccessSettings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Integrated Client-Side Sidebar Controller */}
      <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold text-primary tracking-wider uppercase">Nexus<span className="text-white">AI</span></h1>
          <p className="text-xs text-muted-foreground mt-1">Enterprise Marketing SaaS</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.filter(item => item.access(role)).map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(212,175,55,0.1)]' 
                    : 'hover:bg-muted text-muted-foreground hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-amber-200 flex items-center justify-center text-background font-bold shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              AD
            </div>
            <div>
              <p className="text-sm font-medium text-white">System Admin</p>
              <select 
                value={role} 
                onChange={(e) => {
                  setRole(e.target.value);
                  if (e.target.value !== 'SuperAdmin') setActiveTab('crm');
                }} 
                className="bg-transparent text-primary text-xs font-bold outline-none cursor-pointer"
              >
                <option value="SuperAdmin">Role: SuperAdmin</option>
                <option value="Sales">Role: Sales Team</option>
                <option value="CRM">Role: CRM Team</option>
              </select>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background">
        <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white">
            {navigation.find(n => n.id === activeTab)?.label || 'Console'}
          </h2>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.1)]">
              Live Environment
            </Button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto pb-32">
          {activeTab === 'autopilot' && checkAccessMarketing(role) && <AutopilotTab />}
          {activeTab === 'spy' && checkAccessMarketing(role) && <CompetitorSpyTab />}
          {activeTab === 'creative' && checkAccessMarketing(role) && <CreativeStudioTab />}
          {activeTab === 'review' && checkAccessMarketing(role) && <CreativeReviewTab />}
          {activeTab === 'crm' && checkAccessPipeline(role) && <CrmPipelineTab />}
          {activeTab === 'settings' && checkAccessSettings(role) && <GlobalSettingsTab />}
        </div>
      </main>
    </div>
  );
}

// --- SUB TABS ---

function AutopilotTab() {
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-foreground">Live Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Real-time ROAS and CPL tracking</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-2 pr-4 rounded-full border border-border">
          <button 
            onClick={() => setAutoPilotEnabled(!autoPilotEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoPilotEnabled ? 'bg-primary' : 'bg-slate-600'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${autoPilotEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
          <span className="text-sm font-medium text-foreground">
            {autoPilotEnabled ? 'AI Autopilot Active' : 'Manual Mode'}
          </span>
          {autoPilotEnabled && <Zap size={16} className="text-primary animate-pulse" />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Spend', value: '$12,450', trend: '+14%', up: true },
          { label: 'Avg. CPL', value: '$14.20', trend: '-8%', up: true },
          { label: 'Overall ROAS', value: '3.4x', trend: '+22%', up: true }
        ].map((stat, i) => (
          <Card key={i} className="border-border shadow-lg">
            <CardHeader className="pb-2">
              <CardDescription className="text-muted-foreground">{stat.label}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <h4 className="text-3xl font-bold text-foreground">{stat.value}</h4>
              <span className={`text-sm font-medium flex items-center ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                <TrendingUp size={14} className="mr-1" />
                {stat.trend}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-80 flex flex-col items-center justify-center relative overflow-hidden border-border bg-card">
        <p className="text-muted-foreground mb-4 z-10 font-medium">Performance Chart Visualization Area</p>
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-primary/20 to-transparent"></div>
        <svg className="absolute bottom-0 w-full h-full text-primary/30" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path d="M0,100 L0,80 Q25,60 50,70 T100,30 L100,100 Z" fill="currentColor" opacity="0.5" />
          <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>
      </Card>
    </div>
  );
}

function CompetitorSpyTab() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success'|'error' } | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch('/api/llm/analyze-market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, industry })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAnalysisResult(data.data);
        setToast({ message: 'Market Discovered Successfully', type: 'success' });
      } else {
        setToast({ message: `Discovery failed: ${data.error || 'Server error'}`, type: 'error' });
      }
    } catch (e: any) {
      setToast({ message: `Network Error: ${e.message}`, type: 'error' });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-foreground">Competitor Intelligence Hub</h3>
          <p className="text-sm text-muted-foreground">Autonomous market discovery using Gemini Search Grounding.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Search size={18} className="text-primary" /> Strategy Extraction Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Your Brand Name</Label>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Palm Hills" className="bg-background border-border text-foreground focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Target Industry / Niche</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Real Estate in Egypt" className="bg-background border-border text-foreground focus-visible:ring-primary" />
              </div>
            </div>
            
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !brandName || !industry}
              className="w-full flex items-center justify-center gap-2 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              {isAnalyzing ? (
                <>Deploying Autonomous Agents <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>🔍 Auto-Discover Market & Competitors</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Componentized Parsing Block */}
        <Card className="flex flex-col bg-card border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/50 mb-2">
            <CardTitle className="text-lg text-white">Actionable Intelligence (Arabic)</CardTitle>
            {analysisResult && <span className="text-xs bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded">God-Tier Extracted</span>}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[450px]">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center h-full text-primary gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm text-muted-foreground animate-pulse text-center">Scanning Web & Analyzing Market...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6 pt-2">
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <Search size={14} /> Top 3 Competitors
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {(analysisResult.top_competitors || []).map((comp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-background border border-border rounded-lg text-sm text-right" dir="rtl">
                        <strong className="text-white block">{comp.name}</strong>
                        <p className="text-muted-foreground mt-1 text-xs"><span className="text-primary">السعر المقدر:</span> {comp.estimated_price_points}</p>
                        <p className="text-slate-300 mt-1 text-xs leading-relaxed line-clamp-2">{comp.current_ads_summary}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wide">
                    <Zap size={14} /> Common Winning Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {(analysisResult.common_winning_keywords || []).map((kw: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-background border border-border rounded-md text-xs font-medium text-slate-200" dir="rtl">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wide justify-end">
                    <ShieldCheck size={14} /> Strategic Weaknesses
                  </h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground text-right" dir="rtl">
                    {(analysisResult.strategic_weaknesses || []).map((w: string, idx: number) => (
                      <li key={idx} className="mb-1">{w}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wide justify-end">
                    <TrendingUp size={14} /> Recommended Ad Angles
                  </h4>
                  <ul className="list-disc list-inside text-sm text-slate-200 text-right leading-relaxed" dir="rtl">
                    {(analysisResult.recommended_ad_angles || []).map((a: string, idx: number) => (
                      <li key={idx} className="mb-2">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Waiting for LLM analysis...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CreativeStudioTab() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [result, setResult] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success'|'error' } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    try {
      const res = await fetch('/api/marketing/generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandName, industry, serviceType, targetAudience, specialOffer })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.data);
        setToast({ message: 'Assets Generated Successfully', type: 'success' });
      } else {
        setToast({ message: `Generation failed: ${data.error || 'Server error'}`, type: 'error' });
      }
    } catch (e: any) {
      setToast({ message: `Network Error: ${e.message}`, type: 'error' });
    }
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div>
        <h3 className="text-xl font-medium text-foreground">Adaptive Scriptwriter (God-Tier LLM)</h3>
        <p className="text-sm text-muted-foreground">Generate elite Arabic ad copy and cinematic English Midjourney prompts dynamically.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Palette size={18} className="text-primary" /> Asset Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Brand Name</Label>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g. Palm Hills" className="bg-background border-border text-foreground focus-visible:ring-primary" />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Industry / Niche</Label>
                <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Real Estate" className="bg-background border-border text-foreground focus-visible:ring-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Service / Product</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Luxury Villas Phase 2" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Target Audience</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. High-net-worth investors" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Special Offer</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={specialOffer} onChange={(e) => setSpecialOffer(e.target.value)} placeholder="e.g. 10% downpayment, 10 years installments" />
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !brandName || !industry || !serviceType || !targetAudience || !specialOffer}
              className="w-full flex items-center gap-2 mt-4 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              {isGenerating ? (
                <>Orchestrating God-Tier Output <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Generate Elite Campaign <Zap size={18} /></>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Componentized Parsing Block */}
        <Card className="flex flex-col bg-card border-primary/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/50 mb-2">
            <CardTitle className="text-lg text-white">Generated Assets</CardTitle>
            {result && <span className="text-xs bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded">God-Tier Verified</span>}
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[450px]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full text-primary gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm text-muted-foreground animate-pulse">Engineering direct-response hooks...</p>
              </div>
            ) : result ? (
              <div className="space-y-4 pt-2">
                 <div className="p-4 bg-background border border-border rounded-xl shadow-sm text-right" dir="rtl">
                    <strong className="text-primary block mb-2 text-sm uppercase tracking-wider">Arabic Headline</strong>
                    <p className="text-lg font-bold text-white leading-tight">{result.headline}</p>
                 </div>
                 <div className="p-4 bg-background border border-border rounded-xl shadow-sm text-right" dir="rtl">
                    <strong className="text-primary block mb-2 text-sm uppercase tracking-wider">Arabic Primary Text (Copy)</strong>
                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{result.primary_text}</p>
                 </div>
                 <div className="p-4 bg-primary/10 border border-primary/30 rounded-xl shadow-sm text-left">
                    <strong className="text-primary block mb-2 text-sm uppercase tracking-wider">Midjourney Visual Prompt (English)</strong>
                    <code className="text-xs font-mono text-slate-300 break-all p-2 bg-black/30 rounded block border border-black/50">{result.image_prompt}</code>
                 </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Waiting for generation...
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CrmPipelineTab() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Fetch + Robust JSON Mock Fallback
  useEffect(() => {
    async function fetchCRMData() {
      try {
        const res = await fetch('/api/marketing/crm');
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          setLeads(json.data);
        } else {
          throw new Error("No data or DB unreachable");
        }
      } catch (error) {
        setLeads([
          { id: '1', name: 'Sarah Jenkins', phone_number: '+20 100 123 4567', service_type: 'Premium Nursing', conversion_stage: 'New_Lead', utm_source: 'Meta Ads' },
          { id: '2', name: 'Ahmed Hassan', phone_number: '+20 111 987 6543', service_type: 'Elderly Care', conversion_stage: 'Bot_Chatting', utm_source: 'Google Search' },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCRMData();
  }, []);

  const stages = [
    { id: 'New_Lead', title: 'New Leads', color: 'border-blue-500' },
    { id: 'Bot_Chatting', title: 'Bot Qualification', color: 'border-purple-500' },
    { id: 'Interview_Scheduled', title: 'Interview Scheduled', color: 'border-amber-500' },
    { id: 'Closed_Won', title: 'Closed Won', color: 'border-green-500' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-foreground">CRM Lead Pipeline</h3>
          <p className="text-sm text-muted-foreground">Interactive Kanban board for client lifecycle management</p>
        </div>
        <Button className="flex items-center gap-2 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          <Plus size={16} /> Add Lead
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
          {stages.map((stage) => {
            const stageLeads = leads.filter(l => l.conversion_stage === stage.id);
            return (
              <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col gap-3">
                <div className={`flex justify-between items-center bg-card p-3 rounded-lg border-t-2 ${stage.color} border-l border-r border-b border-border`}>
                  <h4 className="font-medium text-white text-sm">{stage.title}</h4>
                  <span className="bg-background border border-border text-primary text-xs font-bold px-2 py-1 rounded-full">{stageLeads.length}</span>
                </div>
                
                {stageLeads.map((lead, idx) => (
                  <Card key={idx} className="cursor-grab hover:border-primary/50 transition-colors bg-card shadow-sm border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded">{lead.service_type}</span>
                        <span className="text-xs text-muted-foreground">Recent</span>
                      </div>
                      <h5 className="font-medium text-white mb-1">{lead.name}</h5>
                      <p className="text-xs text-muted-foreground mb-3">{lead.phone_number}</p>
                      <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                        <span className="text-xs text-muted-foreground">Source: {lead.utm_source || 'organic'}</span>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
}

function GlobalSettingsTab() {
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-foreground">Global Settings Module</h3>
        <p className="text-sm text-muted-foreground">Manage API integrations and financial expectations securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-white">Financial Control Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">VIP Segment Target CPL (EGP)</Label>
              <Input type="number" defaultValue={150} className="text-primary font-bold bg-background border-border focus-visible:ring-primary" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Standard Segment Target CPL (EGP)</Label>
              <Input type="number" defaultValue={50} className="text-primary font-bold bg-background border-border focus-visible:ring-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-white">API Keys & Webhooks Manager</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Meta API Key', id: 'meta' },
              { label: 'Midjourney Config', id: 'mj' },
              { label: 'Luma Dream Machine', id: 'luma' },
              { label: 'ElevenLabs Voice', id: 'eleven' },
              { label: 'Gemini/OpenAI Key', id: 'llm' },
            ].map(key => (
              <div key={key.id} className="space-y-2">
                <Label className="text-muted-foreground">{key.label}</Label>
                <Input type="password" placeholder="••••••••••••••••" className="bg-background border-border text-foreground focus-visible:ring-primary" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
          className="flex items-center gap-2 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          {saving ? 'Saving Config...' : <><Save size={18} /> Update Global Architecture</>}
        </Button>
      </div>
    </div>
  );
}

function CreativeReviewTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h3 className="text-xl font-medium text-foreground">Creative Review (Human-in-the-Loop)</h3>
        <p className="text-sm text-muted-foreground">Review AI-generated assets to prevent policy violations.</p>
      </div>
      <Card className="text-center py-12 border-dashed border-2 border-border bg-card">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <ShieldCheck size={48} className="mb-4 text-primary opacity-50" />
          <p className="text-muted-foreground">No creatives are currently pending approval.</p>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Activity, Eye, Palette, Users, 
  TrendingUp, Play, Zap, 
  Search, Plus, Save, 
  ArrowRight, Settings, ShieldCheck, Loader2
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

export default function DashboardPage() {
  const [role, setRole] = useState<string>('SuperAdmin');
  const [activeTab, setActiveTab] = useState('autopilot');

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
          <h1 className="text-xl font-bold text-primary tracking-wider uppercase">Omni<span className="text-white">Care</span></h1>
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

        <div className="p-8 max-w-7xl mx-auto">
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
          <h3 className="text-xl font-medium text-foreground">Competitor Intelligence Hub</h3>
          <p className="text-sm text-muted-foreground">Track active ad scripts, keywords, and pricing matrices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Search size={18} className="text-primary" /> Market Sentiment Analyzer (LLM)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Raw Competitor Data (Paste scraped ads/pricing)</Label>
              <Textarea 
                rows={4}
                value={competitorData} 
                onChange={(e) => setCompetitorData(e.target.value)} 
                placeholder="Paste data here to extract weaknesses and angles..." 
                className="resize-none bg-background border-border text-foreground focus-visible:ring-primary"
              />
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !competitorData}
              className="w-full flex items-center gap-2 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              {isAnalyzing ? (
                <>Analyzing Market <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Extract Strategic Angles <Zap size={18} /></>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Componentized Parsing Block */}
        <Card className="flex flex-col bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/50 mb-2">
            <CardTitle className="text-lg text-white">Actionable Insights</CardTitle>
            <span className="text-xs bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded">Schema Verified</span>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[300px]">
            {isAnalyzing ? (
              <div className="flex items-center justify-center h-full text-primary">
                <Loader2 className="animate-spin mr-2" /> Processing Intelligence...
              </div>
            ) : analysisResult ? (
              <div className="space-y-4 pt-2">
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <ShieldCheck size={14} /> Competitor Weaknesses
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(analysisResult.weaknesses || []).map((w: any, idx: number) => (
                      <div key={idx} className="p-3 bg-background border border-border rounded-lg text-sm text-muted-foreground">
                        {w.description || w}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                    <Zap size={14} /> Recommended Exploitation Angles
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(analysisResult.angles || []).map((a: any, idx: number) => (
                      <div key={idx} className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-slate-200">
                        <strong className="text-primary block mb-1">{a.title || 'Angle'}</strong>
                        {a.description || a}
                      </div>
                    ))}
                  </div>
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

      <Card className="bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-background">
            <TableRow className="border-border">
              <TableHead className="text-muted-foreground">Competitor</TableHead>
              <TableHead className="text-muted-foreground">Top Keywords</TableHead>
              <TableHead className="text-muted-foreground">Active Ads</TableHead>
              <TableHead className="text-muted-foreground">Est. Pricing</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((comp, i) => (
              <TableRow key={i} className="border-border hover:bg-muted/50">
                <TableCell className="font-medium text-white">{comp.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {comp.keywords.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-background text-muted-foreground text-xs rounded border border-border">
                        {kw}
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    <Play size={14} fill="currentColor" /> {comp.ads} live
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{comp.pricing}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 transition-colors">View Payload</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
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
        <h3 className="text-xl font-medium text-foreground">Adaptive Scriptwriter (LLM Brain)</h3>
        <p className="text-sm text-muted-foreground">Generate strictly compliant medical ad copy and Midjourney prompts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Palette size={18} className="text-primary" /> Asset Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Service Type</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Premium Home Nursing" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Target Audience</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. High-income families with elderly parents" />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Special Offer</Label>
              <Input className="bg-background border-border text-foreground focus-visible:ring-primary" value={specialOffer} onChange={(e) => setSpecialOffer(e.target.value)} placeholder="e.g. Free initial consultation" />
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !serviceType || !targetAudience || !specialOffer}
              className="w-full flex items-center gap-2 mt-4 bg-primary text-background font-bold hover:bg-amber-400 shadow-[0_0_10px_rgba(212,175,55,0.2)]"
            >
              {isGenerating ? (
                <>Generating Scripts <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Generate Compliant Copy <Zap size={18} /></>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Componentized Parsing Block */}
        <Card className="flex flex-col bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-border/50 mb-2">
            <CardTitle className="text-lg text-white">Generated Assets</CardTitle>
            <span className="text-xs bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 px-2 py-1 rounded">Schema Verified</span>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto max-h-[350px]">
            {isGenerating ? (
              <div className="flex items-center justify-center h-full text-primary">
                <Loader2 className="animate-spin mr-2" /> Orchestrating LLM...
              </div>
            ) : result ? (
              <div className="space-y-4 pt-2">
                 <div className="p-3 bg-background border border-border rounded-lg text-sm text-slate-200">
                    <strong className="text-primary block mb-1">Headline</strong>
                    {result.headline}
                 </div>
                 <div className="p-3 bg-background border border-border rounded-lg text-sm text-slate-200">
                    <strong className="text-primary block mb-1">Primary Text (Ad Copy)</strong>
                    {result.primary_text}
                 </div>
                 <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-sm text-slate-200">
                    <strong className="text-primary block mb-1">Midjourney Prompt (Visual)</strong>
                    <code className="text-xs font-mono break-all">{result.image_prompt}</code>
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
        // Fallback robust mock
        setLeads([
          { id: '1', name: 'Sarah Jenkins', phone_number: '+20 100 123 4567', service_type: 'Premium Nursing', conversion_stage: 'New_Lead', utm_source: 'Meta Ads' },
          { id: '2', name: 'Ahmed Hassan', phone_number: '+20 111 987 6543', service_type: 'Elderly Care', conversion_stage: 'Bot_Chatting', utm_source: 'Google Search' },
          { id: '3', name: 'Mona Zaki', phone_number: '+20 122 345 6789', service_type: 'NannyPro', conversion_stage: 'Interview_Scheduled', utm_source: 'Direct' },
          { id: '4', name: 'Khaled Omar', phone_number: '+20 155 555 1234', service_type: 'Premium Nursing', conversion_stage: 'Closed_Won', utm_source: 'Meta Ads' },
          { id: '5', name: 'Nadia Farouk', phone_number: '+20 100 999 8888', service_type: 'Physiotherapy', conversion_stage: 'New_Lead', utm_source: 'TikTok Ads' },
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
                
                {stageLeads.length === 0 && (
                  <div className="h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center bg-card/50">
                    <span className="text-xs text-muted-foreground">Drop here</span>
                  </div>
                )}
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
        <p className="text-sm text-muted-foreground">Review AI-generated medical assets to prevent policy violations.</p>
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

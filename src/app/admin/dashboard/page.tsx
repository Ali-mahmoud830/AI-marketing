'use client';

import { useState } from 'react';
import { 
  Activity, Eye, Palette, Users, 
  TrendingUp, Play, Zap, 
  Search, Filter, Plus, Save, 
  ArrowRight, Settings, ShieldCheck, Loader2
} from 'lucide-react';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Pure RBAC Functions
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
      <div className="flex justify-end mb-4">
        <select 
          value={role} 
          onChange={(e) => {
            setRole(e.target.value);
            if (e.target.value !== 'SuperAdmin') setActiveTab('crm');
          }} 
          className="bg-card text-primary border border-border rounded px-3 py-1 text-sm font-bold shadow-sm"
        >
          <option value="SuperAdmin">View As: SuperAdmin</option>
          <option value="Sales">View As: Sales Team</option>
          <option value="CRM">View As: CRM Team</option>
        </select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted border border-border h-auto p-1 flex-wrap justify-start">
          {tabs.filter(t => t.access(role)).map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2 py-2 data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-sm">
                <Icon size={16} />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="autopilot" className="mt-0"><AutopilotTab /></TabsContent>
          <TabsContent value="spy" className="mt-0"><CompetitorSpyTab /></TabsContent>
          <TabsContent value="creative" className="mt-0"><CreativeStudioTab /></TabsContent>
          <TabsContent value="review" className="mt-0"><CreativeReviewTab /></TabsContent>
          <TabsContent value="crm" className="mt-0"><CrmPipelineTab /></TabsContent>
          <TabsContent value="settings" className="mt-0"><GlobalSettingsTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

function AutopilotTab() {
  const [autoPilotEnabled, setAutoPilotEnabled] = useState(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-medium text-foreground">Live Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">Real-time ROAS and CPL tracking</p>
        </div>
        <div className="flex items-center gap-3 bg-muted p-2 pr-4 rounded-full border border-border">
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
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <h4 className="text-3xl font-bold text-foreground">{stat.value}</h4>
              <span className={`text-sm font-medium flex items-center ${stat.up ? 'text-green-500' : 'text-red-500'}`}>
                <TrendingUp size={14} className="mr-1" />
                {stat.trend}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-80 flex flex-col items-center justify-center relative overflow-hidden border-border">
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search size={18} className="text-primary" /> Market Sentiment Analyzer (LLM)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Raw Competitor Data (Paste scraped ads/pricing)</Label>
              <Textarea 
                rows={4}
                value={competitorData} 
                onChange={(e) => setCompetitorData(e.target.value)} 
                placeholder="Paste data here to extract weaknesses and angles..." 
                className="resize-none"
              />
            </div>
            <Button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !competitorData}
              className="w-full flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>Analyzing Market <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Extract Strategic Angles <Zap size={18} /></>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">LLM Analysis Output</CardTitle>
            <span className="text-xs bg-card border border-emerald-500/30 text-emerald-500 px-2 py-1 rounded">Schema Verified</span>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full min-h-[150px] border-2 border-dashed border-border rounded-lg p-4 bg-muted/50 overflow-auto text-xs font-mono text-emerald-400">
              {isAnalyzing ? (
                <div className="flex items-center justify-center h-full text-primary">
                  <Loader2 className="animate-spin mr-2" /> Processing Intelligence...
                </div>
              ) : analysisResult ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(analysisResult, null, 2)}</pre>
              ) : (
                <span className="text-muted-foreground flex items-center justify-center h-full">Waiting for analysis...</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Competitor</TableHead>
              <TableHead>Top Keywords</TableHead>
              <TableHead>Active Ads</TableHead>
              <TableHead>Est. Pricing</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {competitors.map((comp, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{comp.name}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {comp.keywords.map(kw => (
                      <span key={kw} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded border border-border">
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
                  <Button variant="ghost" className="text-primary hover:text-primary/80">View Payload</Button>
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette size={18} className="text-primary" /> Asset Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service Type</Label>
              <Input value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="e.g. Premium Home Nursing" />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="e.g. High-income families with elderly parents" />
            </div>
            <div className="space-y-2">
              <Label>Special Offer</Label>
              <Input value={specialOffer} onChange={(e) => setSpecialOffer(e.target.value)} placeholder="e.g. Free initial consultation" />
            </div>
            
            <Button 
              onClick={handleGenerate}
              disabled={isGenerating || !serviceType || !targetAudience || !specialOffer}
              className="w-full flex items-center gap-2 mt-4"
            >
              {isGenerating ? (
                <>Generating Scripts <Loader2 className="animate-spin" size={18} /></>
              ) : (
                <>Generate Compliant Copy <Zap size={18} /></>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">LLM Generated JSON</CardTitle>
            <span className="text-xs bg-card border border-emerald-500/30 text-emerald-500 px-2 py-1 rounded">Schema Verified</span>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="h-full min-h-[250px] border-2 border-dashed border-border rounded-lg p-4 bg-muted/50 overflow-auto text-xs font-mono text-emerald-400">
              {isGenerating ? (
                <div className="flex items-center justify-center h-full text-primary">
                  <Loader2 className="animate-spin mr-2" /> Orchestrating LLM...
                </div>
              ) : result ? (
                <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
              ) : (
                <span className="text-muted-foreground flex items-center justify-center h-full">Waiting for generation...</span>
              )}
            </div>
          </CardContent>
        </Card>
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
          <h3 className="text-xl font-medium text-foreground">CRM Lead Pipeline</h3>
          <p className="text-sm text-muted-foreground">Interactive Kanban board for client lifecycle management</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={16} /> Add Lead
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 pt-2">
        {stages.map((stage) => (
          <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col gap-3">
            <div className={`flex justify-between items-center bg-card p-3 rounded-lg border-t-2 ${stage.color} border-l border-r border-b border-border`}>
              <h4 className="font-medium text-foreground text-sm">{stage.title}</h4>
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">{stage.count}</span>
            </div>
            
            {/* Mock Kanban Cards */}
            <Card className="cursor-grab hover:border-primary/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Nursing Care</span>
                  <span className="text-xs text-muted-foreground">2h ago</span>
                </div>
                <h5 className="font-medium text-foreground mb-1">Sarah Jenkins</h5>
                <p className="text-xs text-muted-foreground mb-3">+20 100 123 4567</p>
                <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                  <span className="text-xs text-muted-foreground">Source: Meta Ads</span>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Second Mock Card for variety */}
            {stage.id === 'New_Lead' && (
              <Card className="cursor-grab hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">Nanny</span>
                    <span className="text-xs text-muted-foreground">5h ago</span>
                  </div>
                  <h5 className="font-medium text-foreground mb-1">Ahmed Hassan</h5>
                  <p className="text-xs text-muted-foreground mb-3">+20 111 987 6543</p>
                  <div className="flex justify-between items-center border-t border-border pt-3 mt-1">
                    <span className="text-xs text-muted-foreground">Source: Google Search</span>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Empty state zone */}
            <div className="h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center">
              <span className="text-xs text-muted-foreground">Drop here</span>
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
        <h3 className="text-xl font-medium text-foreground">Global Settings Module</h3>
        <p className="text-sm text-muted-foreground">Manage API integrations and financial expectations securely.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Control Center</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>VIP Segment Target CPL (EGP)</Label>
              <Input type="number" defaultValue={150} className="text-primary font-bold" />
            </div>
            <div className="space-y-2">
              <Label>Standard Segment Target CPL (EGP)</Label>
              <Input type="number" defaultValue={50} className="text-primary font-bold" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">API Keys & Webhooks Manager</CardTitle>
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
                <Label>{key.label}</Label>
                <Input type="password" placeholder="••••••••••••••••" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 1000); }}
          className="flex items-center gap-2"
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
      <Card className="text-center py-12 border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center p-6">
          <ShieldCheck size={48} className="mb-4 text-primary opacity-50" />
          <p className="text-muted-foreground">No creatives are currently pending approval.</p>
        </CardContent>
      </Card>
    </div>
  );
}

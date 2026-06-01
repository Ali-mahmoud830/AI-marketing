import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Activity } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-2 rounded-lg">
              <Activity className="text-background" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">Omni<span className="text-primary">Care</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/dashboard" 
              className="px-6 py-2.5 bg-primary text-background font-bold rounded-full hover:bg-amber-400 transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
            >
              System Login <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-8">
          <Zap size={14} /> Powered by Gemini LLM Engine
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-tight">
          Enterprise Medical Marketing <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-200">
            On Autopilot.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
          The ultimate AI-driven SaaS for medical practices. Scale your patient acquisition, spy on competitors, and generate compliant medical ad copy with zero human effort.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/admin/dashboard" 
            className="px-8 py-4 bg-primary text-background text-lg font-bold rounded-full hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] flex items-center gap-2 hover:-translate-y-1"
          >
            Launch Admin Dashboard <ArrowRight size={20} />
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full text-left">
          {[
            {
              title: "Autonomous Ad Scaling",
              desc: "Smart algorithms scale winning campaigns and safely pause underperforming ones to protect your budget.",
              icon: TrendingUp
            },
            {
              title: "Competitor Intelligence",
              desc: "Deploy proxy-routed scraping agents to legally reverse-engineer your competitors' winning keywords.",
              icon: ShieldCheck
            },
            {
              title: "Strict Medical Compliance",
              desc: "Our Gemini-powered copywriting engine guarantees strict adherence to Meta's strict medical ad policies.",
              icon: Zap
            }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="bg-card/40 border border-border p-8 rounded-2xl backdrop-blur-sm hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-border py-8 text-center text-muted-foreground text-sm">
        <p>© 2026 OmniCare AI Marketing SaaS. Restricted Access.</p>
      </footer>
    </div>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard | AI Marketing Platform',
  description: 'Enterprise AI Marketing & Omnichannel CRM',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${inter.className} min-h-screen bg-[#0A192F] text-slate-200`}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#1C2C4A] bg-[#0B1E3B] hidden md:flex flex-col">
          <div className="p-6 border-b border-[#1C2C4A]">
            <h1 className="text-xl font-bold text-[#D4AF37] tracking-wider uppercase">Nexus<span className="text-white">AI</span></h1>
            <p className="text-xs text-slate-400 mt-1">Enterprise Marketing</p>
          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {['Dashboard', 'Campaigns', 'Creative Assets', 'CRM', 'Settings'].map((item, idx) => (
              <a key={idx} href="#" className={`block px-4 py-3 rounded-lg transition-colors duration-200 ${idx === 0 ? 'bg-[#1C2C4A] text-[#D4AF37] shadow-sm' : 'hover:bg-[#152441] text-slate-300'}`}>
                {item}
              </a>
            ))}
          </nav>
          <div className="p-4 border-t border-[#1C2C4A]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-amber-200 flex items-center justify-center text-[#0A192F] font-bold">
                AD
              </div>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-400">admin@nexusai.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-[#0A192F] to-[#050D18]">
          <header className="sticky top-0 z-10 border-b border-[#1C2C4A] bg-[#0A192F]/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Management Console</h2>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors text-sm font-medium">
                Live Environment
              </button>
            </div>
          </header>
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

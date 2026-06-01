import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[#0A192F] text-white font-sans">
      <main className="text-center p-8">
        <h1 className="text-5xl font-bold mb-6 text-[#D4AF37]">NEXUSAI</h1>
        <p className="text-xl mb-10 text-gray-300">Enterprise AI Marketing & Omnichannel Platform</p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/admin/dashboard" 
            className="px-8 py-3 bg-[#D4AF37] text-[#0A192F] font-bold rounded-lg hover:bg-yellow-500 transition-all"
          >
            Enter Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

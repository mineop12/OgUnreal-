import { ArrowRight, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export function Hero({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="relative pt-32 pb-20 lg:pt-32 lg:pb-20 overflow-hidden bg-[#F8FAFC]">
      <div className="absolute inset-0 z-0 hidden lg:block">
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 lg:p-12 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden">
          <div className="flex-1 text-center lg:text-left relative z-10">
            <div className="flex gap-2 mb-4 justify-center lg:justify-start">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">UE5 Ready</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Curated</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] tracking-tight mb-4 leading-tight">
              Premium Unreal Engine Assets
            </h1>
            <p className="text-lg text-[#64748B] mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover high-quality UE5 projects, environments, blueprints, materials, and game-ready assets curated by OGUnreal.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button
                onClick={() => onNavigate('browse')}
                className="inline-flex items-center justify-center gap-2 bg-[#2563EB] text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
              >
                Browse Store
              </button>
              <button
                onClick={() => onNavigate('free')}
                className="inline-flex items-center justify-center gap-2 bg-white text-[#0F172A] border border-slate-200 px-8 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors"
              >
                View Free Assets
              </button>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-md hidden md:flex gap-4 justify-center items-center z-10">
             <div className="w-40 h-56 bg-slate-100 rounded-xl border border-slate-200 p-3 transform rotate-3 shadow-md flex flex-col justify-end">
               <div className="h-24 w-full bg-slate-300 rounded-lg absolute top-3 left-3 right-3" style={{ width: 'calc(100% - 24px)' }}></div>
               <div className="h-2 w-full bg-slate-200 rounded mb-2"></div>
               <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
             </div>
             <div className="w-40 h-56 bg-white rounded-xl border border-slate-200 p-3 transform -rotate-3 shadow-xl flex flex-col justify-end relative">
               <div className="h-24 w-full bg-blue-100 rounded-lg absolute top-3 left-3 right-3 flex items-center justify-center text-4xl" style={{ width: 'calc(100% - 24px)' }}>🏰</div>
               <div className="h-2 w-full bg-slate-100 rounded mb-2 mt-auto"></div>
               <div className="h-2 w-2/3 bg-slate-100 rounded mb-4"></div>
               <div className="flex justify-between items-center w-full">
                 <span className="text-[10px] font-bold text-green-500">FREE</span>
                 <span className="text-[8px] px-1 bg-slate-100 rounded">UE5</span>
               </div>
             </div>
          </div>
          
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 z-0"></div>
        </div>
      </div>
    </div>
  );
}

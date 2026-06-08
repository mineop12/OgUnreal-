export function Footer({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center text-white font-bold text-lg italic">
                U
              </div>
              <span className="font-bold text-xl tracking-tight text-[#0F172A]">
                OGUnreal <span className="text-[#2563EB]">Assets</span>
              </span>
            </div>
            <p className="text-[#64748B] text-sm leading-relaxed mb-6">
              Premium Unreal Engine assets curated for game developers, students, and indie creators.
            </p>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><button onClick={() => onNavigate('home')} className="hover:text-[#2563EB] transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#2563EB] transition-colors">Browse Assets</button></li>
              <li><button onClick={() => onNavigate('free')} className="hover:text-[#2563EB] transition-colors">Free Assets</button></li>
              <li><button onClick={() => onNavigate('library')} className="hover:text-[#2563EB] transition-colors">Library</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold mb-4">Categories</h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#2563EB] transition-colors">Complete Projects</button></li>
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#2563EB] transition-colors">Environments</button></li>
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#2563EB] transition-colors">Blueprints</button></li>
              <li><button onClick={() => onNavigate('browse')} className="hover:text-[#2563EB] transition-colors">Materials</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#0F172A] font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-[#64748B]">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-[#2563EB] transition-colors">Contact Us</button></li>
              <li><a href="#" className="hover:text-[#2563EB] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[#2563EB] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#2563EB] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#64748B] text-sm">
            © 2026 OGUnreal Assets. All Rights Reserved.
          </p>
          <button 
            onClick={() => onNavigate('admin')}
            className="text-xs text-[#64748B] hover:text-[#2563EB] transition-colors"
          >
            Admin Access
          </button>
        </div>
      </div>
    </footer>
  );
}

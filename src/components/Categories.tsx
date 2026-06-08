import { Box, Map, Cpu, Palette, Hexagon, Sparkles, Layout, Layers } from 'lucide-react';

export const CATEGORIES = [
  { id: 'projects', name: 'Complete Projects', icon: Box, desc: 'Ready-to-use game templates' },
  { id: 'environments', name: 'Environments', icon: Map, desc: 'High-quality world levels' },
  { id: 'blueprints', name: 'Blueprints', icon: Cpu, desc: 'Advanced game logic' },
  { id: 'materials', name: 'Materials', icon: Palette, desc: 'PBR surface shaders' },
  { id: 'models', name: '3D Models', icon: Hexagon, desc: 'Characters and props' },
  { id: 'vfx', name: 'VFX', icon: Sparkles, desc: 'Particle systems and effects' },
  { id: 'ui', name: 'UI Kits', icon: Layout, desc: 'Menus and HUD elements' },
  { id: 'templates', name: 'Game Templates', icon: Layers, desc: 'Core mechanism frameworks' },
];

export function Categories({ onCategoryClick }: { onCategoryClick: (category: string) => void }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight sm:text-4xl">Browse by Category</h2>
          <p className="mt-4 text-lg text-[#64748B]">Find exactly what you need for your next Unreal Engine project.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-[#2563EB] hover:shadow-md transition-all text-left"
            >
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                <cat.icon className="w-6 h-6 text-[#64748B] group-hover:text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0F172A] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#64748B]">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

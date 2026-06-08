import { Shield, FastForward, CheckCircle, Lightbulb, Gamepad2, Award } from 'lucide-react';

export function Features() {
  const benefits = [
    { icon: Award, title: 'Curated UE5 Assets', desc: 'Every asset is hand-picked to ensure it meets high standards of quality and performance.' },
    { icon: FastForward, title: 'Fast Game Prototyping', desc: 'Speed up your development timeline with ready-to-use mechanics and environments.' },
    { icon: Shield, title: 'Clean Project Files', desc: 'Well-organized blueprints and materials, free from messy spaghetti code.' },
    { icon: Lightbulb, title: 'Beginner Friendly', desc: 'Designed to be easy to understand and integrate even if you are new to Unreal Engine.' },
    { icon: Gamepad2, title: 'Game Ready Assets', desc: 'Optimized for performance with proper LODs, collisions, and draw calls.' },
    { icon: CheckCircle, title: 'Free and Premium', desc: 'Access to high-quality free community assets alongside top-tier premium tools.' },
  ];

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight sm:text-4xl">Why Choose OGUnreal?</h2>
          <p className="mt-4 text-lg text-[#64748B]">Everything you need to build better games, faster.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#2563EB]/30 transition-all">
              <div className="w-12 h-12 bg-blue-50 text-[#2563EB] rounded-xl flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">{benefit.title}</h3>
              <p className="text-[#64748B] leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

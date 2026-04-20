import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Sparkles, Droplets, Gift, ChevronRight, Star, ShieldCheck, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const units = [
    {
      id: 'deep-cleaning',
      title: "Deep Soft Cleaning",
      slug: "/services/deep-cleaning",
      description: "Premium interior sanitisation for carpets, mattresses, and upholstery using eco-friendly methods.",
      icon: <Sparkles className="text-emerald-500" size={32} />,
      color: "bg-emerald-50",
      textColor: "text-emerald-700",
      accent: "bg-emerald-500",
      grid: "md:col-span-2 md:row-span-2"
    },
    {
      id: 'pressure-cleaning',
      title: "High Pressure",
      slug: "/services/pressure-cleaning",
      description: "Heavy-duty outdoor cleaning for roofs, paving, and walls.",
      icon: <Droplets className="text-teal-500" size={32} />,
      color: "bg-teal-50",
      textColor: "text-teal-700",
      accent: "bg-teal-500",
      grid: "md:col-span-1 md:row-span-1"
    },
    {
      id: 'gifting',
      title: "PersonaLŸised Gifting",
      slug: "/services/gifting",
      description: "Customised gifts for every occasion, crafted with care.",
      icon: <Gift className="text-rose-500" size={32} />,
      color: "bg-rose-50",
      textColor: "text-rose-700",
      accent: "bg-rose-500",
      grid: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="py-5 px-4 sm:px-6 border-b border-slate-100/80 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-lg">T</div>
            <span className="text-xl font-black text-slate-900 tracking-tight">TotalLŸ</span>
          </div>
          <span className="text-emerald-600 uppercase tracking-widest text-[9px] font-bold hidden xs:block">Premium Service Hub</span>
          <span className="text-slate-400 text-xs font-semibold">🇿🇦 South Africa</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-10 pb-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-900 mb-5 tracking-tight leading-[1.1]">
              One Hub.<br/>
              <span className="text-emerald-500">Unmatched Service.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-2">
              TotalLŸ connects you with premium cleaning and gifting services 
              built on trust, efficiency, and the South African spirit of excellence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex justify-center gap-4 sm:gap-8 text-slate-400 flex-wrap"
          >
             <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">Trusted Professionals</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock size={18} className="text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium">Record-Time Efficiency</span>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Service Cards — single column on mobile, bento on md+ */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Mobile: stacked cards */}
          <div className="flex flex-col gap-4 md:hidden">
            {units.map((unit, idx) => (
              <motion.div
                key={unit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "group relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden cursor-pointer border border-slate-100 shadow-sm active:scale-[0.98] transition-transform",
                  unit.color
                )}
              >
                <Link to={unit.slug} className="absolute inset-0 z-30" aria-label={`Explore ${unit.title}`} />
                <div className="relative z-20 flex items-start gap-4">
                  <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                    {unit.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={cn("text-lg font-bold mb-1", unit.textColor)}>{unit.title}</h2>
                    <p className="text-slate-600 text-sm leading-relaxed">{unit.description}</p>
                  </div>
                </div>
                <div className="relative z-20 flex justify-end items-center gap-1 font-bold text-xs mt-4">
                  <span className={unit.textColor}>Explore</span>
                  <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-white", unit.accent)}>
                    <ChevronRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Desktop: bento grid */}
          <div className="hidden md:grid grid-cols-3 gap-6 auto-rows-[250px]">
             {units.map((unit, idx) => (
                <motion.div
                  key={unit.id}
                  layoutId={unit.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "group relative rounded-3xl p-8 flex flex-col justify-between overflow-hidden cursor-pointer border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300",
                    unit.color,
                    unit.grid
                  )}
                >
                  <Link to={unit.slug} className="absolute inset-0 z-30" aria-label={`Explore ${unit.title}`} />
                  <div className="relative z-20">
                    <div className="bg-white/80 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                      {unit.icon}
                    </div>
                    <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", unit.textColor)}>{unit.title}</h2>
                    <p className="text-slate-600 max-w-xs text-sm leading-relaxed">{unit.description}</p>
                  </div>
                  <div className="relative z-20 flex justify-end items-center gap-2 font-bold text-sm">
                     <span className={unit.textColor}>Explore Unit</span>
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1", unit.accent)}>
                        <ChevronRight size={18} />
                     </div>
                  </div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
                </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-14 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <div className="flex justify-center mb-6">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-emerald-400 fill-current" />)}
            </div>
            <p className="text-lg sm:text-2xl font-medium text-slate-800 italic leading-relaxed mb-6">
              "TotalLŸ is more than a service platform. It's a commitment to honesty, fairness, and excellence (Ihsaan) in everything we do."
            </p>
            <p className="font-bold text-slate-600 uppercase tracking-widest text-[10px]">Our Founding Core Values</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 sm:px-6 text-center text-slate-400 text-sm">
         <p>&copy; {new Date().getFullYear()} TotalLŸ South Africa. All Rights Reserved.</p>
         <div className="mt-4 flex justify-center gap-6 flex-wrap">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
         </div>
      </footer>
    </div>
  );
}

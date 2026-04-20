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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-8 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl">T</div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">TotalLŸ</span>
          </div>
          <div className="flex items-center gap-4 text-sm font-semibold">
            <span className="text-slate-400">South Africa</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-emerald-600 uppercase tracking-widest text-[10px]">Premium Service Hub</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
              One Hub. <br/>
              <span className="text-emerald-500">Unmatched Service.</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              TotalLŸ connects you with premium cleaning and gifting services 
              built on trust, efficiency, and the South African spirit of excellence.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex justify-center gap-8 text-slate-400"
          >
             <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-400" />
                <span className="text-sm font-medium">Trusted Professionals</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock size={20} className="text-emerald-400" />
                <span className="text-sm font-medium">Record-Time Efficiency</span>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
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
                    <h2 className={cn("text-2xl md:text-3xl font-bold mb-3", unit.textColor)}>
                      {unit.title}
                    </h2>
                    <p className="text-slate-600 max-w-xs text-sm leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  <div className="relative z-20 flex justify-end items-center gap-2 font-bold text-sm">
                     <span className={unit.textColor}>Explore Unit</span>
                     <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform group-hover:translate-x-1", unit.accent)}>
                        <ChevronRight size={18} />
                     </div>
                  </div>

                 {/* Decorative background circle */}
                 <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl" />
               </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-3xl mx-auto px-6 text-center">
            <div className="flex justify-center mb-8">
              {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-emerald-400 fill-current" />)}
            </div>
            <p className="text-2xl font-medium text-slate-800 italic leading-relaxed mb-8">
              "TotalLŸ is more than a service platform. It's a commitment to honesty, fairness, and excellence (Ihsaan) in everything we do."
            </p>
            <p className="font-bold text-slate-600 uppercase tracking-widest text-xs">Our Founding Core Values</p>
        </div>
      </section>

      {/* Footer Light */}
      <footer className="py-12 px-6 text-center text-slate-400 text-sm">
         <p>&copy; {new Date().getFullYear()} TotalLŸ South Africa. All Rights Reserved.</p>
         <div className="mt-4 flex justify-center gap-6">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
         </div>
      </footer>
    </div>
  );
}

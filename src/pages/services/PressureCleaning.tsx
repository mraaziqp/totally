import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle2, ChevronLeft, Droplets, Waves, Paintbrush, Home as HomeIcon, ArrowLeft, Loader2, Star } from 'lucide-react';
import BookingForm from '../../components/BookingForm';

export default function PressureCleaning() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stores/pressure-cleaning')
      .then(res => res.json())
      .then(data => {
        setStoreData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching store data:', err);
        setLoading(false);
      });
  }, []);

  const services = [
    {
      title: "Driveways & Paving",
      description: "Removing oil stains, weed buildup, and embedded dirt to restore the beauty of your property's entrance.",
      icon: Waves
    },
    {
      title: "Roof Cleaning",
      description: "Safe eradication of moss and algae to prolong roof life and enhance curb appeal without damage.",
      icon: HomeIcon
    },
    {
      title: "Exterior Walls",
      description: "Restoring brickwork and plastered walls to their original color by lifting years of grime and pollution.",
      icon: Paintbrush
    },
    {
      title: "Gutters & Fascias",
      description: "Clearing blockages and washing exterior trims to ensure proper drainage and a clean finish.",
      icon: Droplets
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-teal-500" />
        <p className="font-bold text-slate-800">Preparing storefront...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-teal-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-teal-500">TotalLŸ</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-2">High Pressure</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
            <a href="#booking" className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition-colors shadow-sm shadow-teal-500/20">Book Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-white">
        {storeData?.heroImageUrl && (
          <div className="absolute inset-0 z-0">
             <img 
               src={storeData.heroImageUrl} 
               referrerPolicy="no-referrer" 
               className="w-full h-full object-cover opacity-10 blur-sm scale-110" 
               alt="Pressure Hero"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-slate-50" />
          </div>
        )}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 rounded-full">
               {storeData?.tagline || "Industrial Grade Solutions"}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-8">
               {storeData?.heroHeadline || "TotalLŸ High Pressure Cleaning"}
            </h1>
            
            {/* Mission Statement */}
            <div className="relative mt-8 p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl text-slate-700 italic leading-relaxed text-xl shadow-sm">
               <Waves className="absolute -top-3 -left-3 text-teal-400" size={32} />
               {storeData?.missionText || "Restoring the exterior of your property with industrial-grade high-pressure solutions. We remove years of grime, moss, and weather damage efficiently and safely."}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Contact Phone</p>
                  <p className="text-lg font-bold text-slate-800">{storeData?.contactPhone || "[Insert Client Phone Number]"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Email Support</p>
                  <p className="text-lg font-bold text-slate-800">{storeData?.contactEmail || "info@totally.co.za"}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            id="booking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <BookingForm className="w-full max-w-lg shadow-2xl shadow-teal-500/10" storeSlug="pressure-cleaning" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
               {storeData?.servicesHeading || "Restore Your Curb Appeal"}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">Powerful solutions for every exterior surface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((item, index) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex gap-6"
              >
                <div className="shrink-0 w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-teal-500">
                  <item.icon size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10 leading-tight">
                  Industrial Power. <br/>
                  <span className="text-teal-400">TotalLŸ Efficiency.</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                   {[
                     { label: "Houses Restored", val: "500+" },
                     { label: "Client Satisfaction", val: "100%" },
                     { label: "Eco-Friendly", val: "Pure Water" },
                     { label: "ZAR Saved", val: "Millions" }
                   ].map(stat => (
                     <div key={stat.label}>
                        <p className="text-3xl font-black text-white mb-1">{stat.val}</p>
                        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                     </div>
                   ))}
                </div>
              </div>

              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-teal-50 p-12 rounded-[3rem] border border-teal-100 relative flex flex-col justify-center shadow-sm"
              >
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center text-white shadow-xl">
                  <Star size={40} fill="currentColor" />
                </div>
                <h3 className="text-xs font-black text-teal-600 mb-8 uppercase tracking-[0.2em] opacity-60">Verified Feedback</h3>
                <p className="text-2xl text-slate-800 font-medium italic leading-relaxed mb-10">
                  "{storeData?.testimonialText || "The pressure cleaning results were beyond my expectations. Years of grime disappeared in just a few hours. Truly professional work."}"
                </p>
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white font-bold text-xl">
                     {(storeData?.testimonialAuthor || "JC")[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-xl">{storeData?.testimonialAuthor || "James C."}</p>
                    <p className="text-teal-600 font-bold uppercase tracking-widest text-xs mt-1">{storeData?.testimonialAuthorRole || "Homeowner, CBD"}</p>
                  </div>
                </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
          <div className="md:col-span-2">
            <span className="text-2xl font-black text-white mb-4 block">TotalLŸ</span>
            <p className="max-w-sm">
              South Africa's premier pressure cleaning experts. We handle your property with the care it deserves.
            </p>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4 uppercase tracking-widest">Connect</h4>
             <ul className="space-y-3">
               <li>info@totally.co.za</li>
               <li>[Insert Phone Number]</li>
             </ul>
          </div>
          <div className="flex justify-start md:justify-end items-end">
            <p className="text-slate-600">© {new Date().getFullYear()} TotalLŸ (Pty) Ltd.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

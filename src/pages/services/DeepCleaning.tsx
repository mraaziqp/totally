import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Phone, Mail, CheckCircle2, Star, Sparkles, Droplets, Car, Sofa, Scissors, Home as HomeIcon, ArrowLeft, Loader2 } from 'lucide-react';
import BookingForm from '../../components/BookingForm';

export default function DeepCleaning() {
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stores/deep-cleaning')
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
      title: "Carpets",
      description: "Deep cleaning that removes embedded dirt, allergens, and tough stains for a fresh look and feel.",
      icon: Sparkles
    },
    {
      title: "Mattress",
      description: "Thorough sanitisation to eliminate dust mites, bacteria, and allergens, ensuring a healthier sleep.",
      icon: CheckCircle2
    },
    {
      title: "Vehicles",
      description: "Interior deep cleaning that lifts stains from seats, floors, and roofs, leaving your car spotless.",
      icon: Car
    },
    {
      title: "Rug Rejuvenation",
      description: "Specialised treatment to revive delicate rugs, restoring their original vibrant patterns and texture.",
      icon: Scissors
    },
    {
      title: "High Pressure (Outdoor)",
      description: "Powerful cleaning for roofs, windows, paving, and exterior walls to remove mould and grime.",
      icon: Droplets
    },
    {
      title: "Upholstery (Couches & Chairs)",
      description: "Deep fabric cleaning that removes odours and stains, giving new life to your lounge and dining sets.",
      icon: Sofa
    },
    {
      title: "Curtains",
      description: "Gentle yet effective cleaning that removes dust and pollutants without harming the fabric.",
      icon: Sparkles
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold text-slate-800">Preparing storefront...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar Placeholder */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-emerald-500 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-emerald-500">TotalLŸ</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 border-l border-slate-200 pl-2">Deep Cleaning</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-emerald-600 transition-colors">Services</a>
            <a href="#about" className="hover:text-emerald-600 transition-colors">About Us</a>
            <a href="#booking" className="bg-emerald-500 text-white px-6 py-2 rounded-full hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20">Book Now</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden bg-white">
        {storeData?.heroImageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
             <img 
               src={storeData.heroImageUrl} 
               referrerPolicy="no-referrer" 
               className="w-full h-full object-cover opacity-10 blur-sm scale-105" 
               alt="Hero Background"
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
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
               {storeData?.tagline || "Premium Service Unit"}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-8">
               {storeData?.heroHeadline || "TotalLŸ Deep Cleaning"}
            </h1>
            
            {/* Mission Statement */}
            <div className="relative mt-8 p-8 bg-white/60 backdrop-blur-sm border border-slate-100 rounded-3xl text-slate-700 italic leading-relaxed text-xl shadow-sm">
               <Sparkles className="absolute -top-3 -left-3 text-emerald-400" size={32} />
               {storeData?.missionText || "What truly sets us apart is not just the quality of our cleaning, but the way we work with people and the efficiency we bring to every job."}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Call or WhatsApp</p>
                  <p className="text-lg font-bold text-slate-800">{storeData?.contactPhone || "[Insert Client Phone Number]"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Email Us</p>
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
            <BookingForm className="w-full max-w-lg shadow-2xl shadow-emerald-500/10" storeSlug="deep-cleaning" />
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{storeData?.servicesHeading || "Our Specialised Services"}</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Standardised excellence across all domains of deep cleaning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((item, index) => (
              <motion.div 
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-emerald-500">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10" />
            <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
               {storeData?.aboutHeading || "Our Journey & Core Values"}
            </h2>
            <div className="space-y-6 text-slate-700 leading-relaxed">
              <div className="prose prose-slate max-w-none text-lg">
                {storeData?.aboutUsText ? (
                  <p className="whitespace-pre-wrap">{storeData.aboutUsText}</p>
                ) : (
                  <>
                    <p>
                      TotalLŸ was born from the vision of young entrepreneurs who wanted to redefine service excellence in South Africa. Guided by our Islamic school mentor, we embarked on this journey with a commitment to something deeper than just cleaning.
                    </p>
                    <p>
                      At the heart of everything we do are the values of <strong>honesty, fairness, trust, and ihsaan</strong> (excellence). We believe that being thorough in our work is an act of integrity, and we treat every home and office with the same respect we would our own.
                    </p>
                  </>
                )}
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {["Honesty", "Fairness", "Trust", "Ihsaan"].map(v => (
                  <div key={v} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-lg uppercase tracking-tight">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:pl-16">
            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-slate-50 p-12 rounded-[2.5rem] border border-slate-100 relative shadow-sm"
            >
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl">
                <Star size={40} fill="currentColor" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-8 uppercase tracking-widest text-xs opacity-50">Client Connection</h3>
              <p className="text-2xl text-slate-800 font-medium italic leading-relaxed mb-10">
                "{storeData?.testimonialText || "The TotalLŸ team brings a level of professionalism and efficiency that is rare. Their commitment to ihsaan is visible in every corner they clean."}"
              </p>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl">
                   {(storeData?.testimonialAuthor || "ML")[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-xl">{storeData?.testimonialAuthor || "Moulana Luqmaan"}</p>
                  <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs">{storeData?.testimonialAuthorRole || "Community Leader"}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <span className="text-2xl font-black text-white mb-4 block">TotalLŸ</span>
            <p className="max-w-sm mb-6">
              South Africa's premier multi-tenant service platform. Bringing efficiency and trust to every home and business.
            </p>
            <p className="flex items-center gap-2 text-sm">
              <HomeIcon size={14} /> Made with pride in South Africa 🇿🇦
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li>{storeData?.contactEmail || "info@totally.co.za"}</li>
              <li>{storeData?.contactPhone || "[Insert Client Phone Number]"}</li>
              <li>Cape Town, South Africa</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Business Units</h4>
            <ul className="space-y-4 text-sm">
              <li>Deep Soft Cleaning</li>
              <li>High Pressure Cleaning</li>
              <li>Personalised Gifting</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} TotalLŸ (Pty) Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
}


import React from 'react';
import { motion } from 'motion/react';
import { Home as HomeIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, color }: { title: string, color: string }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden"
      >
        <Link to="/" className="absolute top-6 left-6 p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 rounded-full transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div className={`w-20 h-20 ${color} rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg`}>
          <HomeIcon size={40} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{title}</h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          The <span className="font-bold">{title}</span> store front is currently under construction. 
          Check back soon for premium service options in this business unit.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
        >
          Return to Hub
        </Link>
      </motion.div>
    </div>
  );
}

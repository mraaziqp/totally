import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

export default function QuoteResponse() {
  const { token } = useParams<{ token: string }>();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [responding, setResponding] = useState<'accept' | 'decline' | null>(null);
  const [resultStatus, setResultStatus] = useState<string | null>(null);
  const [respondError, setRespondError] = useState('');

  useEffect(() => {
    fetch(`/api/quote?token=${encodeURIComponent(token || '')}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setQuote(data);
        setResultStatus(data.status);
        setLoading(false);
      })
      .catch(() => {
        setLoadError(true);
        setLoading(false);
      });
  }, [token]);

  const respond = async (action: 'accept' | 'decline') => {
    setResponding(action);
    setRespondError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, action }),
      });
      const data = await res.json();
      if (res.ok) {
        setResultStatus(data.status);
      } else {
        setRespondError(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setRespondError('Network error. Please try again.');
    } finally {
      setResponding(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="font-bold text-slate-700">Loading your quote...</p>
      </div>
    );
  }

  if (loadError || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center">
          <AlertCircle size={40} className="mx-auto mb-4 text-amber-500" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Quote Not Found</h1>
          <p className="text-slate-500 text-sm mb-6">This link may have expired or is invalid. Please contact us directly if you have questions about your quote.</p>
          <Link to="/" className="inline-block px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const formattedAmount = new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(Number(quote.amount || 0));
  const alreadyResponded = resultStatus === 'ACCEPTED' || resultStatus === 'DECLINED';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1.5 mb-4 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 rounded-full">
            {quote.storeName}
          </span>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Quote</h1>
          <p className="text-slate-500 text-sm">Dear {quote.customerName},</p>
        </div>

        <div className="bg-slate-50 border-2 border-emerald-200 rounded-2xl p-6 text-center mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Quoted Amount</p>
          <p className="text-4xl font-black text-emerald-600">{formattedAmount}</p>
        </div>

        {quote.message && (
          <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap mb-8 text-center">{quote.message}</p>
        )}

        {alreadyResponded ? (
          <div
            className={cn(
              'rounded-2xl p-6 text-center flex flex-col items-center gap-3',
              resultStatus === 'ACCEPTED' ? 'bg-emerald-50' : 'bg-slate-100'
            )}
          >
            {resultStatus === 'ACCEPTED' ? (
              <CheckCircle2 size={40} className="text-emerald-500" />
            ) : (
              <XCircle size={40} className="text-slate-400" />
            )}
            <p className="font-bold text-slate-900">
              {resultStatus === 'ACCEPTED' ? "You've accepted this quote" : "You've declined this quote"}
            </p>
            <p className="text-slate-500 text-sm">
              {resultStatus === 'ACCEPTED'
                ? "We've notified our team and you'll receive a confirmation email shortly."
                : 'Thank you for letting us know. Feel free to reach out if anything changes.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {respondError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-red-700 text-sm">
                <AlertCircle size={16} /> {respondError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => respond('accept')}
                disabled={responding !== null}
                className={cn(
                  'flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all',
                  responding !== null ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                )}
              >
                {responding === 'accept' ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                Accept Quote
              </button>
              <button
                onClick={() => respond('decline')}
                disabled={responding !== null}
                className={cn(
                  'flex items-center justify-center gap-2 py-4 rounded-xl font-bold border transition-all',
                  responding !== null ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-100' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                )}
              >
                {responding === 'decline' ? <Loader2 size={18} className="animate-spin" /> : <XCircle size={18} />}
                Decline Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

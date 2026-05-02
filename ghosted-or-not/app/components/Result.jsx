"use client";

import { useState, useEffect } from "react";

export default function Result({ result, reset }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  const {
    score,
    verdict,
    confidence,
    summary,
    whatTheyFeel,
    whatThisLooksLike,
    greenFlags,
    redFlags,
    whyThisIsHappening,
    keyMoment,
    prediction,
    advice,
  } = result;

  // Animate score counting up
  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.floor(score / 40));
    const timer = setInterval(() => {
      current += step;
      if (current >= score) {
        current = score;
        clearInterval(timer);
      }
      setAnimatedScore(current);
    }, 25);
    return () => clearInterval(timer);
  }, [score]);

  const handleShare = async () => {
    const text = `GhostedorNahh\n\nScore: ${score}/100\nVerdict: ${verdict}\n\n${summary}\n\nTry it: https://ghostedornot.com`;
    if (navigator.share) {
      try { await navigator.share({ title: "GhostedorNahh", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = `${(animatedScore / 100) * circumference} ${circumference}`;

  const themeColor = score >= 70 ? "text-emerald-500" : score >= 45 ? "text-amber-500" : "text-rose-500";

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-xl mx-auto text-[#52525b]">
      
      {/* ── Score Hero ────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-[#e4e4e7] shadow-sm text-center relative overflow-hidden">
        <button
          onClick={handleShare}
          className="absolute top-5 right-5 text-xs font-semibold px-4 py-2 bg-[#f4f4f5] border border-[#e4e4e7] hover:border-[#18181b] hover:text-[#18181b] rounded-full text-[#71717a] transition-all shadow-sm"
        >
          {copied ? "Copied ✓" : "Share"}
        </button>
        
        <div className="flex justify-center mb-8 relative">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg width="192" height="192" viewBox="0 0 192 192" className="transform -rotate-90 absolute inset-0">
              <circle cx="96" cy="96" r={radius} stroke="#f4f4f5" strokeWidth="14" fill="none" />
              <circle 
                cx="96" 
                cy="96" 
                r={radius} 
                stroke="currentColor" 
                strokeWidth="14" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                className={`transition-all duration-1000 ease-out ${themeColor}`}
              />
            </svg>
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-serif text-[#09090b] tracking-tight">{animatedScore}%</span>
              <span className="text-[10px] uppercase tracking-widest text-[#71717a] font-bold mt-2">Interest</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-serif text-[#09090b] mb-4">{verdict}</h2>
        <p className="text-[#52525b] text-[15px] leading-relaxed max-w-sm mx-auto font-medium">{summary}</p>
      </div>

      {/* ── Advice Section (High Focus) ────────────────────── */}
      {advice && (
        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#18181b] mb-3 flex items-center gap-2">
            <span className="text-xl">💡</span> What You Should Do
          </h3>
          <p className="text-[#27272a] text-lg font-serif leading-relaxed">{advice}</p>
        </div>
      )}

      {/* ── Deep Analysis ────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-[#e4e4e7] p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] space-y-8">
        <div>
          <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-2">What They Likely Feel</h3>
          <p className="text-[#3f3f46] font-medium leading-relaxed">{whatTheyFeel}</p>
        </div>
        
        <div className="pt-6 border-t border-[#f4f4f5]">
          <h3 className="text-xs font-bold text-[#71717a] uppercase tracking-wider mb-2">Why This Is Happening</h3>
          <p className="text-[#3f3f46] font-medium leading-relaxed">{whyThisIsHappening}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[#f4f4f5]">
          <div className="bg-[#f4f4f5] p-4 rounded-2xl border border-[#e4e4e7]">
            <p className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1 font-bold">Looks Like</p>
            <p className="font-semibold text-[#18181b] capitalize">{whatThisLooksLike}</p>
          </div>
          <div className="bg-[#f4f4f5] p-4 rounded-2xl border border-[#e4e4e7]">
            <p className="text-[10px] text-[#71717a] uppercase tracking-wider mb-1 font-bold">Prediction</p>
            <p className="font-semibold text-[#18181b]">{prediction}</p>
          </div>
        </div>
      </div>

      {/* ── Key Moment ──────────────────────────────────── */}
      {keyMoment && (
        <div className="bg-white rounded-3xl border border-[#e4e4e7] p-8 text-center shadow-[0_2px_10px_rgb(0,0,0,0.02)] relative mt-8">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 px-3 py-1 rounded-full border border-[#e4e4e7] text-[10px] font-bold text-[#71717a] uppercase tracking-widest shadow-sm">
            Key Moment
          </div>
          <p className="text-lg text-[#09090b] font-serif italic mt-2">"{keyMoment}"</p>
        </div>
      )}

      {/* ── Flags ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8">
        <FlagCard title="Green Flags" flags={greenFlags} type="positive" />
        <FlagCard title="Red Flags" flags={redFlags} type="negative" />
      </div>

      {/* ── Footer ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 gap-4 border-t border-[#e4e4e7]">
        <p className="text-xs text-[#71717a] font-medium">
          Confidence Level: <span className="text-[#18181b] capitalize font-bold">{confidence}</span>
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-white border border-[#e4e4e7] text-[#52525b] rounded-full text-sm font-semibold hover:bg-gray-50 hover:border-[#d4d4d8] transition-all shadow-sm"
        >
          Analyze Another Chat
        </button>
      </div>
    </div>
  );
}

function FlagCard({ title, flags, type }) {
  const isPositive = type === "positive";
  const icon = isPositive ? (
    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
  ) : (
    <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
  );
  const bgClass = isPositive ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100";

  return (
    <div className={`p-6 rounded-3xl border border-[#e4e4e7] bg-white shadow-sm`}>
      <h3 className={`text-sm font-bold flex items-center gap-3 mb-5 text-[#09090b]`}>
        <span className={bgClass + " p-1.5 rounded-full border shadow-sm"}>{icon}</span>
        {title}
      </h3>
      {flags && flags.length > 0 ? (
        <ul className="space-y-4">
          {flags.map((flag, i) => (
            <li key={i} className="text-sm text-[#52525b] flex items-start gap-3">
              <span className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${isPositive ? "bg-emerald-500" : "bg-rose-500"}`} />
              <span className="leading-relaxed font-medium">{flag}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#a1a1aa] italic">None detected</p>
      )}
    </div>
  );
}
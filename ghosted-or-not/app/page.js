"use client";

import { useState } from "react";
import Upload from "./components/Upload";
import Context from "./components/Context";
import Processing from "./components/Processing";
import Result from "./components/Result";

export default function Page() {
  const [step, setStep] = useState("upload");
  const [images, setImages] = useState([]);   // full data URLs
  const [context, setContext] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const analyze = async (userContext) => {
    setContext(userContext);
    setStep("processing");
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images, context: userContext }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
      setStep("result");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setStep("upload");
    }
  };

  const reset = () => {
    setImages([]);
    setContext({});
    setResult(null);
    setError(null);
    setStep("upload");
  };

  return (
    <div className="min-h-screen text-[#18181b] font-sans">
      {/* Header - Minimalist Aesthetic */}
      <header className="w-full relative overflow-hidden pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl text-center flex flex-col items-center">
            <div className="mb-4 relative w-24 h-24 md:w-32 md:h-32">
              <img 
                src="/logo.PNG" 
                alt="GhostedorNahh Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
            <h1 className="inline-block text-5xl md:text-7xl mb-4 leading-tight font-sans font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-pink-500 drop-shadow-sm pb-2 pr-4">
              GhostedorNahh&nbsp;
            </h1>
            <p className="text-[#52525b] text-lg font-medium">
              Upload your chat screenshots and get a brutally honest, psychologically sound behavioral analysis.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 -mt-16 relative z-20">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 border border-red-100 flex justify-between items-start shadow-sm backdrop-blur-md">
            <p className="font-medium text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-0.5 text-xs text-red-400 hover:text-red-600 font-medium"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white overflow-hidden p-6 md:p-10 mb-20">
          {step === "upload" && (
            <Upload images={images} setImages={setImages} next={() => setStep("context")} />
          )}

          {step === "context" && (
            <Context
              context={context}
              setContext={setContext}
              next={analyze}
              back={() => setStep("upload")}
            />
          )}

          {step === "processing" && <Processing />}

          {step === "result" && <Result result={result} reset={reset} />}
        </div>
      </main>

      {/* Minimalistic Footer */}
      <footer className="w-full text-center pb-8 pt-4 text-[#a1a1aa] text-[11px] font-medium uppercase tracking-wider relative z-20">
        <p>Created by Aarya</p>
        <p className="mt-1">
          <a href="mailto:aaryaer06@gmail.com" className="hover:text-[#52525b] transition-colors">
            aaryaer06@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
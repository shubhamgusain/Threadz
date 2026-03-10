"use client";

import { useState, useEffect } from "react";
import { Sparkles, Loader2, RefreshCw, Wand2, Download } from "lucide-react";
import Image from "next/image";

interface GeneratedDesign {
  design_id: string;
  image_url: string;
  ai_prompt: string;
  ai_style: string;
}

const STYLE_PRESETS = [
  "Realistic",
  "Artistic",
  "Minimalist",
  "Vintage",
  "Cyberpunk",
  "Anime",
  "Pop Art",
  "Watercolor"
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Minimalist");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [results, setResults] = useState<GeneratedDesign[]>([]);
  const [progress, setProgress] = useState(0);

  // Character limit based on PRD
  const maxChars = 500;

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    if (isPolling && jobId) {
      pollInterval = setInterval(async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/v1/designs/ai-status/${jobId}`);
          
          if (res.ok) {
            const data = await res.json();
            
            setProgress(prev => Math.min(prev + 10, 95)); // Fake progress bar update

            if (data.status === "completed") {
              setResults(data.designs);
              setIsPolling(false);
              setIsGenerating(false);
              setProgress(100);
              setJobId(null);
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
          setIsPolling(false);
          setIsGenerating(false);
          alert("Connection error while checking generation status.");
        }
      }, 1000);
    }

    return () => clearInterval(pollInterval);
  }, [isPolling, jobId]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setResults([]);
    setProgress(5);

    try {
      const res = await fetch("http://localhost:8000/api/v1/designs/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          num_variations: 4
        })
      });

      if (res.ok) {
        const data = await res.json();
        setJobId(data.job_id);
        setIsPolling(true);
      } else {
        alert("Generation failed to start");
        setIsGenerating(false);
      }
    } catch (e) {
      console.error(e);
      alert("Network error starting generation");
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col mb-10 text-center">
        <div className="inline-flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-8 h-8 text-amber-500" />
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Design Generator</h1>
        </div>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Describe your vision, and our integrated Stable Diffusion model will create 4 unique variations for your custom apparel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm h-fit">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-800">Prompt Description</label>
              <span className="text-xs text-slate-500 font-medium">
                {prompt.length}/{maxChars}
              </span>
            </div>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 px-4 py-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              placeholder="A futuristic cyber-city during sunset with neon pink and blue glowing signs..."
              maxLength={maxChars}
              disabled={isGenerating}
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-800 mb-3">Style Preset</label>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setStyle(p)}
                  disabled={isGenerating}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    style === p 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-white text-slate-600 border border-slate-200 hover:border-slate-400 disabled:opacity-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
             <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
               <span className="text-amber-500 mt-0.5"><Wand2 className="w-5 h-5"/></span>
               <div>
                  <h4 className="text-sm font-bold text-amber-900">Premium Feature</h4>
                  <p className="text-xs text-amber-700 mt-1">AI generation is exclusive to Premium tier checkouts. Generates at 300DPI automatically.</p>
               </div>
             </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || prompt.length < 10}
            className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-300 hover:to-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate 4 Variations
              </>
            )}
          </button>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          {isGenerating ? (
             <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-slate-100 border-dashed">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Creating your masterpiece</h3>
                <p className="text-slate-500">Our AI artists are interpreting your prompt in {style} style...</p>
                
                <div className="w-64 max-w-sm bg-slate-200 rounded-full h-2 mt-8 overflow-hidden">
                  <div className="bg-amber-500 h-2 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
             </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {results.map((design, idx) => (
                 <div key={design.design_id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group">
                   <div className="relative aspect-square bg-slate-100">
                     <img 
                       src={design.image_url} 
                       alt={`Variation ${idx + 1}`} 
                       className="object-cover w-full h-full"
                     />
                     <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                       Variation {idx + 1}
                     </div>
                   </div>
                   <div className="p-4 flex gap-3">
                      <button className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-sm text-sm">
                        Use Design
                      </button>
                      <button className="px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition shadow-sm flex items-center justify-center border border-slate-200">
                         <Download className="w-4 h-4" />
                      </button>
                   </div>
                 </div>
               ))}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-slate-50 rounded-3xl border border-slate-200 border-dashed">
               <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-slate-100">
                 <Wand2 className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">Your imagination is the limit</h3>
               <p className="text-slate-500 text-center max-w-md">
                 Type a prompt in the sidebar and choose a style. The better you describe your idea, the better the final output!
               </p>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

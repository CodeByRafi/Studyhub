"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SummarizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    setIsProcessing(true);
    // Simulation of AI processing
    setTimeout(() => {
      setSummary(`This comprehensive document discusses the core principles of ${file.name.split('.')[0]}, focusing on the architectural implications and historical context. Key findings include the shift towards decentralized ecosystems and the increasing importance of ethical considerations in modern frameworks. \n\nMain takeaway: The evolution of this subject reflects a broader trend of rapid transformation and the need for continuous adaptive learning strategies.`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">PDF SUMMARIZER</h1>
          <p className="text-zinc-400 text-lg">Extract core intelligence from lengthy documents instantly.</p>
        </div>
      </div>

      {!summary ? (
        <Card className="p-16 text-center space-y-8 bg-zinc-900/40 border-sky-500/10 border-dashed border-2">
          <div className="space-y-4">
            <div className="w-24 h-24 bg-zinc-800 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-inner">📄</div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Upload your scholar document</h3>
              <p className="text-zinc-500 text-sm">Supported formats: PDF, DOCX (Max 25MB)</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <input
              type="file"
              id="pdf-upload"
              className="hidden"
              accept=".pdf,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label
              htmlFor="pdf-upload"
              className="px-10 py-4 bg-zinc-800 text-zinc-300 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 transition-all border border-zinc-700"
            >
              {file ? file.name : "Select Document"}
            </label>
            
            {file && (
              <Button size="lg" onClick={handleUpload} isLoading={isProcessing} className="px-16 h-16 text-lg">
                Generate Intelligence Summary
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="space-y-10">
          <Card className="p-10 space-y-8 border-sky-500/20 bg-sky-500/[0.02]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
               <div className="flex items-center gap-4">
                  <div className="text-3xl">🤖</div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Intelligence Extract</h3>
                    <p className="text-[10px] font-black text-sky-500 uppercase tracking-widest mt-1">Processed: {file?.name}</p>
                  </div>
               </div>
               <Button variant="outline" size="sm" onClick={() => setSummary(null)}>Upload New</Button>
            </div>
            
            <div className="space-y-6">
               <p className="text-zinc-300 leading-relaxed text-lg font-medium italic">"{summary}"</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
               {[
                 { label: "Confidence", val: "98.2%" },
                 { label: "Read Time", val: "45s" },
                 { label: "Keywords", val: "12" },
                 { label: "Tone", val: "Academic" }
               ].map(stat => (
                 <div key={stat.label} className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-sky-400 font-bold">{stat.val}</p>
                 </div>
               ))}
            </div>
          </Card>

          <div className="flex justify-center gap-4">
             <Button variant="secondary" className="px-10">Export as PDF</Button>
             <Button variant="secondary" className="px-10">Save to Notes</Button>
             <Button className="px-10">Create Flashcards from this</Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 pt-12">
         {[
           { title: "Smart Extraction", desc: "Identify core themes and methodologies automatically.", icon: "🧠" },
           { title: "Context Aware", desc: "Maintains the original intended meaning and nuance.", icon: "🎯" },
           { title: "Cross-Reference", desc: "Links summary points back to original source pages.", icon: "🔗" }
         ].map((f, i) => (
           <Card key={i} className="p-6 space-y-4 bg-zinc-900/20">
              <div className="text-2xl">{f.icon}</div>
              <h4 className="font-bold text-white">{f.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
           </Card>
         ))}
      </div>
    </div>
  );
}

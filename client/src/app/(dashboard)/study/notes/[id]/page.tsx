"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getNoteById } from "@/services/study";
import { API_URL } from "@/services/api";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function NoteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchNote(params.id as string);
    }
  }, [params.id]);

  const fetchNote = async (id: string) => {
    try {
      const data = await getNoteById(id);
      if (data) {
        setNote(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = () => {
    if (note?.file_url) {
      const fullUrl = note.file_url.startsWith('http') 
        ? note.file_url 
        : `${API_URL}${note.file_url}`;
      window.open(fullUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium tracking-wide">Loading academic record...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="bg-zinc-900 border border-dashed border-zinc-800 rounded-[3rem] py-32 flex flex-col items-center text-center space-y-6">
        <div className="text-5xl mb-2">📄</div>
        <h3 className="text-2xl font-bold text-white">Record Not Found</h3>
        <p className="text-zinc-500 max-w-sm mx-auto">This academic material might have been removed or the link is invalid.</p>
        <Link href="/study/notes">
          <Button variant="primary">Return to Library</Button>
        </Link>
      </div>
    );
  }

  const formattedDate = note.created_at 
    ? new Date(note.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Recently uploaded";

  const authorName = note.first_name ? `${note.first_name} ${note.last_name || ''}` : 'Anonymous Scholar';

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
        <Link href="/study/notes" className="text-zinc-500 hover:text-white transition-colors">Study Notes Library</Link>
        <span className="text-zinc-700">/</span>
        <span className="text-sky-500 truncate max-w-[200px]">{note.title}</span>
      </div>

      {/* Header Profile */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-xl shadow-black/50 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
          <div className="space-y-4 flex-1">
            <div className="flex flex-wrap gap-2">
              {note.department_name && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {note.department_name}
                </span>
              )}
              {note.course_name && (
                <span className="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest bg-zinc-950 border border-zinc-800 text-zinc-400">
                  {note.course_name}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {note.title}
            </h1>
          </div>
          
          <div className="flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <Button size="lg" variant="primary" onClick={handleOpenPdf} className="w-full md:w-auto md:min-w-[200px]">
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Read Note
            </Button>
            <Button size="lg" variant="secondary" onClick={handleOpenPdf} className="w-full md:w-auto">
              Download PDF
            </Button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-6 relative z-10">
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-lg font-black text-white border border-zinc-700 shadow-md">
               {note.first_name ? note.first_name[0].toUpperCase() : 'S'}
             </div>
             <div>
               <p className="text-sm font-black text-zinc-100 flex items-center gap-1.5">
                 {authorName}
                 <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               </p>
               <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Uploaded by Scholar</p>
             </div>
           </div>
           
           <div className="text-right">
             <p className="text-sm font-black text-white">{formattedDate}</p>
             <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-widest">Publish Date</p>
           </div>
        </div>
      </div>

    </div>
  );
}

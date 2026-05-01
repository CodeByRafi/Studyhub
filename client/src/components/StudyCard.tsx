"use client";

import Link from "next/link";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

interface StudyCardProps {
  item: {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    department_name?: string;
    course_name?: string;
    created_at?: string;
    file_url?: string;
  };
  onDownload: (item: any) => void;
  type: "note" | "question" | "research";
}

export default function StudyCard({ item, onDownload, type }: StudyCardProps) {
  const formattedDate = item.created_at 
    ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently uploaded";

  return (
    <Card hoverable className="group flex flex-col h-full bg-zinc-900 border-zinc-800 p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2">
          {item.department_name && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {item.department_name}
            </span>
          )}
          {item.course_name && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-zinc-400">
              {item.course_name}
            </span>
          )}
          {/* Trust Signal: Tag rendering depending on type */}
          {type === "question" && (
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Verified Exam
            </span>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 min-h-[3.5rem] group-hover:text-sky-400 transition-colors tracking-tight">
        {item.title}
      </h3>

      <div className="mt-auto pt-6 border-t border-zinc-800/80 flex flex-col gap-4">
        {/* Author details with Trust Signals */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 w-3/4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-sm font-black text-white border border-zinc-700 shadow-md">
              {item.first_name ? item.first_name[0].toUpperCase() : 'S'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-zinc-100 leading-none flex items-center gap-1.5 truncate">
                {item.first_name ? `${item.first_name} ${item.last_name || ''}` : 'Anonymous Scholar'}
                <svg className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </p>
              <p className="text-[10px] text-zinc-500 mt-1.5 uppercase font-bold tracking-widest truncate">Academic Contributor</p>
            </div>
          </div>
          <div className="text-right">
             <span className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest">{formattedDate}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={type === "research" ? `/research/${item.id}` : `/study/${type}s/${item.id}`} className="flex-1">
            <Button variant="secondary" size="md" className="w-full h-11 text-xs">View Details</Button>
          </Link>
          <Button 
            variant="outline" 
            size="md" 
            className="w-12 h-11 p-0 flex items-center justify-center"
            onClick={() => onDownload(item)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </Button>
        </div>
      </div>
    </Card>
  );
}

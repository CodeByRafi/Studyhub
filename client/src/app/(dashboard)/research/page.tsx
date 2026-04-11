"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getResearch, uploadResearch } from "@/services/research";
import { API_URL } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import StudyCard from "@/components/StudyCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function ResearchPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [research, setResearch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [department, setDepartment] = useState("");
  const [course, setCourse] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  useEffect(() => {
    setUser(getUser());
    fetchResearch();
  }, []);

  const fetchResearch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResearch();
      setResearch(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !file || !department) {
      setUploadError("Please fill required fields.");
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const result = await uploadResearch(title.trim(), abstract.trim(), department.trim(), course.trim(), file, token!);
      if (result) {
        setTitle(""); setAbstract(""); setFile(null);
        setShowUploadForm(false);
        fetchResearch();
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (paper: any) => {
    if (paper.file_url) {
      const fullUrl = paper.file_url.startsWith('http') ? paper.file_url : `${API_URL}${paper.file_url}`;
      window.open(fullUrl, '_blank');
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Research Repository</h1>
          <p className="text-zinc-400 text-lg">Access and contribute to the collective knowledge of our scholar community.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-2xl font-black text-white">{research.length}</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Papers Published</p>
          </div>
          <Button size="lg" onClick={() => setShowUploadForm(!showUploadForm)}>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
            Publish Research
          </Button>
        </div>
      </div>

      {showUploadForm && (
        <Card className="p-8 border-sky-500/20 bg-sky-500/[0.02] animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Publish your findings</h2>
            <button onClick={() => setShowUploadForm(false)} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
          </div>
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Paper Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none placeholder:text-zinc-700"
                  placeholder="e.g. Advancements in Machine Learning for Healthcare"
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Abstract</label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none placeholder:text-zinc-700"
                  rows={4}
                  placeholder="Summarize your research methodology and results..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Academic Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">PDF Manuscript</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 border-t border-zinc-800 pt-8">
               <Button type="button" variant="ghost" onClick={() => setShowUploadForm(false)}>Cancel</Button>
               <Button type="submit" isLoading={uploading} className="px-12">Submit Manuscript</Button>
            </div>
            {uploadError && <p className="text-sm text-red-400 font-medium text-center">{uploadError}</p>}
          </form>
        </Card>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium tracking-wide">Fetching Manuscripts...</p>
        </div>
      ) : research.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {research.map((paper) => (
            <StudyCard 
              key={paper.id} 
              item={{...paper, department_name: paper.department, course_name: paper.course}}
              onDownload={handleDownload} 
              type="research" 
            />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 shadow-inner border border-dashed border-zinc-800 rounded-[3rem] py-32 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl">🔬</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">No research papers published yet</h3>
            <p className="text-zinc-500 max-w-sm mx-auto">Be the first to contribute to the academic repository.</p>
          </div>
          <Button variant="primary" onClick={() => setShowUploadForm(true)}>Publish Research</Button>
        </div>
      )}
    </div>
  );
}
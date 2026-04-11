"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  getDepartments, 
  getCourses, 
  getNotes, 
  uploadNote, 
  getQuestions, 
  uploadQuestion, 
  getDepartmentSuggestions 
} from "@/services/study";
import { API_URL } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import StudyCard from "@/components/StudyCard";
import FilterSection from "@/components/FilterSection";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface StudyViewProps {
  type: "note" | "question";
  title: string;
  subtitle: string;
}

export default function StudyView({ type, title, subtitle }: StudyViewProps) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form state
  const [uploadTitle, setUploadTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // Data state
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setUser(getUser());
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) fetchCourses(selectedDept);
    else { setCourses([]); setSelectedCourse(""); }
  }, [selectedDept]);

  useEffect(() => {
    fetchItems();
  }, [selectedDept, selectedCourse, searchQuery, type]);

  const fetchDepartments = useCallback(async () => {
    const data = await getDepartments();
    setDepartments(data);
  }, []);

  const fetchCourses = useCallback(async (deptId: string) => {
    const data = await getCourses(deptId);
    setCourses(data);
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      let data = [];
      if (type === "note") {
        data = await getNotes({ department: selectedDept, course: selectedCourse, searchQuery });
      } else {
        data = await getQuestions({ department: selectedDept, course: selectedCourse, searchQuery });
      }
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, selectedDept, selectedCourse, searchQuery]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    if (!uploadTitle.trim() || !file || !selectedCourse) { setUploadError("Required fields missing."); return; }

    setUploading(true);
    try {
      const token = getToken();
      const result = type === "note" 
        ? await uploadNote(uploadTitle.trim(), selectedCourse, file, token!) 
        : await uploadQuestion(uploadTitle.trim(), selectedCourse, file, token!);

      if (result) {
        setUploadTitle(""); setFile(null); setShowUploadForm(false);
        fetchItems();
      }
    } catch (err: any) {
      setUploadError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (item: any) => {
    if (item.file_url) {
      const fullUrl = item.file_url.startsWith('http') ? item.file_url : `${API_URL}${item.file_url}`;
      window.open(fullUrl, '_blank');
    }
  };


  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-zinc-400 text-lg max-w-2xl">{subtitle}</p>
        </div>
        <Button size="lg" onClick={() => setShowUploadForm(!showUploadForm)}>
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
          Upload New {type === 'note' ? 'Note' : 'Question'}
        </Button>
      </div>


      {showUploadForm && (
        <Card className="p-8 border-sky-500/20 bg-sky-500/[0.02] animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white">Share a new {type}</h2>
            <button onClick={() => setShowUploadForm(false)} className="text-zinc-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round"/></svg>
            </button>
          </div>
          <form onSubmit={handleUpload} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-all placeholder:text-zinc-700"
                  placeholder="e.g. Database Systems Lecture 1"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Department</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none disabled:opacity-50 appearance-none"
                  disabled={!selectedDept}
                >
                  <option value="">Select Course</option>
                  {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">File (PDF / DOCX)</label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-zinc-500 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-zinc-300"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 border-t border-zinc-800 pt-8">
              <Button type="button" variant="ghost" onClick={() => setShowUploadForm(false)}>Cancel</Button>
              <Button type="submit" isLoading={uploading} className="w-full sm:w-auto px-12">Publish to Library</Button>
            </div>
            {uploadError && <p className="text-sm text-red-500 font-medium text-center">{uploadError}</p>}
          </form>
        </Card>
      )}

      <FilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDept={selectedDept}
        setSelectedDept={setSelectedDept}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
        departments={departments}
        courses={courses}
        onReset={() => { setSearchQuery(""); setSelectedDept(""); setSelectedCourse(""); }}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium tracking-wide">Syncing Library...</p>
        </div>
      ) : items.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <StudyCard 
              key={item.id} 
              item={item} 
              onDownload={handleDownload} 
              type={type} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900 shadow-inner border border-dashed border-zinc-800 rounded-[3rem] py-32 flex flex-col items-center text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-3xl mb-2">📄</div>
          <div className="space-y-2">
             <h3 className="text-2xl font-bold text-white">No previous questions uploaded yet</h3>
             <p className="text-zinc-500 max-w-sm mx-auto">Upload your first previous question paper to get started.</p>
          </div>
          <Button variant="primary" onClick={() => setShowUploadForm(true)}>
             Upload Question
          </Button>
        </div>
      )}
    </div>
  );
}

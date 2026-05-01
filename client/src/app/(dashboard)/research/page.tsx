"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getResearch, uploadResearch } from "@/services/research";
import { getDepartments, getCourses, addCourse } from "@/services/study";
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
  
  // Department/Course state
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [addingCourse, setAddingCourse] = useState(false);

  useEffect(() => {
    setUser(getUser());
    fetchResearch();
    fetchDepartmentsData();
  }, []);

  useEffect(() => {
    if (department) {
      fetchCoursesData(department);
    } else {
      setCourses([]);
      setCourse("");
    }
  }, [department]);

  const fetchDepartmentsData = useCallback(async () => {
    const data = await getDepartments();
    setDepartments(data);
  }, []);

  const fetchCoursesData = useCallback(async (deptId: string) => {
    const data = await getCourses(deptId);
    setCourses(data);
  }, []);

  const handleAddCourse = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newCourseName.trim() || !department) return;

    setAddingCourse(true);
    try {
      const token = getToken();
      if (!token) {
        setUploadError("Authentication required");
        setAddingCourse(false);
        return;
      }
      const result = await addCourse(department, newCourseName.trim(), token);
      if (result) {
        setNewCourseName("");
        setShowAddCourse(false);
        setCourse(String(result.id));
        fetchCoursesData(department);
      }
    } catch (err) {
      console.error('Failed to add course:', err);
      setUploadError('Failed to add course');
    } finally {
      setAddingCourse(false);
    }
  };

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
      const deptName = departments.find((d: any) => d.id === parseInt(department, 10))?.name || department;
      const courseName = course ? courses.find((c: any) => c.id === parseInt(course, 10))?.name || course : "";
      
      const result = await uploadResearch(
        title.trim(),
        abstract.trim(),
        deptName,
        courseName,
        file,
        token!
      );
      if (result) {
        setTitle("");
        setAbstract("");
        setFile(null);
        setDepartment("");
        setCourse("");
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
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none appearance-none"
                >
                  <option value="">Select Department</option>
                  {departments.map((d: any) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Course (Optional)</label>
                <div className="flex gap-2">
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="flex-1 h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none disabled:opacity-50 appearance-none"
                    disabled={!department}
                  >
                    <option value="">Select Course</option>
                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowAddCourse(!showAddCourse)}
                    disabled={!department}
                    className="px-4 h-12 bg-zinc-800 border border-zinc-700 rounded-xl text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
                    title="Add new course"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                {showAddCourse && (
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCourse(e as any);
                        }
                      }}
                      placeholder="New course name"
                      className="flex-1 h-10 bg-zinc-900 border border-zinc-700 rounded-lg px-3 text-white focus:border-sky-500 outline-none placeholder:text-zinc-600 text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={(e) => handleAddCourse(e as any)}
                      disabled={!newCourseName.trim() || addingCourse}
                      className="px-3 h-10 bg-sky-600 text-white rounded-lg hover:bg-sky-500 disabled:opacity-50 font-semibold text-sm"
                    >
                      {addingCourse ? 'Adding...' : 'Add'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddCourse(false); setNewCourseName(""); }}
                      className="px-3 h-10 bg-zinc-800 text-zinc-400 rounded-lg hover:text-white text-sm"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
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
              item={{...paper, department_name: paper.department_name, course_name: paper.course_name}}
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
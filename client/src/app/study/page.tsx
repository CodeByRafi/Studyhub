"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDepartments, getCourses, getNotes, uploadNote, addCourse, getQuestions, uploadQuestion, getDepartmentSuggestions, getCourseSuggestions } from "@/services/study";
import { recordVisit, API_URL } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";
import type { ReactNode } from 'react';

interface StudyItem {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  file_url: string;
}



export default function StudyPage() {
  const router = useRouter();

  // User state
  const [user, setUser] = useState<any>(null);

  // UI state
  const [activeTab, setActiveTab] = useState<"notes" | "questions">("notes");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newCourseName, setNewCourseName] = useState("");

  // Data state
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [notes, setNotes] = useState<StudyItem[]>([]);
  const [questions, setQuestions] = useState<StudyItem[]>([]);

  // UI feedback state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newCourseError, setNewCourseError] = useState("");
  const [newCourseSuccess, setNewCourseSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Client-side only
  const [isClient, setIsClient] = useState(false);

  // Effects
  useEffect(() => {
    setIsClient(true);
    const userData = getUser();
    setUser(userData);
    recordVisit("study");
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDept) {
      fetchCourses(selectedDept);
    } else {
      setCourses([]);
      setSelectedCourse("");
    }
  }, [selectedDept]);

  useEffect(() => {
    if (isClient) {
      fetchData();
    }
  }, [selectedDept, selectedCourse, searchQuery, activeTab, isClient]);

  const fetchDepartments = useCallback(async () => {
    try {
      setError("");
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError("Failed to load departments. Please refresh the page.");
      console.error("Error fetching departments:", err);
    }
  }, []);

  const fetchCourses = useCallback(async (deptId: string) => {
    try {
      setError("");
      const data = await getCourses(deptId);
      setCourses(data);
    } catch (err: any) {
      setError("Failed to load courses. Please try again.");
      console.error("Error fetching courses:", err);
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (activeTab === "notes") {
        const data = await getNotes({ department: selectedDept, course: selectedCourse, searchQuery });
        setNotes(data);
        setQuestions([]);
      } else {
        const data = await getQuestions({ department: selectedDept, course: selectedCourse, searchQuery });
        setQuestions(data);
        setNotes([]);
      }
    } catch (err: any) {
      setError(`Failed to load ${activeTab}. Please refresh the page.`);
      console.error(`Error fetching ${activeTab}:`, err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDept, selectedCourse, searchQuery]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");
    setNewCourseError("");
    setNewCourseSuccess("");

    if (!user) {
      localStorage.setItem("intendedRoute", "/study");
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setUploadError("Please enter a title.");
      return;
    }

    if (!file) {
      setUploadError("Please select a file.");
      return;
    }

    if (!selectedCourse) {
      setUploadError("Please select a course.");
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only PDF and Word files (.pdf, .doc, .docx) are allowed.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB.");
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const result = activeTab === "notes" 
        ? await uploadNote(title.trim(), selectedCourse, file!, token!) 
        : await uploadQuestion(title.trim(), selectedCourse, file!, token!);

      if (result) {
        setTitle("");
        setFile(null);
        setShowUploadForm(false);
        fetchData();
      } else {
        setUploadError("Failed to upload. Please try again.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCourse = async () => {
    setNewCourseError("");
    setNewCourseSuccess("");

    if (!selectedDept) {
      setNewCourseError("Choose a department first.");
      return;
    }

    if (!newCourseName.trim()) {
      setNewCourseError("Please enter course name.");
      return;
    }

    try {
      const token = getToken();
      const result = await addCourse(selectedDept, newCourseName.trim(), token || undefined);
      if (result) {
        setNewCourseSuccess(`Course '${newCourseName}' added successfully!`);
        setNewCourseName("");
        fetchCourses(selectedDept);
      } else {
        setNewCourseError("Could not add course. Please try again.");
      }
    } catch (error: any) {
      setNewCourseError(error.message || "Failed to add course.");
    }
  };

  const handleDownload = (item: StudyItem) => {
    if (item.file_url) {
      const link = document.createElement('a');
      // Ensure the URL is absolute by prepending the API_URL
      const fullUrl = item.file_url.startsWith('http') ? item.file_url : `${API_URL}${item.file_url}`;
      link.href = fullUrl;
      link.download = `${item.title || 'file'}.pdf`;
      link.target = '_blank'; // Open in new tab for better experience
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download link not available.');
    }
  };

  const deptSuggestions = getDepartmentSuggestions();
  const displayDepartments = departments.length > 0 ? departments : deptSuggestions;
  const courseSuggestions = selectedDept ? getCourseSuggestions(selectedDept) : [];

  const content: ReactNode = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === "notes" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-white/70 hover:text-white"}`}
            >
              📚 Notes
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === "questions" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "text-white/70 hover:text-white"}`}
            >
              ❓ Previous Year Questions
            </button>
          </div>
        </div>

        {/* Upload Button */}
        {user && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
            >
              {showUploadForm ? "Cancel Upload" : `Upload ${activeTab === "notes" ? "Notes" : "Questions"}`}
            </button>
          </div>
        )}

        {/* Upload Form */}
        {user && showUploadForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">📝</span>
              Upload {activeTab === "notes" ? "Study Notes" : "Previous Year Questions"}
            </h2>

            {uploadError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  {uploadError}
                </div>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Title *
                  </label>
                  <input
                    type="text"
                    placeholder={activeTab === "notes" ? "e.g., Database Management Systems - Chapter 1" : "e.g., CSE Final Exam 2023"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Department *</label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  >
                    <option value="">Select Department</option>
                    {displayDepartments.map((dept: any) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">Course *</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!selectedDept}
                  >
                    <option value="">Select Course</option>
                    {courses.map((course: any) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 border-t border-white/10 pt-4">
                  <label className="block text-sm font-medium text-white/90">Can't find course?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="Add new course name"
                      className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                      disabled={!selectedDept}
                    />
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      disabled={!selectedDept || !newCourseName.trim()}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {newCourseError && <p className="text-xs text-red-400 mt-1">{newCourseError}</p>}
                  {newCourseSuccess && <p className="text-xs text-green-400 mt-1">{newCourseSuccess}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-white/90">PDF/Word File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  />
                  {file && (
                    <div className="mt-2 text-sm text-green-400">
                      ✅ Selected: {file.name} ({Math.round(file.size / 1024 / 1024 * 10) / 10} MB)
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {uploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    `Upload ${activeTab === "notes" ? "Notes" : "Questions"}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-6 py-3 rounded-xl border border-white/20 bg-white/5 font-medium text-white transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Guest Notice */}
        {!user && (
          <div className="mb-8 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">👋</span>
              <h3 className="text-lg font-semibold">Browse Study Materials</h3>
            </div>
            <p className="text-white/80 mb-4">
              Browse and download all materials.{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>{" "}
              or{" "}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium">
                create account
              </Link>{" "}
              to upload.
            </p>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-purple-400">🔍</span>
            Search & Filter
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Search</label>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Department</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="">All Departments</option>
                {displayDepartments.map((dept: any) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedDept}
              >
                <option value="">All Courses</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-purple-500 mx-auto mb-4"></div>
            <p className="text-white/70">Loading {activeTab}...</p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(activeTab === "notes" ? notes : questions).map((item: StudyItem) => (
              <div key={item.id} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all">
                <h3 className="font-semibold text-lg mb-2 text-purple-300 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-white/70 mb-4">
                  By {item.first_name} {item.last_name}
                </p>
                <div className="flex justify-between items-center">
                  <Link href={`/study/${item.id}`} className="text-pink-400 hover:text-pink-300 font-medium text-sm">
                    View Details
                  </Link>
                  <button 
                    onClick={() => handleDownload(item)} 
                    className="text-cyan-400 hover:text-cyan-300 font-medium text-sm"
                  >
                    ⬇️ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && (activeTab === "notes" ? notes : questions).length === 0 && !error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-semibold mb-2">No {activeTab} found</h3>
            <p className="text-white/70 mb-6">Try adjusting your search or filters above.</p>
            {user && (
              <button
                onClick={() => setShowUploadForm(true)}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
              >
                Be the first to upload!
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );

  if (!isClient) {
    return <div>Loading...</div>;
  }

  // Fix AppLayout props - pass children directly
  return <AppLayout>{content}</AppLayout>;
}
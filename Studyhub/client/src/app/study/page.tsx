"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getDepartments, getCourses, getNotes, uploadNote, addCourse, getQuestions, uploadQuestion, getDepartmentSuggestions, getCourseSuggestions } from "@/services/study";
import { recordVisit } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function StudyPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseError, setNewCourseError] = useState("");
  const [newCourseSuccess, setNewCourseSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchDepartments();
    fetchNotes();
    recordVisit("study");
  }, []);

  useEffect(() => {
    if (selectedDept) {
      fetchCourses(selectedDept);
    } else {
      setCourses([]);
    }
    setSelectedCourse("");
  }, [selectedDept]);

  useEffect(() => {
    if (selectedCourse) {
      fetchNotes(selectedCourse);
      fetchQuestions(selectedCourse);
    } else if (!selectedDept) {
      fetchNotes();
      fetchQuestions();
    }
  }, [selectedCourse]);

  const fetchDepartments = async () => {
    try {
      setError("");
      const data = await getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError("Failed to load departments. Please refresh the page.");
      console.error("Error fetching departments:", err);
    }
  };

  const fetchCourses = async (deptId: string) => {
    try {
      setError("");
      const data = await getCourses(deptId);
      setCourses(data);
    } catch (err: any) {
      setError("Failed to load courses. Please try again.");
      console.error("Error fetching courses:", err);
    }
  };

  const fetchNotes = async (courseId?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotes(courseId);
      setNotes(data);
    } catch (err: any) {
      setError("Failed to load notes. Please refresh the page.");
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (courseId?: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await getQuestions(courseId);
      setQuestions(data);
    } catch (err: any) {
      setError("Failed to load questions. Please refresh the page.");
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");

    if (!user) {
      localStorage.setItem("intendedRoute", "/study");
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setUploadError("Please enter a title for the note.");
      return;
    }

    if (!file) {
      setUploadError("Please select a PDF file to upload.");
      return;
    }

    if (!selectedCourse) {
      setUploadError("Please select a course for the note.");
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB.");
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const result = await uploadNote(title.trim(), selectedCourse, file, token!);

      if (result) {
        setTitle("");
        setFile(null);
        setShowUploadForm(false);
        await fetchNotes(selectedCourse);
      } else {
        setUploadError("Failed to upload note. Please try again.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload note. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleQuestionUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError("");

    if (!user) {
      localStorage.setItem("intendedRoute", "/study");
      router.push("/login");
      return;
    }

    if (!title.trim()) {
      setUploadError("Please enter a title for the question.");
      return;
    }

    if (!file) {
      setUploadError("Please select a PDF file to upload.");
      return;
    }

    if (!selectedCourse) {
      setUploadError("Please select a course for the question.");
      return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError("Only PDF files are allowed.");
      return;
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      setUploadError("File size must be less than 50MB.");
      return;
    }

    setUploading(true);
    try {
      const token = getToken();
      const result = await uploadQuestion(title.trim(), selectedCourse, file, token!);

      if (result) {
        setTitle("");
        setFile(null);
        setShowUploadForm(false);
        await fetchQuestions(selectedCourse);
      } else {
        setUploadError("Failed to upload question. Please try again.");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload question. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddCourse = async () => {
    setNewCourseError("");
    setNewCourseSuccess("");

    if (!selectedDept) {
      setNewCourseError("Choose a department before adding a course.");
      return;
    }

    if (!newCourseName.trim()) {
      setNewCourseError("Please enter course name.");
      return;
    }

    try {
      const token = getToken();
      const result = await addCourse(selectedDept, newCourseName.trim(), token || undefined);
      if (!result) {
        setNewCourseError("Could not add course at this time. Please try again later.");
        return;
      }

      setNewCourseSuccess(`Course '${newCourseName}' added successfully!`);
      setNewCourseName("");
      await fetchCourses(selectedDept);
    } catch (error: any) {
      setNewCourseError(error.message || "Failed to add course. Please try again.");
    }
  };

  const handleDownload = (note: any) => {
    if (note.file_url) {
      try {
        const link = document.createElement('a');
        link.href = note.file_url;
        link.download = `${note.title}.pdf`;
        link.target = '_blank';
        link.click();
      } catch (err) {
        console.error("Download error:", err);
        setError("Failed to download the file. Please try again.");
      }
    }
  };

  const deptSuggestions = getDepartmentSuggestions();
  const displayDepartments = departments && departments.length > 0 ? departments : deptSuggestions;
  const courseSuggestions = selectedDept ? getCourseSuggestions(selectedDept) : [];

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "notes"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "questions"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Previous Year Questions
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

      <div>
        {/* Upload Form */}
        {user && showUploadForm && (
          <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">📤</span>
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

            <form onSubmit={activeTab === "notes" ? handleUpload : handleQuestionUpload} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    {activeTab === "notes" ? "Note" : "Question"} Title *
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
                  <label className="block text-sm font-medium text-white/90">
                    Department *
                  </label>
                  <select
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  >
                    <option value="" className="bg-[#0a0a0f]">Select Department</option>
                    {displayDepartments.map((dept: any) => (
                      <option key={dept.id} value={dept.id} className="bg-[#0a0a0f]">
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Course *
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!selectedDept}
                  >
                    <option value="" className="bg-[#0a0a0f]">Select Course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id} className="bg-[#0a0a0f]">
                        {course.name}
                      </option>
                    ))}
                    {/* Add suggested courses that aren't already in the list */}
                    {courseSuggestions.map((suggestion) => {
                      const exists = courses.some(c => c.name.toLowerCase() === suggestion.toLowerCase());
                      if (!exists) {
                        return (
                          <option key={suggestion} value={suggestion} className="bg-[#0a0a0f]">
                            {suggestion} (suggested)
                          </option>
                        );
                      }
                    })}
                  </select>
                  <p className="text-xs text-white/60">
                    Wondering which course to pick? We suggest the most recent popular courses for your department.
                  </p>
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4">
                  <label className="block text-sm font-medium text-white/90">Can’t find your course?</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="Add a new course name"
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                      disabled={!selectedDept}
                    />
                    <button
                      type="button"
                      onClick={handleAddCourse}
                      disabled={!selectedDept || newCourseName.trim().length === 0}
                      className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Add
                    </button>
                  </div>
                  {newCourseError && <p className="text-xs text-red-400">{newCourseError}</p>}
                  {newCourseSuccess && <p className="text-xs text-green-400">{newCourseSuccess}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    PDF File *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-purple-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                      required
                    />
                    {file && (
                      <div className="mt-2 text-sm text-green-400">
                        ✓ Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </div>
                  ) : (
                    `Upload ${activeTab === "notes" ? "Notes" : "Questions"}`
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition-all hover:bg-white/10"
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
              <span className="text-2xl">📚</span>
              <h3 className="text-lg font-semibold">Browse Study Materials</h3>
            </div>
            <p className="text-white/80 mb-4">
              You can browse and download all study materials. To upload your own notes, please{" "}
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                sign in
              </Link>
              {" "}or{" "}
              <Link href="/signup" className="text-pink-400 hover:text-pink-300 font-medium">
                create an account
              </Link>
              .
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="text-purple-400">🔍</span>
            Filter Study Materials
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Department
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
              >
                <option value="" className="bg-[#0a0a0f]">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-[#0a0a0f]">
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedDept}
              >
                <option value="" className="bg-[#0a0a0f]">All Courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id} className="bg-[#0a0a0f]">
                    {course.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Notes List */}
        {activeTab === "notes" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {selectedCourse ? "Course Notes" : selectedDept ? "Department Notes" : "All Study Notes"}
              </h2>
              <span className="text-white/60 text-sm">
                {notes.length} {notes.length === 1 ? "note" : "notes"} found
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-white/70">Loading study materials...</p>
                </div>
              </div>
            ) : notes.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-2">No study materials found</h3>
                <p className="text-white/60 mb-6">
                  {selectedCourse
                    ? "No notes have been uploaded for this course yet."
                    : selectedDept
                    ? "No notes have been uploaded for this department yet."
                    : "No study materials have been uploaded yet."
                  }
                </p>
                {user && (
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
                  >
                    Upload the First Notes
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <Link key={note.id} href={`/study/${note.id}`}>
                    <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-purple-300 transition-colors">
                            {note.title}
                          </h3>
                          <p className="text-sm text-white/60 mb-1">
                            by {note.first_name} {note.last_name}
                          </p>
                          <p className="text-xs text-white/50">
                            {new Date(note.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                          📄
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-sm font-medium">
                              {note.average_rating || "0"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-blue-400 text-sm">💬</span>
                            <span className="text-sm font-medium">
                              {note.comment_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(note);
                        }}
                        className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105"
                      >
                        ⬇️ Download PDF
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Questions List */}
        {activeTab === "questions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                {selectedCourse ? "Course Questions" : selectedDept ? "Department Questions" : "All Previous Year Questions"}
              </h2>
              <span className="text-white/60 text-sm">
                {questions.length} {questions.length === 1 ? "question" : "questions"} found
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
                  <p className="text-white/70">Loading previous year questions...</p>
                </div>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❓</div>
                <h3 className="text-xl font-semibold mb-2">No previous year questions found</h3>
                <p className="text-white/60 mb-6">
                  {selectedCourse
                    ? "No questions have been uploaded for this course yet."
                    : selectedDept
                    ? "No questions have been uploaded for this department yet."
                    : "No previous year questions have been uploaded yet."
                  }
                </p>
                {user && (
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
                  >
                    Upload the First Questions
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {questions.map((question) => (
                  <Link key={question.id} href={`/study/${question.id}`}>
                    <div className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-purple-300 transition-colors">
                            {question.title}
                          </h3>
                          <p className="text-sm text-white/60 mb-1">
                            by {question.first_name} {question.last_name}
                          </p>
                          <p className="text-xs text-white/50">
                            {new Date(question.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">
                          ❓
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-400 text-sm">⭐</span>
                            <span className="text-sm font-medium">
                              {question.average_rating || "0"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-blue-400 text-sm">💬</span>
                            <span className="text-sm font-medium">
                              {question.comment_count || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDownload(question);
                        }}
                        className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90 hover:scale-105"
                      >
                        ⬇️ Download PDF
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}

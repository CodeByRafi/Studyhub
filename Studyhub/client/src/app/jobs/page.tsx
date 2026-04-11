"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs, createJob, applyForJob } from "@/services/jobs";
import { recordVisit } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [applicationsLoading, setApplicationsLoading] = useState<{[key: string]: boolean}>({});
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    type: "internship",
    location: "",
    salary_range: "",
    requirements: "",
    contact_email: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchJobs();
    recordVisit("jobs");
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err: any) {
      setError("Failed to load jobs. Please refresh the page.");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    if (activeTab === "all") {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.type === activeTab));
    }
  };

  const handleCreateJob = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!user) {
      localStorage.setItem("intendedRoute", "/jobs");
      router.push("/login");
      return;
    }

    if (!formData.title.trim()) {
      setSubmitError("Please enter a job title.");
      return;
    }

    if (!formData.company.trim()) {
      setSubmitError("Please enter a company name.");
      return;
    }

    if (!formData.description.trim()) {
      setSubmitError("Please enter a job description.");
      return;
    }

    setSubmitting(true);
    try {
      const token = getToken();
      const result = await createJob(formData, token!);

      if (result) {
        setFormData({
          title: "",
          company: "",
          description: "",
          type: "internship",
          location: "",
          salary_range: "",
          requirements: "",
          contact_email: "",
        });
        setShowCreateForm(false);
        await fetchJobs();
      } else {
        setSubmitError("Failed to post job. Please try again.");
      }
    } catch (err: any) {
      setSubmitError(err.message || "Failed to post job. Please try again.");
      console.error("Create job error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      localStorage.setItem("intendedRoute", "/jobs");
      router.push("/login");
      return;
    }

    setApplicationsLoading(prev => ({ ...prev, [jobId]: true }));
    setSubmitError("");
    try {
      const token = getToken();
      const result = await applyForJob(jobId, "", token!);

      if (result) {
        setAppliedJobs(prev => new Set([...prev, jobId]));
      } else {
        setSubmitError("Failed to apply or you have already applied for this job.");
      }
    } catch (err: any) {
      console.error("Apply error:", err);
      setSubmitError("Failed to apply. Please try again.");
    } finally {
      setApplicationsLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const tabs = [
    { id: "all", label: "All Jobs", icon: "💼" },
    { id: "internship", label: "Internships", icon: "🎓" },
    { id: "tuition", label: "Tuition", icon: "📚" },
    { id: "part-time", label: "Part-time", icon: "⏰" },
  ];

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "internship": return "from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30";
      case "tuition": return "from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30";
      case "part-time": return "from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30";
      default: return "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30";
    }
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Post Job Button */}
        {user && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
            >
              {showCreateForm ? "Cancel Posting" : "Post a Job"}
            </button>
          </div>
        )}

        {/* Create Job Form */}
        {showCreateForm && user && (
          <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-purple-400">💼</span>
              Post a Job Opportunity
            </h2>

            {submitError && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                <div className="flex items-center gap-2">
                  <span className="text-red-400">⚠️</span>
                  {submitError}
                </div>
              </div>
            )}

            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Software Engineering Intern"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Company *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., TechCorp Inc."
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Job Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                    required
                  >
                    <option value="internship" className="bg-[#0a0a0f]">Internship</option>
                    <option value="tuition" className="bg-[#0a0a0f]">Tuition</option>
                    <option value="part-time" className="bg-[#0a0a0f]">Part-time</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Dhaka, Bangladesh"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 15,000-25,000 BDT/month"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/90">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@company.com"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Job Description *
                </label>
                <textarea
                  placeholder="Describe the job responsibilities, what the candidate will do, and any relevant details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/90">
                  Requirements
                </label>
                <textarea
                  placeholder="List the skills, qualifications, and experience required for this position..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Posting Job...
                    </div>
                  ) : (
                    "Post Job Opportunity"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
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
              <span className="text-2xl">💼</span>
              <h3 className="text-lg font-semibold">Explore Job Opportunities</h3>
            </div>
            <p className="text-white/80 mb-4">
              You can browse all job listings. To apply for jobs or post your own opportunities, please{" "}
              <a href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                sign in
              </a>
              {" "}or{" "}
              <a href="/signup" className="text-pink-400 hover:text-pink-300 font-medium">
                create an account
              </a>
              .
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitError && !showCreateForm && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
            <div className="flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {submitError}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-2 backdrop-blur-xl">
          <div className="flex space-x-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {activeTab === "all" ? "All Opportunities" : tabs.find(tab => tab.id === activeTab)?.label}
            </h2>
            <span className="text-white/60 text-sm">
              {filteredJobs.length} {filteredJobs.length === 1 ? "opportunity" : "opportunities"} found
            </span>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
              <div className="flex items-center gap-2">
                <span className="text-red-400">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mb-4"></div>
                <p className="text-white/70">Loading job opportunities...</p>
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === "internship" ? "🎓" : activeTab === "tuition" ? "📚" : activeTab === "part-time" ? "⏰" : "💼"}
              </div>
              <h3 className="text-xl font-semibold mb-2">No {activeTab === "all" ? "" : activeTab} opportunities found</h3>
              <p className="text-white/60 mb-6">
                {activeTab === "all"
                  ? "No job opportunities have been posted yet."
                  : `No ${activeTab} opportunities have been posted yet.`
                }
              </p>
              {user && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
                >
                  Post the First {activeTab === "all" ? "Job" : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Opportunity
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredJobs.map((job) => (
                <div key={job.id} className="group rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 backdrop-blur-xl transition-all hover:border-purple-500/50 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2 truncate group-hover:text-purple-300 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-purple-300 font-medium mb-2 truncate">{job.company}</p>
                      <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getJobTypeColor(job.type)}`}>
                        <span>
                          {job.type === "internship" ? "🎓" : job.type === "tuition" ? "📚" : job.type === "part-time" ? "⏰" : "💼"}
                        </span>
                        {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {job.location && (
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <span className="text-blue-400">📍</span>
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-sm text-white/70">
                        <span className="text-green-400">💰</span>
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <p className="text-sm text-white/70 mb-4 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>
                  )}

                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={applicationsLoading[job.id] || appliedJobs.has(job.id)}
                    className={`w-full rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                      appliedJobs.has(job.id)
                        ? "bg-green-500/20 text-green-300 border border-green-500/30 cursor-default"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:opacity-90 hover:scale-105"
                    } ${applicationsLoading[job.id] ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    {appliedJobs.has(job.id) ? (
                      <div className="flex items-center justify-center gap-2">
                        <span>✓</span>
                        Applied
                      </div>
                    ) : applicationsLoading[job.id] ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Applying...
                      </div>
                    ) : (
                      "Apply Now"
                    )}
                  </button>
                </div>
              ))}
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

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobs, createJob, applyForJob } from "@/services/jobs";
import { recordVisit } from "@/services/api";
import { getToken, getUser } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function JobsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [error, setError] = useState("");

  useEffect(() => {
    setUser(getUser());
    fetchJobs();
    recordVisit("jobs");
  }, []);

  useEffect(() => {
    if (activeTab === "all") setFilteredJobs(jobs);
    else setFilteredJobs(jobs.filter(job => job.type === activeTab));
  }, [jobs, activeTab]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err: any) {
      setError("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    
    setSubmitting(true);
    try {
      const token = getToken();
      await createJob(formData, token!);
      setShowCreateForm(false);
      setFormData({ title: "", company: "", description: "", type: "internship", location: "", salary_range: "", requirements: "", contact_email: "" });
      await fetchJobs();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) { router.push("/login"); return; }
    setApplicationsLoading(prev => ({ ...prev, [jobId]: true }));
    try {
      const token = getToken();
      await applyForJob(jobId, "", token!);
      setAppliedJobs(prev => new Set([...prev, jobId]));
    } catch (err: any) {
      console.error(err);
    } finally {
      setApplicationsLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const tabs = [
    { id: "all", label: "All Board", icon: "💼" },
    { id: "internship", label: "Internships", icon: "🎓" },
    { id: "tuition", label: "Tuition", icon: "📚" },
    { id: "part-time", label: "Part-time", icon: "⏰" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Career Portal</h1>
          <p className="text-zinc-400 text-lg">Connect with internships, tuition jobs, and professional growth opportunities.</p>
        </div>
        <Button size="lg" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel Posting" : "Post Opportunity"}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="p-8 border-sky-500/20 bg-sky-500/[0.02]">
          <h2 className="text-xl font-bold text-white mb-8">Post a new opportunity</h2>
          <form onSubmit={handleCreateJob} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Job Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none"
                  placeholder="e.g. Frontend Intern"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Company / Individual</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none"
                  placeholder="e.g. StudyHub AI"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Opportunity Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none appearance-none"
                >
                  <option value="internship">Internship</option>
                  <option value="tuition">Tuition</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Salary / Compensation</label>
                <input
                  type="text"
                  value={formData.salary_range}
                  onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none"
                  placeholder="e.g. 20k - 30k BDT"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none"
                rows={4}
                placeholder="What are the responsibilities?"
                required
              />
            </div>
            <div className="flex justify-end gap-4 border-t border-zinc-800 pt-8">
              <Button type="button" variant="ghost" onClick={() => setShowCreateForm(false)}>Discard</Button>
              <Button type="submit" isLoading={submitting} className="px-12">Post Listing</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-t-xl text-sm font-bold transition-all relative ${
              activeTab === tab.id ? "text-sky-400" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{tab.icon}</span> {tab.label}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></div>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredJobs.map((job) => (
            <Card key={job.id} hoverable className="flex flex-col group">
              <div className="flex justify-between items-start mb-6">
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-500 border border-sky-500/20">
                  {job.type}
                </span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Active</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">{job.title}</h3>
              <p className="text-sm font-semibold text-zinc-400 mb-6">{job.company}</p>
              
              <div className="space-y-3 mb-8">
                {job.location && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="text-sky-500">📍</span> {job.location}
                  </div>
                )}
                {job.salary_range && (
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="text-emerald-500">💰</span> {job.salary_range}
                  </div>
                )}
              </div>

              <div className="mt-auto flex gap-3">
                <Button 
                  className="flex-1" 
                  variant={appliedJobs.has(job.id) ? "secondary" : "primary"}
                  disabled={appliedJobs.has(job.id) || applicationsLoading[job.id]}
                  onClick={() => handleApply(job.id)}
                >
                  {appliedJobs.has(job.id) ? "Applied" : applicationsLoading[job.id] ? "Applying..." : "Apply Now"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-32 text-center text-zinc-500 font-medium">No opportunities found in this category.</div>
      )}
    </div>
  );
}

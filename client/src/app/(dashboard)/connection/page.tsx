"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken, getUser } from "@/lib/auth";
import { getNetworkingProfiles, getNetworkingProfileByUserId, createOrUpdateNetworkingProfile } from "@/services/networking";
import { getMentors, getMentorByUserId, createOrUpdateMentor } from "@/services/mentoring";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ConnectionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("networking");
  const [networkingProfiles, setNetworkingProfiles] = useState<any[]>([]);
  const [mentorProfiles, setMentorProfiles] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userMentorProfile, setUserMentorProfile] = useState<any>(null);
  const [isProfileFormOpen, setIsProfileFormOpen] = useState(false);
  const [isMentorFormOpen, setIsMentorFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Networking Form State
  const [formState, setFormState] = useState({
    headline: "",
    current_status: "",
    bio: "",
    skills: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    open_to: [] as string[]
  });

  // Mentor Form State
  const [mentorFormState, setMentorFormState] = useState({
    headline: "",
    current_status: "",
    bio: "",
    skills: "",
    expertise: "",
    whatsapp_number: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    open_to: [] as string[]
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    if (userData) {
      fetchUserProfile(userData.id);
      fetchUserMentorProfile(userData.id);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "networking") fetchNetworkingProfiles();
    if (activeTab === "mentoring") fetchMentorProfiles();
  }, [activeTab]);

  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await getNetworkingProfileByUserId(userId);
      if (profile) {
        setUserProfile(profile);
        setFormState({
          headline: profile.headline || "",
          current_status: profile.current_status || "",
          bio: profile.bio || "",
          skills: profile.skills?.join(", ") || "",
          linkedin_url: profile.linkedin_url || "",
          github_url: profile.github_url || "",
          portfolio_url: profile.portfolio_url || "",
          open_to: profile.open_to || []
        });
      }
    } catch (err) {}
  };

  const fetchUserMentorProfile = async (userId: string) => {
    try {
      const profile = await getMentorByUserId(userId);
      if (profile) {
        setUserMentorProfile(profile);
        setMentorFormState({
          headline: profile.headline || "",
          current_status: profile.current_status || "",
          bio: profile.bio || "",
          skills: profile.skills?.join(", ") || "",
          expertise: profile.expertise?.join(", ") || "",
          whatsapp_number: profile.whatsapp_number || "",
          linkedin_url: profile.linkedin_url || "",
          github_url: profile.github_url || "",
          portfolio_url: profile.portfolio_url || "",
          open_to: profile.open_to || []
        });
      }
    } catch (err) {}
  };

  const fetchNetworkingProfiles = async () => {
    setIsLoading(true);
    try {
      const profiles = await getNetworkingProfiles();
      setNetworkingProfiles(profiles || []);
    } catch (err) {} finally {
      setIsLoading(false);
    }
  };

  const fetchMentorProfiles = async () => {
    setIsLoading(true);
    try {
      const mentors = await getMentors();
      setMentorProfiles(mentors || []);
    } catch (err) {} finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profileData = { ...formState, skills: formState.skills.split(",").map(s => s.trim()).filter(s => s) };
      await createOrUpdateNetworkingProfile(profileData);
      setIsProfileFormOpen(false);
      await fetchNetworkingProfiles();
      if (user) await fetchUserProfile(user.id);
    } catch (err) {} finally {
      setIsSubmitting(false);
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const mentorData = { ...mentorFormState, skills: mentorFormState.skills.split(",").map(s => s.trim()).filter(s => s), expertise: mentorFormState.expertise.split(",").map(s => s.trim()).filter(s => s) };
      await createOrUpdateMentor(mentorData);
      setIsMentorFormOpen(false);
      await fetchMentorProfiles();
      if (user) await fetchUserMentorProfile(user.id);
    } catch (err) {} finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = (number: string) => {
    if (!number) return;
    const cleaned = number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">Connections</h1>
          <p className="text-zinc-400 text-lg">Build your academic network and find mentors to accelerate your growth.</p>
        </div>
        <div className="flex gap-4">
          {activeTab === "networking" ? (
            <Button onClick={() => setIsProfileFormOpen(true)}>
              {userProfile ? "Edit My Profile" : "Join Networking Hub"}
            </Button>
          ) : (
            <Button onClick={() => setIsMentorFormOpen(true)}>
              {userMentorProfile ? "Edit Mentor Profile" : "Become a Mentor"}
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-1">
        {[
          { id: "networking", label: "Professional Hub", icon: "🤝" },
          { id: "mentoring", label: "Mentorship Board", icon: "💎" }
        ].map((tab) => (
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

      {isLoading ? (
        <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" /></div>
      ) : activeTab === "networking" ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {networkingProfiles.map((profile) => (
            <Card key={profile.id} hoverable className="flex flex-col group">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-zinc-800 flex items-center justify-center text-2xl font-black text-sky-400 shadow-inner group-hover:bg-sky-500/10 transition-colors">
                  {profile.first_name?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-sky-400 transition-colors tracking-tight">{profile.first_name} {profile.last_name}</h3>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none mt-1">{profile.department_name}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-zinc-300 mb-2 line-clamp-1">{profile.headline}</p>
              <p className="text-xs text-zinc-500 mb-6 line-clamp-2 leading-relaxed">{profile.bio}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-8">
                {profile.skills?.slice(0, 4).map((skill: string) => (
                  <span key={skill} className="px-2.5 py-1 bg-zinc-800 rounded-lg text-[10px] font-bold text-zinc-400 tracking-tight">{skill}</span>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-800 grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" onClick={() => profile.linkedin_url && window.open(profile.linkedin_url, "_blank")}>Connect</Button>
                <Link href={`/profile/${profile.user_id}`}><Button variant="secondary" size="sm" className="w-full">Profile</Button></Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mentorProfiles.map((mentor) => (
            <Card key={mentor.id} hoverable className="flex flex-col group border-sky-500/10 bg-sky-500/[0.01]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-zinc-800 flex items-center justify-center text-3xl font-black text-sky-500 shadow-inner group-hover:bg-sky-500/20 transition-colors">
                  {mentor.first_name?.[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors tracking-tight">{mentor.first_name} {mentor.last_name}</h3>
                  <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1">Certified Mentor</p>
                </div>
              </div>
              <h4 className="text-sm font-bold text-zinc-200 mb-2">{mentor.headline}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6 line-clamp-3">{mentor.bio}</p>

              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {mentor.expertise?.slice(0, 3).map((exp: string) => (
                      <span key={exp} className="px-2.5 py-1 bg-sky-500/5 text-sky-400 border border-sky-500/10 rounded-lg text-[10px] font-bold">{exp}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-zinc-800 grid grid-cols-2 gap-3">
                <Button variant="secondary" size="sm" onClick={() => router.push(`/profile/${mentor.user_id}`)}>View Story</Button>
                <Button size="sm" onClick={() => openWhatsApp(mentor.whatsapp_number)}>Book Session</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {isProfileFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{userProfile ? "Edit Networking Profile" : "Join Networking Hub"}</h2>
                <p className="text-sm text-zinc-400">Share your professional story and connect with peers.</p>
              </div>
              <Button variant="ghost" onClick={() => setIsProfileFormOpen(false)}>Close</Button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Headline
                  <input
                    value={formState.headline}
                    onChange={(e) => setFormState((prev) => ({ ...prev, headline: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Your current role or focus"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Current Status
                  <input
                    value={formState.current_status}
                    onChange={(e) => setFormState((prev) => ({ ...prev, current_status: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Student, Intern, Researcher..."
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-zinc-300">
                Bio
                <textarea
                  value={formState.bio}
                  onChange={(e) => setFormState((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full min-h-[120px] rounded-3xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                  placeholder="Tell fellow students about your interests and goals"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Skills
                  <input
                    value={formState.skills}
                    onChange={(e) => setFormState((prev) => ({ ...prev, skills: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Comma separated skills"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  LinkedIn URL
                  <input
                    value={formState.linkedin_url}
                    onChange={(e) => setFormState((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://linkedin.com/..."
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  GitHub URL
                  <input
                    value={formState.github_url}
                    onChange={(e) => setFormState((prev) => ({ ...prev, github_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://github.com/..."
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Portfolio URL
                  <input
                    value={formState.portfolio_url}
                    onChange={(e) => setFormState((prev) => ({ ...prev, portfolio_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://yourportfolio.com"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-zinc-300">
                Open To
                <input
                  value={formState.open_to.join(", ")}
                  onChange={(e) => setFormState((prev) => ({ ...prev, open_to: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                  placeholder="Mentoring, Collaboration, Study Groups"
                />
              </label>
              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="secondary" type="button" onClick={() => setIsProfileFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Profile"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMentorFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">{userMentorProfile ? "Edit Mentor Profile" : "Become a Mentor"}</h2>
                <p className="text-sm text-zinc-400">Offer guidance, share expertise, and connect with mentees.</p>
              </div>
              <Button variant="ghost" onClick={() => setIsMentorFormOpen(false)}>Close</Button>
            </div>
            <form onSubmit={handleMentorSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Headline
                  <input
                    value={mentorFormState.headline}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, headline: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Your mentor title or expertise"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Current Status
                  <input
                    value={mentorFormState.current_status}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, current_status: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Professor, Industry Mentor, Student Mentor..."
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-zinc-300">
                Bio
                <textarea
                  value={mentorFormState.bio}
                  onChange={(e) => setMentorFormState((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full min-h-[120px] rounded-3xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                  placeholder="Describe your mentorship approach and experience"
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  Skills
                  <input
                    value={mentorFormState.skills}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, skills: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Comma separated skills"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Expertise
                  <input
                    value={mentorFormState.expertise}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, expertise: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="Comma separated areas of expertise"
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  WhatsApp Number
                  <input
                    value={mentorFormState.whatsapp_number}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="+1234567890"
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  LinkedIn URL
                  <input
                    value={mentorFormState.linkedin_url}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://linkedin.com/..."
                  />
                </label>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-zinc-300">
                  GitHub URL
                  <input
                    value={mentorFormState.github_url}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, github_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://github.com/..."
                  />
                </label>
                <label className="space-y-2 text-sm text-zinc-300">
                  Portfolio URL
                  <input
                    value={mentorFormState.portfolio_url}
                    onChange={(e) => setMentorFormState((prev) => ({ ...prev, portfolio_url: e.target.value }))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                    placeholder="https://yourportfolio.com"
                  />
                </label>
              </div>
              <label className="space-y-2 text-sm text-zinc-300">
                Open To
                <input
                  value={mentorFormState.open_to.join(", ")}
                  onChange={(e) => setMentorFormState((prev) => ({ ...prev, open_to: e.target.value.split(",").map((item) => item.trim()).filter(Boolean) }))}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-500"
                  placeholder="Mentoring, Coaching, Project Review"
                />
              </label>
              <div className="flex items-center justify-end gap-3 pt-3">
                <Button variant="secondary" type="button" onClick={() => setIsMentorFormOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Mentor Profile"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getToken, getUser } from "@/lib/auth";
import { getNetworkingProfiles, getNetworkingProfileByUserId, createOrUpdateNetworkingProfile } from "@/services/networking";
import { getMentors, getMentorByUserId, createOrUpdateMentor } from "@/services/mentoring";
import AppLayout from "@/components/AppLayout";

export default function ConnectionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("networking");
  const [networkingProfiles, setNetworkingProfiles] = useState<any[]>([]);
  const [mentorProfiles, setMentorProfiles] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);
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
    setIsClient(true);
    const userData = getUser();
    setUser(userData);
    if (userData) {
      fetchUserProfile(userData.id);
      fetchUserMentorProfile(userData.id);
    }
  }, []);

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
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
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
    } catch (error) {
    }
  };

  const fetchNetworkingProfiles = async () => {
    if (activeTab === "networking") setIsLoading(true);
    try {
      const profiles = await getNetworkingProfiles();
      setNetworkingProfiles(profiles || []);
    } catch (error) {
      console.error('Failed to fetch networking profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMentorProfiles = async () => {
    if (activeTab === "mentoring") setIsLoading(true);
    try {
      const mentors = await getMentors();
      setMentorProfiles(mentors || []);
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "networking") fetchNetworkingProfiles();
    if (activeTab === "mentoring") fetchMentorProfiles();
  }, [activeTab]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const profileData = {
        ...formState,
        skills: formState.skills.split(",").map(s => s.trim()).filter(s => s)
      };
      const result = await createOrUpdateNetworkingProfile(profileData);
      if (result) {
        setIsProfileFormOpen(false);
        await fetchNetworkingProfiles();
        if (user) await fetchUserProfile(user.id);
      }
    } catch (error: any) {
      alert(error.message || "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMentorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const mentorData = {
        ...mentorFormState,
        skills: mentorFormState.skills.split(",").map(s => s.trim()).filter(s => s),
        expertise: mentorFormState.expertise.split(",").map(s => s.trim()).filter(s => s)
      };
      const result = await createOrUpdateMentor(mentorData);
      if (result) {
        setIsMentorFormOpen(false);
        await fetchMentorProfiles();
        if (user) await fetchUserMentorProfile(user.id);
      }
    } catch (error: any) {
      alert(error.message || "Failed to save mentor profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProtectedAction = (callback?: () => void) => {
    if (!user) {
      localStorage.setItem("intendedRoute", "/connection");
      router.push("/login");
      return false;
    }
    if (callback) callback();
    return true;
  };

  const openWhatsApp = (number: string) => {
    if (!number) {
      alert("Mentor's WhatsApp contact is not available.");
      return;
    }
    const cleaned = number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <ContentArea
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        userProfile={userProfile}
        userMentorProfile={userMentorProfile}
        networkingProfiles={networkingProfiles}
        mentorProfiles={mentorProfiles}
        handleProtectedAction={handleProtectedAction}
        isProfileFormOpen={isProfileFormOpen}
        setIsProfileFormOpen={setIsProfileFormOpen}
        isMentorFormOpen={isMentorFormOpen}
        setIsMentorFormOpen={setIsMentorFormOpen}
        formState={formState}
        setFormState={setFormState}
        mentorFormState={mentorFormState}
        setMentorFormState={setMentorFormState}
        handleProfileSubmit={handleProfileSubmit}
        handleMentorSubmit={handleMentorSubmit}
        isSubmitting={isSubmitting}
        isLoading={isLoading}
        openWhatsApp={openWhatsApp}
      />
    </div>
  );

  if (!isClient) return content;
  return user ? <AppLayout>{content}</AppLayout> : content;
}

function ContentArea({
  activeTab,
  setActiveTab,
  user,
  userProfile,
  userMentorProfile,
  networkingProfiles,
  mentorProfiles,
  handleProtectedAction,
  isProfileFormOpen,
  setIsProfileFormOpen,
  isMentorFormOpen,
  setIsMentorFormOpen,
  formState,
  setFormState,
  mentorFormState,
  setMentorFormState,
  handleProfileSubmit,
  handleMentorSubmit,
  isSubmitting,
  isLoading,
  openWhatsApp
}: any) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-4">Connection</h1>
          <p className="text-white/80">
            Build your network and find mentors to accelerate your academic and career journey.
          </p>
        </div>
        {user && (
          <div className="flex gap-4">
            {activeTab === "networking" ? (
              <button
                onClick={() => setIsProfileFormOpen(true)}
                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:opacity-90 hover:scale-105"
              >
                {userProfile ? "Edit My Profile" : "Join Networking Hub"}
              </button>
            ) : (
              <button
                onClick={() => handleProtectedAction(() => setIsMentorFormOpen(true))}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:opacity-90 hover:scale-105"
              >
                {userMentorProfile ? "Edit Mentor Profile" : "Become a Mentor"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Networking Profile Form Modal */}
      {isProfileFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-sans">
          <div className="w-full max-w-2xl bg-[#12121e] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Complete Your Networking Profile</h2>
              <button onClick={() => setIsProfileFormOpen(false)} className="text-white/30 hover:text-white transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Headline</label>
                  <input type="text" placeholder="e.g. Aspiring Software Engineer | CSE Student" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all bg-zinc-900/50" value={formState.headline} onChange={(e) => setFormState({...formState, headline: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Current Status</label>
                  <input type="text" placeholder="e.g. 3rd Year Student / Intern @ TechCo" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all bg-zinc-900/50" value={formState.current_status} onChange={(e) => setFormState({...formState, current_status: e.target.value})} required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Bio</label>
                <textarea placeholder="Tell the community about yourself..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all resize-none bg-zinc-900/50" value={formState.bio} onChange={(e) => setFormState({...formState, bio: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Skills (comma separated)</label>
                <input type="text" placeholder="e.g. React, Node.js, Python, UI Design" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all bg-zinc-900/50" value={formState.skills} onChange={(e) => setFormState({...formState, skills: e.target.value})} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">LinkedIn URL</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all bg-zinc-900/50" value={formState.linkedin_url} onChange={(e) => setFormState({...formState, linkedin_url: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">GitHub/Portfolio URL</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-all bg-zinc-900/50" value={formState.github_url} onChange={(e) => setFormState({...formState, github_url: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Open To</label>
                <div className="flex flex-wrap gap-2">
                  {['Mentorship', 'Collaboration', 'Networking', 'Career Guidance'].map(item => (
                    <label key={item} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${formState.open_to?.includes(item) ? 'bg-purple-500/10 border-purple-500 text-purple-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                      <input type="checkbox" className="hidden" checked={(formState.open_to || []).includes(item)} onChange={(e) => {
                          const openTo = formState.open_to || [];
                          if (e.target.checked) setFormState({...formState, open_to: [...openTo, item]});
                          else setFormState({...formState, open_to: openTo.filter(i => i !== item)});
                      }} />
                      <span className={`w-2 h-2 rounded-full ${formState.open_to?.includes(item) ? 'bg-purple-500' : 'bg-white/20'}`} />
                      <span className="text-xs font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button type="button" onClick={() => setIsProfileFormOpen(false)} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold hover:opacity-90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-purple-500/20">{isSubmitting ? "Saving..." : "Save Profile"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mentor Profile Form Modal */}
      {isMentorFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto font-sans">
          <div className="w-full max-w-2xl bg-[#0f1118] border border-white/10 rounded-2xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Complete Your Mentor Profile</h2>
              <button onClick={() => setIsMentorFormOpen(false)} className="text-white/30 hover:text-white transition-colors text-xl">✕</button>
            </div>
            <form onSubmit={handleMentorSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Headline</label>
                  <input type="text" placeholder="e.g. Senior Data Scientist | PhD in AI" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all bg-zinc-900/50" value={mentorFormState.headline} onChange={(e) => setMentorFormState({...mentorFormState, headline: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Current Status</label>
                  <input type="text" placeholder="e.g. Assistant Professor @ University" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all bg-zinc-900/50" value={mentorFormState.current_status} onChange={(e) => setMentorFormState({...mentorFormState, current_status: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Mentoring Bio</label>
                <textarea placeholder="Describe your experience and how you can help students..." rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none bg-zinc-900/50" value={mentorFormState.bio} onChange={(e) => setMentorFormState({...mentorFormState, bio: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Areas of Expertise (comma separated)</label>
                  <input type="text" placeholder="e.g. Academic Research, Career Coaching" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all bg-zinc-900/50" value={mentorFormState.expertise} onChange={(e) => setMentorFormState({...mentorFormState, expertise: e.target.value})} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">WhatsApp Number (with country code)</label>
                  <input type="text" placeholder="e.g. +8801700000000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all bg-zinc-900/50" value={mentorFormState.whatsapp_number} onChange={(e) => setMentorFormState({...mentorFormState, whatsapp_number: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Technical Skills (comma separated)</label>
                <input type="text" placeholder="e.g. Python, LaTeX, SPSS, Research Design" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all bg-zinc-900/50" value={mentorFormState.skills} onChange={(e) => setMentorFormState({...mentorFormState, skills: e.target.value})} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">LinkedIn URL</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all bg-zinc-900/50" value={mentorFormState.linkedin_url} onChange={(e) => setMentorFormState({...mentorFormState, linkedin_url: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-2">Portfolio/GitHub URL</label>
                  <input type="url" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-all bg-zinc-900/50" value={mentorFormState.portfolio_url} onChange={(e) => setMentorFormState({...mentorFormState, portfolio_url: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">I can provide help with</label>
                <div className="flex flex-wrap gap-2">
                  {['Career Guidance', 'Project Guidance', 'Collaboration', 'Roadmap Help', 'Internship Guidance'].map(item => (
                    <label key={item} className={`flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer transition-all ${mentorFormState.open_to?.includes(item) ? 'bg-blue-500/10 border-blue-500 text-blue-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}>
                      <input type="checkbox" className="hidden" checked={(mentorFormState.open_to || []).includes(item)} onChange={(e) => {
                          const openTo = mentorFormState.open_to || [];
                          if (e.target.checked) setMentorFormState({...mentorFormState, open_to: [...openTo, item]});
                          else setMentorFormState({...mentorFormState, open_to: openTo.filter(i => i !== item)});
                      }} />
                      <span className={`w-2 h-2 rounded-full ${mentorFormState.open_to?.includes(item) ? 'bg-blue-500' : 'bg-white/20'}`} />
                      <span className="text-xs font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                <button type="button" onClick={() => setIsMentorFormOpen(false)} className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 font-bold hover:opacity-90 transition-all disabled:opacity-50 text-sm shadow-lg shadow-blue-500/20">{isSubmitting ? "Saving..." : "Save Mentor Profile"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 mb-10 bg-white/5 p-1 rounded-2xl max-w-md mx-auto">
        <button onClick={() => setActiveTab("networking")} className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === "networking" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" : "text-white/40 hover:text-white"}`}>Networking</button>
        <button onClick={() => setActiveTab("mentoring")} className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all ${activeTab === "mentoring" ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg" : "text-white/40 hover:text-white"}`}>Mentoring</button>
      </div>

      {/* Networking Tab */}
      {activeTab === "networking" && (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span className="h-8 w-1.5 rounded-full bg-purple-500" />Peer Professional Discovery
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" /></div>
          ) : (networkingProfiles || []).length === 0 ? (
            <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Networking Hub is Quiet</h3>
              <p className="text-white/40 max-w-sm mx-auto">Start by building your profile and be the first to connect with others in your academic circle.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(networkingProfiles || []).map((profile: any) => (
                <div key={profile.id} className="group relative rounded-3xl border border-white/10 bg-zinc-900/50 p-6 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:bg-zinc-900 overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-4xl">💼</span></div>
                  <div className="flex items-center gap-4 mb-6 relative">
                    {profile.profile_photo_url ? (
                      <img src={profile.profile_photo_url} alt={profile.first_name} className="h-16 w-16 rounded-2xl object-cover ring-2 ring-purple-500/20" />
                    ) : (
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-black shadow-lg shadow-purple-500/20">{profile.first_name?.charAt(0)}</div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors uppercase tracking-tight">{profile.first_name} {profile.last_name}</h3>
                      <p className="text-xs text-white/40 font-semibold tracking-wider uppercase mb-1">{profile.department_name}</p>
                      <p className="text-sm text-purple-300/80 font-medium line-clamp-1">{profile.headline}</p>
                    </div>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-xs text-white/30 uppercase font-black mb-1">Current Focus</p>
                        <p className="text-sm text-white/80 font-medium">{profile.current_status}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.skills || []).slice(0, 4).map((skill: string) => (
                        <span key={skill} className="px-3 py-1 bg-purple-500/5 border border-purple-500/10 rounded-full text-[10px] font-bold text-purple-400/80 uppercase tracking-tighter">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 relative">
                    <button onClick={() => profile.linkedin_url ? window.open(profile.linkedin_url, "_blank") : alert("LinkedIn profile not provided.")} className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${profile.linkedin_url ? "bg-white text-black hover:bg-white/90" : "bg-white/5 text-white/20 cursor-not-allowed"}`}>Connect</button>
                    <Link href={`/profile/${profile.user_id}`} className="block">
                      <button className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Profile</button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mentoring Tab */}
      {activeTab === "mentoring" && (
        <div className="animate-in fade-in duration-500 space-y-12">
          {/* Mentor CTA */}
          <div className="relative overflow-hidden rounded-[40px] bg-[#1a1c24] border border-white/5 p-10 md:p-16 text-center md:text-left group transition-all hover:border-blue-500/20">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest mb-6">Community First</div>
                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Elevate Others.<br/><span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Become a Mentor.</span></h2>
                <p className="text-white/50 text-xl leading-relaxed font-medium">Join our network of students and graduates helping each other reach their full potential. Your experience can change someone's path.</p>
              </div>
              <button onClick={() => handleProtectedAction(() => setIsMentorFormOpen(true))} className="px-10 py-5 rounded-3xl bg-blue-500 text-white font-black uppercase tracking-widest hover:bg-blue-400 transition-all transform hover:scale-105 shadow-2xl shadow-blue-500/40">Ignite a Mind</button>
            </div>
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] group-hover:bg-blue-600/10 transition-all duration-700" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-600/5 rounded-full blur-[100px] group-hover:bg-cyan-600/10 transition-all duration-700" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
                <span className="h-8 w-1.5 rounded-full bg-blue-500" />Academic & Career Mentors
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" /></div>
            ) : (mentorProfiles || []).length === 0 ? (
              <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                <div className="text-5xl mb-6">💎</div>
                <h3 className="text-2xl font-bold mb-3 text-white">Mentor Room is Open</h3>
                <p className="text-white/40 max-w-sm mx-auto">We're looking for our first pioneers. If you've got experience, step up and guide the next generation.</p>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {(mentorProfiles || []).map((mentor: any) => (
                  <div key={mentor.id} className="group relative rounded-[32px] border border-white/10 bg-zinc-900/30 p-8 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:bg-zinc-900 overflow-hidden">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between mb-8">
                        <div className="relative">
                          {mentor.profile_photo_url ? (
                            <img src={mentor.profile_photo_url} alt={mentor.first_name} className="h-20 w-20 rounded-3xl object-cover ring-4 ring-blue-500/10" />
                          ) : (
                            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-black shadow-xl shadow-blue-500/20">{mentor.first_name?.charAt(0)}</div>
                          )}
                          <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-green-500 border-4 border-[#0a0a0f] flex items-center justify-center text-[10px] shadow-lg">⚡</div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-400 uppercase tracking-widest">{mentor.department_name}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-2xl font-black mb-1 group-hover:text-blue-300 transition-colors tracking-tight leading-none uppercase">{mentor.first_name} {mentor.last_name}</h3>
                        <p className="text-blue-400/80 font-bold text-sm mb-4 line-clamp-1">{mentor.headline}</p>
                        <p className="text-white/40 text-sm font-medium leading-relaxed italic line-clamp-3">"{mentor.bio || "No bio provided"}"</p>
                      </div>

                      <div className="space-y-4 mb-8 flex-grow">
                        <div>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-3">Core Expertise</p>
                          <div className="flex flex-wrap gap-2">
                            {(mentor.expertise || []).slice(0, 3).map((item: string) => (
                              <span key={item} className="px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-xl text-[10px] font-black text-blue-200 uppercase tracking-tighter">{item}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Link href={`/profile/${mentor.user_id}`} className="block">
                          <button className="w-full px-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">Details</button>
                        </Link>
                        <button onClick={() => openWhatsApp(mentor.whatsapp_number)} className="px-4 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:opacity-90 transition-all">Book Session</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

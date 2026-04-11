"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getNetworkingProfileByUserId } from "@/services/networking";
import { getUser } from "@/lib/auth";
import { API_URL } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    setCurrentUser(getUser());
    const fetchProfile = async () => {
      try {
        const data = await getNetworkingProfileByUserId(userId);
        if (data) setProfile(data);
        else setError("Profile not found");
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleSendMessage = () => {
    if (!messageContent.trim()) return;
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setHasSent(true);
      setTimeout(() => {
        setIsMessageModalOpen(false);
        setHasSent(false);
        setMessageContent("");
      }, 2000);
    }, 1500);
  };

  const isOwnProfile = currentUser?.id?.toString() === userId?.toString();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium">Loading user identity...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-xl mx-auto py-32 text-center space-y-6">
        <div className="text-6xl">👤</div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">{error || "Identity Lost"}</h1>
          <p className="text-zinc-500">The scholar you're looking for was not found in our directory.</p>
        </div>
        <Link href="/connection" className="block">
          <Button variant="secondary">Return to Connections</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 pt-8 pb-20">
      {/* Hero Profile Header */}
      <section className="relative pt-24">
        <div className="absolute top-0 left-0 right-0 h-48 rounded-[3rem] border border-sky-500/10 overflow-hidden bg-zinc-900">
           {profile.cover_photo_url ? (
             <img src={profile.cover_photo_url.startsWith('http') ? profile.cover_photo_url : `${API_URL}${profile.cover_photo_url}`} className="w-full h-full object-cover opacity-60" alt="Cover" />
           ) : (
             <div className="w-full h-full bg-gradient-to-r from-sky-600/20 via-sky-500/10 to-transparent" />
           )}
        </div>
        <div className="relative px-8 flex flex-col md:flex-row items-end gap-8">
          <ProfileAvatar
            src={profile.profile_photo_url}
            name={`${profile.first_name || ''} ${profile.last_name || ''}`}
            size="xl"
            className="border-4 border-[#09090b] shadow-2xl shadow-sky-500/10"
          />
          <div className="flex-1 pb-4 space-y-2">
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">{profile.first_name} {profile.last_name}</h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="text-sky-400 font-bold uppercase tracking-wider text-sm">{profile.headline}</p>
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 hidden md:block" />
              <p className="text-zinc-500 font-medium text-sm">{profile.department_name} • {profile.current_status}</p>
            </div>
          </div>
          <div className="flex gap-4 pb-4">
             {profile.linkedin_url && (
               <Button variant="outline" size="sm" onClick={() => window.open(profile.linkedin_url, "_blank")} className="w-12 h-12 p-0">
                  <span className="text-xl">🔗</span>
               </Button>
             )}
             {isOwnProfile ? (
               <Link href="/profile/edit">
                 <Button size="lg" className="px-10">Edit Profile</Button>
               </Link>
             ) : (
               <Button size="lg" className="px-10" onClick={() => setIsMessageModalOpen(true)}>Send Direct Message</Button>
             )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-10 space-y-6">
             <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Biography</h2>
             <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-wrap font-medium">
               {profile.bio || "This scholar hasn't shared their story yet."}
             </p>
          </Card>

          <Card className="p-10 space-y-8">
             <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">Expertise & Skills</h2>
             <div className="flex flex-wrap gap-3">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill: string) => (
                    <span key={skill} className="px-5 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-2xl text-sm font-bold shadow-sm">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-zinc-600 italic">No technical skills listed.</p>
                )}
             </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <Card className="p-8 space-y-8">
            <div className="space-y-6">
               <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Current Interests</h3>
               <div className="space-y-4">
                  {profile.open_to?.length > 0 ? (
                    profile.open_to.map((item: string) => (
                      <div key={item} className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
                         <p className="text-sm font-bold text-zinc-300">Open to {item}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-600 text-sm">No interests declared.</p>
                  )}
               </div>
            </div>

            <div className="pt-8 border-t border-zinc-800/50 space-y-6">
               <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">Profile Info</h3>
               <div className="space-y-4 text-sm font-bold">
                  <div className="flex justify-between">
                    <span className="text-zinc-500 uppercase tracking-tighter">Department</span>
                    <span className="text-zinc-200">{profile.department_name}</span>
                  </div>
                  {profile.status && (
                    <div className="flex justify-between">
                      <span className="text-zinc-500 uppercase tracking-tighter">Academic Status</span>
                      <span className="text-zinc-200">{profile.status}</span>
                    </div>
                  )}
               </div>
            </div>
          </Card>

          <Card className="bg-sky-500/5 border-sky-500/10 p-8 text-center space-y-4">
             <p className="text-xs font-black text-sky-500 uppercase tracking-widest">Growth Recommendation</p>
             <p className="text-sm text-zinc-400 font-medium leading-relaxed">Consider connecting with this scholar for collaborative academic research or peer guidance.</p>
          </Card>
        </div>
      </div>

      {/* Message Modal */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090b]/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-lg p-10 space-y-8 shadow-2xl border-sky-500/20 overflow-hidden relative">
            {hasSent ? (
              <div className="py-12 text-center space-y-6 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-4xl mx-auto text-emerald-500">✓</div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Message Dispatched</h3>
                  <p className="text-zinc-500 font-medium">Your scholarly request has been sent to {profile.first_name}.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Direct Inquiry</h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Subject: Scholar-to-Scholar Connection</p>
                  </div>
                  <button onClick={() => setIsMessageModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                     <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center font-bold text-sky-500">{profile.first_name?.[0]}</div>
                     <div>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Recipient</p>
                        <p className="text-sm font-bold text-white">{profile.first_name} {profile.last_name}</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Your Message</label>
                    <textarea
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Start a professional conversation or ask a specific academic question..."
                      className="w-full h-40 bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-zinc-300 focus:border-sky-500 outline-none transition-all placeholder:text-zinc-800"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setIsMessageModalOpen(false)}>Discard</Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleSendMessage} 
                    isLoading={isSending}
                    disabled={!messageContent.trim()}
                  >
                    Send Inquiry
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
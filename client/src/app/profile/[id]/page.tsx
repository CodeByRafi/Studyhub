"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getNetworkingProfileByUserId } from "@/services/networking";
import AppLayout from "@/components/AppLayout";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getNetworkingProfileByUserId(userId);
        if (data) {
          setProfile(data);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  if (error || !profile) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-20 text-center">
          <div className="text-6xl mb-6">👤</div>
          <h1 className="text-2xl font-bold mb-4">{error || "Profile Not Found"}</h1>
          <p className="text-white/60 mb-8">The profile you're looking for might have been moved or doesn't exist.</p>
          <Link href="/connection" className="text-purple-400 hover:underline">Back to Connection Hub</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="relative mb-8 pt-20">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-3xl" />
          <div className="relative flex flex-col md:flex-row items-end gap-6 px-8">
            <div className="h-32 w-32 rounded-3xl border-4 border-[#0a0a0f] bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-2xl overflow-hidden">
              {profile.profile_photo_url ? (
                <img src={profile.profile_photo_url} alt={profile.first_name} className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold text-white">{profile.first_name?.[0]}{profile.last_name?.[0]}</span>
              )}
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold mb-1">{profile.first_name} {profile.last_name}</h1>
              <p className="text-purple-400 font-medium mb-1">{profile.headline}</p>
              <p className="text-white/60 text-sm">{profile.department_name} • {profile.current_status}</p>
            </div>
            <div className="flex gap-3 pb-2">
              {profile.linkedin_url && (
                <a 
                  href={profile.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white"
                  title="LinkedIn"
                >
                  <span className="text-xl">🔗</span>
                </a>
              )}
              {profile.github_url && (
                <a 
                  href={profile.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white/70 hover:text-white"
                  title="GitHub"
                >
                  <span className="text-xl">💻</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: About & Skills */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
                {profile.bio || "No biography provided yet."}
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill: string) => (
                    <span 
                      key={skill} 
                      className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300 font-medium"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-white/40 italic">No skills listed.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-8">
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Interests</h2>
              <div className="space-y-4">
                {profile.open_to?.length > 0 ? (
                  profile.open_to.map((item: string) => (
                    <div key={item} className="flex items-center gap-3 text-white/80">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span className="text-sm">Open to {item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/40">Not specified</p>
                )}
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <h2 className="text-xl font-bold mb-6">Information</h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Department</span>
                  <span className="text-white/80">{profile.department_name}</span>
                </div>
                {profile.graduation_year && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Graduation</span>
                    <span className="text-white/80">{profile.graduation_year}</span>
                  </div>
                )}
                {profile.current_company && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Company</span>
                    <span className="text-white/80">{profile.current_company}</span>
                  </div>
                )}
              </div>
            </section>
            
            <button
              onClick={() => alert("Message feature coming soon!")}
              className="w-full py-4 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 font-bold shadow-lg shadow-purple-500/20 hover:opacity-90 transition-all hover:scale-[1.02]"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import AppLayout from "@/components/AppLayout";

export default function ConnectionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("networking");
  const user = getUser();

  const handleProtectedAction = () => {
    if (!user) {
      localStorage.setItem("intendedRoute", "/connection");
      router.push("/login");
    }
  };

  const networkingProfiles = [
    {
      name: "Ayesha Rahman",
      role: "CSE Final Year",
      university: "University of Dhaka",
      department: "CSE",
      skills: ["Python", "Machine Learning", "Web Dev"],
      interests: ["AI", "Startups"],
    },
    {
      name: "Rafi Ahmed",
      role: "EEE Senior",
      university: "BUET",
      department: "EEE",
      skills: ["Circuit Design", "Embedded Systems"],
      interests: ["IoT", "Robotics"],
    },
    {
      name: "Taslima Khan",
      role: "BBA Graduate",
      university: "NSU",
      department: "BBA",
      skills: ["Marketing", "Finance", "Leadership"],
      interests: ["Entrepreneurship", "Consulting"],
    },
  ];

  const mentors = [
    {
      name: "Dr. Nihad Hossain",
      expertise: "AI & Machine Learning",
      university: "University of Dhaka",
      department: "CSE",
      bio: "PhD in AI, 10+ years experience in industry and academia.",
    },
    {
      name: "Ms. Farhana Islam",
      expertise: "Career Development",
      university: "NSU",
      department: "BBA",
      bio: "MBA, Career coach helping students transition to industry.",
    },
    {
      name: "Mr. Karim Ullah",
      expertise: "Research & Publications",
      university: "BUET",
      department: "EEE",
      bio: "Published 20+ papers, expert in academic writing.",
    },
  ];

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <ContentArea
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        networkingProfiles={networkingProfiles}
        mentors={mentors}
        handleProtectedAction={handleProtectedAction}
      />
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}

function ContentArea({
  activeTab,
  setActiveTab,
  user,
  networkingProfiles,
  mentors,
  handleProtectedAction,
}: any) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-4">Connection</h1>
        <p className="text-white/80 mb-8">
          Build your network and find mentors to accelerate your academic and career journey.
        </p>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("networking")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "networking"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Networking
          </button>
          <button
            onClick={() => setActiveTab("mentoring")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeTab === "mentoring"
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "text-white/70 hover:text-white"
            }`}
          >
            Mentoring
          </button>
        </div>

        {/* Networking Tab */}
        {activeTab === "networking" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Connect with Peers & Alumni</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {networkingProfiles.map((profile: any) => (
                <div key={profile.name} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-lg font-bold">{profile.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-white/60">{profile.role}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><span className="text-white/70">University:</span> {profile.university}</p>
                    <p className="text-sm"><span className="text-white/70">Department:</span> {profile.department}</p>
                    <p className="text-sm"><span className="text-white/70">Skills:</span> {profile.skills.join(", ")}</p>
                    <p className="text-sm"><span className="text-white/70">Interests:</span> {profile.interests.join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProtectedAction}
                      className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                    >
                      Connect
                    </button>
                    <button
                      onClick={handleProtectedAction}
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentoring Tab */}
        {activeTab === "mentoring" && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Find Mentors</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor: any) => (
                <div key={mentor.name} className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 hover:border-purple-500/50 transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <span className="text-lg font-bold">{mentor.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{mentor.name}</h3>
                      <p className="text-sm text-white/60">{mentor.expertise}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm"><span className="text-white/70">University:</span> {mentor.university}</p>
                    <p className="text-sm"><span className="text-white/70">Department:</span> {mentor.department}</p>
                    <p className="text-sm text-white/70">{mentor.bio}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleProtectedAction}
                      className="flex-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
                    >
                      Request Mentorship
                    </button>
                    <button
                      onClick={handleProtectedAction}
                      className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10"
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    );
}
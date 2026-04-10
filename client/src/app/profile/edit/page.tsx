"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/auth";
import {
  getNetworkingProfileByUserId,
  createOrUpdateNetworkingProfile,
} from "@/services/networking";
import AppLayout from "@/components/AppLayout";

export default function ProfileEditPage() {
  const router = useRouter();
  const user = getUser();
  const [formData, setFormData] = useState({
    headline: "",
    current_status: "",
    bio: "",
    skills: "",
    current_company: "",
    role_designation: "",
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    graduation_year: "",
    open_to: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const profileData = await getNetworkingProfileByUserId(user.id);
          if (profileData) {
            setFormData({
              ...profileData,
              skills: profileData.skills.join(", "),
              open_to: profileData.open_to.join(", "),
            });
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateNetworkingProfile({
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
        open_to: formData.open_to.split(",").map((s) => s.trim()),
      });
      router.push(`/profile/${user.id}`);
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  const content = (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Edit Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-white/80 mb-1">
              Headline
            </label>
            <input
              type="text"
              name="headline"
              id="headline"
              value={formData.headline}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="current_status" className="block text-sm font-medium text-white/80 mb-1">
              Current Status
            </label>
            <input
              type="text"
              name="current_status"
              id="current_status"
              value={formData.current_status}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              id="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-white/80 mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              name="skills"
              id="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="open_to" className="block text-sm font-medium text-white/80 mb-1">
              Open To (comma-separated)
            </label>
            <input
              type="text"
              name="open_to"
              id="open_to"
              value={formData.open_to}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="current_company" className="block text-sm font-medium text-white/80 mb-1">
              Current Company
            </label>
            <input
              type="text"
              name="current_company"
              id="current_company"
              value={formData.current_company}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="role_designation" className="block text-sm font-medium text-white/80 mb-1">
              Role/Designation
            </label>
            <input
              type="text"
              name="role_designation"
              id="role_designation"
              value={formData.role_designation}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="graduation_year" className="block text-sm font-medium text-white/80 mb-1">
              Graduation Year
            </label>
            <input
              type="text"
              name="graduation_year"
              id="graduation_year"
              value={formData.graduation_year}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-white/80 mb-1">
              LinkedIn URL
            </label>
            <input
              type="text"
              name="linkedin_url"
              id="linkedin_url"
              value={formData.linkedin_url}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-white/80 mb-1">
              GitHub URL
            </label>
            <input
              type="text"
              name="github_url"
              id="github_url"
              value={formData.github_url}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="portfolio_url" className="block text-sm font-medium text-white/80 mb-1">
              Portfolio URL
            </label>
            <input
              type="text"
              name="portfolio_url"
              id="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
          >
            Save Profile
          </button>
        </form>
      </main>
    </div>
  );

  if (user) {
    return <AppLayout>{content}</AppLayout>;
  }
  return content;
}
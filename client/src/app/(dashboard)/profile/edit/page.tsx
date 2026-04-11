"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUser, setLoginData, getToken } from "@/lib/auth";
import {
  getNetworkingProfileByUserId,
  createOrUpdateNetworkingProfile,
} from "@/services/networking";
import { uploadProfileImage } from "@/services/user";
import { API_URL } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProfileAvatar } from "@/components/ui/ProfileAvatar";

export default function ProfileEditPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");
  const [coverFile, setCoverFile] = useState<File | null>(null);

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
    profile_photo_url: "",
    cover_photo_url: "",
  });

  useEffect(() => {
    const userData = getUser();
    setUser(userData);

    if (userData) {
      const fetchProfile = async () => {
        try {
          const profileData = await getNetworkingProfileByUserId(userData.id);
          if (profileData) {
            setFormData({
              ...profileData,
              skills: profileData.skills?.join(", ") || "",
              open_to: profileData.open_to?.join(", ") || "",
            });
            if (profileData.profile_photo_url) setProfileImageUrl(profileData.profile_photo_url);
            if (profileData.cover_photo_url) setCoverPreview(profileData.cover_photo_url);
          }
          // Also use the user's profile_image from the users table
          if (userData.profile_image) {
            setProfileImageUrl(userData.profile_image);
          }
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Profile image selection with instant preview
  const handleProfileImageSelect = (file: File) => {
    // Validate client-side
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Only JPEG, PNG, and WEBP allowed", "error");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // Cover photo selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  // Upload profile image immediately
  const handleUploadProfileImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const updatedUser = await uploadProfileImage(selectedFile);
      setProfileImageUrl(updatedUser.profile_image);
      setPreviewUrl("");
      setSelectedFile(null);

      // Update local auth storage so the image persists across page navigations
      const token = getToken();
      if (token) {
        const currentUser = getUser();
        setLoginData(token, { ...currentUser, profile_image: updatedUser.profile_image });
      }

      showToast("Profile photo updated!", "success");
    } catch (error: any) {
      showToast(error.message || "Upload failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "skills") {
        data.append(key, value.split(",").map((s) => s.trim()).filter((s) => s).join(","));
      } else if (key === "open_to") {
        data.append(key, value.split(",").map((s) => s.trim()).filter((s) => s).join(","));
      } else if (value !== null && value !== undefined) {
        data.append(key, value.toString());
      }
    });

    if (coverFile) data.append("cover_photo", coverFile);

    try {
      await createOrUpdateNetworkingProfile(data);
      showToast("Profile saved!", "success");
      setTimeout(() => router.push(`/profile/${user.id}`), 500);
    } catch (error) {
      console.error("Failed to save profile:", error);
      showToast("Failed to save profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-10 h-10 border-4 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  const displayImageUrl = previewUrl || profileImageUrl;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12 animate-in fade-in duration-500">
      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed top-8 right-8 z-[100] px-6 py-4 rounded-2xl border shadow-2xl animate-in slide-in-from-right duration-300 ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          <p className="text-sm font-bold">{toast.message}</p>
        </div>
      )}

      <div className="space-y-2">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">
          Refine Your Identity
        </h1>
        <p className="text-zinc-500 text-lg font-medium">
          Update your scholarly presence and visual identity.
        </p>
      </div>

      {/* Profile Image Upload Section */}
      <Card className="p-10 space-y-8">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">
          Profile Photo
        </h2>
        <div className="flex items-center gap-8">
          <ProfileAvatar
            src={displayImageUrl}
            name={`${user?.first_name || ""} ${user?.last_name || ""}`}
            size="xl"
            editable
            onFileSelect={handleProfileImageSelect}
            isUploading={uploadingImage}
          />

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                {user?.first_name} {user?.last_name}
              </h3>
              <p className="text-zinc-500 text-sm font-medium">
                Click avatar or drag & drop to select a new photo
              </p>
            </div>

            {selectedFile && !uploadingImage && (
              <div className="flex items-center gap-4 p-4 bg-sky-500/5 border border-sky-500/20 rounded-2xl">
                <div className="flex-1">
                  <p className="text-sm font-bold text-sky-400">{selectedFile.name}</p>
                  <p className="text-xs text-zinc-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleUploadProfileImage}
                  className="px-6"
                >
                  Upload
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}

            <div className="flex gap-3">
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                JPG
              </span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                PNG
              </span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                WEBP
              </span>
              <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-lg text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                Max 2MB
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Networking Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Cover Photo */}
        <Card className="p-0 overflow-hidden bg-zinc-900/50 border-zinc-800">
          <div
            className="h-48 bg-zinc-800 relative cursor-pointer group"
            onClick={() => coverInputRef.current?.click()}
          >
            {coverPreview ? (
              <img
                src={
                  coverPreview.startsWith("blob:")
                    ? coverPreview
                    : `${API_URL}${coverPreview}`
                }
                className="w-full h-full object-cover"
                alt="Cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold uppercase tracking-widest text-xs">
                Click to upload cover photo
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white font-black text-xs uppercase tracking-widest">
                Update Cover
              </span>
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleCoverChange}
            />
          </div>

          <div className="px-10 py-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  name="headline"
                  value={formData.headline}
                  onChange={handleChange}
                  placeholder="e.g. Aspiring Data Scientist"
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Current Status
                </label>
                <input
                  type="text"
                  name="current_status"
                  value={formData.current_status}
                  onChange={handleChange}
                  placeholder="e.g. 4th Year Student @ AIUB"
                  className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-10 space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
              Biography
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell the community about your academic journey and goals..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:border-sky-500 outline-none transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Technical Skills
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Python, SQL (comma separated)"
                className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                Interests
              </label>
              <input
                type="text"
                name="open_to"
                value={formData.open_to}
                onChange={handleChange}
                placeholder="Mentorship, Collaboration (comma separated)"
                className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-800 grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                LinkedIn URL
              </label>
              <input
                type="text"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                GitHub URL
              </label>
              <input
                type="text"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full h-12 bg-zinc-950 border border-zinc-800 rounded-xl px-4 text-white focus:border-sky-500 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} className="px-12">
              Save Profile
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
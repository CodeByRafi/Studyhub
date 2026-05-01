"use client";

import { useState, useRef } from "react";
import { API_URL } from "@/services/api";

interface ProfileAvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
  onFileSelect?: (file: File) => void;
  isUploading?: boolean;
  className?: string;
}

const sizeMap = {
  sm: "w-8 h-8 text-xs rounded-lg",
  md: "w-10 h-10 text-sm rounded-xl",
  lg: "w-16 h-16 text-xl rounded-2xl",
  xl: "w-32 h-32 text-4xl rounded-[2rem]",
};

export function ProfileAvatar({
  src,
  name = "S",
  size = "md",
  editable = false,
  onFileSelect,
  isUploading = false,
  className = "",
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const resolvedSrc = src
    ? src.startsWith("http")
      ? src
      : `${API_URL}${src}`
    : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file);
    }
    // Reset input so re-selecting the same file triggers onChange
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/") && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className={`relative group ${className}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (editable) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={editable ? handleDrop : undefined}
    >
      <div
        className={`
          ${sizeMap[size]} bg-zinc-900 border border-zinc-800
          flex items-center justify-center font-black text-sky-500
          overflow-hidden shadow-inner transition-all duration-300
          ${editable ? "cursor-pointer hover:border-sky-500/50" : ""}
          ${dragOver ? "border-sky-500 ring-2 ring-sky-500/30 scale-105" : ""}
        `}
        onClick={editable ? () => inputRef.current?.click() : undefined}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
            <div className="w-6 h-6 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
          </div>
        ) : null}

        {resolvedSrc ? (
          <img
            src={resolvedSrc}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{initials || "S"}</span>
        )}

        {/* Hover overlay */}
        {editable && !isUploading && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 z-10">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[8px] font-black text-white uppercase tracking-widest">
              Change
            </span>
          </div>
        )}
      </div>

      {editable && (
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StudyPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect /study to /study/notes by default
    router.replace("/study/notes");
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

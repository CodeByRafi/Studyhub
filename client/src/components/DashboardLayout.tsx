"use client";

import React from "react";

/**
 * @deprecated Use Next.js route group layouts instead.
 * This component is now a pass-through to avoid double sidebars.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
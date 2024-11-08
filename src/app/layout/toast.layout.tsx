"use client";
import { Toaster } from "react-hot-toast";
import type { ReactNode } from "react";

export function ToastLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}

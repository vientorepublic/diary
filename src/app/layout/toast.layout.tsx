"use client";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export function ToastLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Toaster />
      {children}
    </>
  );
}

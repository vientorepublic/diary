"use client";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode, useEffect } from "react";
import { getCookie } from "cookies-next";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = getCookie("access_token");
  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
  }, [router, token]);
  return children;
}
"use client";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode, useEffect } from "react";
import { getCookie } from "cookies-next";
import { Cookie } from "../constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { name } = Cookie;
  const token = getCookie(name);
  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
  }, [router, token]);
  return children;
}

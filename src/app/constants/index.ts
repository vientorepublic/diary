import type { ICookie } from "../types";
import type { Viewport } from "next";

export const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "diary.viento.me";

export const MetadataConfig = {
  title: "글귀저장소",
  description: "매일 한 줄씩, 차곡차곡",
} as const;

export const ViewportConfig: Viewport = {
  themeColor: "#3b82f6",
};

export const Cookie: ICookie = {
  name: "access_token",
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 24,
  sameSite: "strict",
  path: "/",
} as const;

import AuthLayout from "@/app/layout/auth.layout";
import { ReactNode } from "react";

export default function PrivatePostLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

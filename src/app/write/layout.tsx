import { ReactNode } from "react";
import AuthLayout from "../layout/auth.layout";

export default function WriteLayout({ children }: { children: ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}

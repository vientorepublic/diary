import { ReactNode } from "react";
import AuthLayout from "../layout/auth.layout";
import { ReCaptchaProvider } from "next-recaptcha-v3";

export default function WriteLayout({ children }: { children: ReactNode }) {
  return (
    <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      <AuthLayout>{children}</AuthLayout>
    </ReCaptchaProvider>
  );
}

import { ReCaptchaProvider } from "next-recaptcha-v3";
import { ReactNode } from "react";

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>{children}</ReCaptchaProvider>;
}

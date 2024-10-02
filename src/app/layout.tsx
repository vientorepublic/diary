import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import FooterComponent from "./components/footer.component";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/app/static/css/main.css";
import "@/app/globals.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: "글귀저장소",
  description: "매일 한 줄씩, 차곡차곡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-gray-100">
        {children}
        <FooterComponent />
      </body>
    </html>
  );
}

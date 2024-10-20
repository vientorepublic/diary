import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import { NextDevtoolsProvider } from "@next-devtools/core";
import { Footer } from "./components/footer.component";
import { Navbar } from "./components/navbar.component";
import { ToastLayout } from "./layout/toast.layout";
import { DataLayout } from "./layout/data.layout";
import NextTopLoader from "nextjs-toploader";
import { OpenGraph } from "./constants";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/app/static/css/loader.css";
import "@/app/static/css/main.css";
import "@/app/globals.css";
config.autoAddCss = false;

export const metadata: Metadata = {
  title: OpenGraph.title,
  description: OpenGraph.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-900 text-gray-100">
        <NextDevtoolsProvider>
          <NextTopLoader showSpinner={true} height={2} />
          <DataLayout>
            <ToastLayout>
              <Suspense>
                <Navbar />
                {children}
                <Footer />
              </Suspense>
            </ToastLayout>
          </DataLayout>
        </NextDevtoolsProvider>
      </body>
    </html>
  );
}

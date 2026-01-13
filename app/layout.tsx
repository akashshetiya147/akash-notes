import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { getContent } from "@/lib/data";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AppProvider } from "@/context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Akash Notes",
    template: "%s | Akash Notes"
  },
  description: "A structured notes repository for students. Access organized study materials, PDFs, presentations, and more.",
  keywords: ["notes", "study materials", "education", "PDF", "presentations", "semester", "college"],
  authors: [{ name: "Akash" }],
  creator: "Akash",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Akash Notes",
    title: "Akash Notes",
    description: "A structured notes repository for students",
  },
  twitter: {
    card: "summary_large_image",
    title: "Akash Notes",
    description: "A structured notes repository for students",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = getContent();
  const semesters = Object.keys(content);
  const initialSemester = semesters.length > 0 ? semesters[0] : "";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider initialSemester={initialSemester}>
            <div className="flex h-screen overflow-hidden">
              <Sidebar content={content} />
              <main className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6">
                {children}
              </main>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

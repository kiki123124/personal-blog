import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";
import { MusicProvider } from "@/components/music-context";
import { GlobalMusicPlayer } from "@/components/global-music-player";
import { SmoothScroll } from "@/components/smooth-scroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiki Chen — Designer & Developer",
  description: "Personal site and digital garden. Writing about design, technology, and craft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased min-h-screen flex flex-col font-sans`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <MusicProvider>
            <SmoothScroll>
              {/* Navigation */}
              <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                  <Link
                    href="/"
                    className="text-lg font-semibold tracking-tight hover:text-muted-foreground transition-colors"
                  >
                    Kiki Chen
                  </Link>
                  <div className="flex items-center gap-8 text-sm">
                    <Link href="/blog" className="hover:text-foreground text-muted-foreground transition-colors">
                      Writing
                    </Link>
                    <Link href="/music" className="hover:text-foreground text-muted-foreground transition-colors">
                      Music
                    </Link>
                    <Link href="/admin" className="hover:text-foreground text-muted-foreground transition-colors">
                      Admin
                    </Link>
                  </div>
                </div>
              </nav>

              {/* Main Content */}
              <main className="flex-1 pt-16">
                {children}
              </main>

              {/* Footer */}
              <footer className="border-t border-white/5 py-12 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
                  <p>© {new Date().getFullYear()} Kiki Chen</p>
                  <div className="flex gap-6">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                      GitHub
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                      X
                    </a>
                  </div>
                </div>
              </footer>

              <GlobalMusicPlayer />
            </SmoothScroll>
          </MusicProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

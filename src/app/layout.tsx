import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiki's Space",
  description: "A digital garden for thoughts, stories, and music.",
};

import { SmoothScroll } from "@/components/smooth-scroll";
import PixelBackground from "@/components/pixel-background";

// ... imports

import { PaletteToggle } from "@/components/palette-toggle";
import { NavAvatar } from "@/components/nav-avatar";
import { VisualProvider } from "@/components/visual-context";
import { SpeedControl } from "@/components/speed-control";
import { AdvancedToggle } from "@/components/advanced-toggle";
import { MusicProvider } from "@/components/music-context";
import { GlobalMusicPlayer } from "@/components/global-music-player";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <VisualProvider>
            <MusicProvider>
              <PixelBackground />
              <SmoothScroll>
                <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel">
                  <Link href="/" className="text-xl font-bold tracking-tighter hover:text-primary/80 transition-colors relative group overflow-hidden">
                    <span className="relative z-10 group-hover:animate-pulse group-hover:text-primary transition-colors duration-300">Kiki's Space</span>
                    <span className="absolute top-0 left-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-300 text-primary opacity-70 blur-[2px] mix-blend-screen">Kiki's Space</span>
                    <span className="absolute top-0 left-0 translate-x-full group-hover:translate-x-0 transition-transform duration-500 text-blue-400 opacity-70 blur-[2px] mix-blend-screen delay-75">Kiki's Space</span>
                  </Link>
                  <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <PaletteToggle />
                    <Link href="/blog" className="hover:text-foreground transition-colors">
                      博客
                    </Link>
                    <Link href="/music" className="hover:text-foreground transition-colors">
                      音乐
                    </Link>
                    <Link href="/admin" className="hover:text-foreground transition-colors">
                      管理
                    </Link>
                    <NavAvatar />
                  </div>
                </nav>
                <main className="flex-1 pt-24 px-6 max-w-4xl mx-auto w-full">
                  {children}
                </main>
                <footer className="py-8 text-center text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Kiki's Space. All rights reserved.
                </footer>
              </SmoothScroll>
              <SpeedControl />
              <div className="fixed bottom-6 right-6 z-50">
                <AdvancedToggle />
              </div>
              <GlobalMusicPlayer />
            </MusicProvider>
          </VisualProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

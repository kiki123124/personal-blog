"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Music, BookOpen } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GlitchText } from "@/components/glitch-text";
import { TypewriterText } from "@/components/typewriter-text";
import { PersonalIntro } from "@/components/personal-intro";
import { SocialLinks } from "@/components/social-links";

gsap.registerPlugin(useGSAP);

interface ProfileData {
  skills: string[];
  avatar: string;
  socials?: {
    qq?: string;
    wechat?: string;
    telegram?: string;
    x?: string;
    whatsapp?: string;
    github?: string;
  };
  works?: {
    title: string;
    description: string;
    link: string;
    tech?: string[];
  }[];
}

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  date: string;
}

interface MusicTrack {
  filename: string;
  title?: string;
  artist?: string;
  coverImage?: string;
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [music, setMusic] = useState<MusicTrack[]>([]);
  const [isAvatarGrayscale, setIsAvatarGrayscale] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check localStorage for avatar state
    const hasClickedAvatar = localStorage.getItem('home-avatar-clicked');
    if (hasClickedAvatar === 'true') {
      setIsAvatarGrayscale(false);
    }

    // Fetch Profile
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data));

    // Fetch Latest Posts (limit 3)
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, 3)));

    // Fetch Music (limit 4)
    fetch('/api/music')
      .then(res => res.json())
      .then(data => setMusic(data.slice(0, 4)));
  }, []);

  const handleAvatarClick = () => {
    setIsAvatarGrayscale(false);
    localStorage.setItem('home-avatar-clicked', 'true');
  };

  const skills = profile?.skills || ['✨ 创意设计', '🎵 音乐鉴赏', '📝 写作', '🐱 撸猫高手'];

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Hero Animation
    tl.fromTo(heroRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(".hero-text-reveal",
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
        "-=0.5"
      );

    // Skills Animation - Staggered & Elastic
    tl.fromTo(skillsRef.current?.children || [],
      { opacity: 0, scale: 0, y: 50, rotation: -15 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        stagger: {
          amount: 0.5,
          from: "center"
        },
        ease: "elastic.out(1, 0.5)"
      },
      "-=0.3"
    );

    // Links Animation
    tl.fromTo(linksRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.2"
    );

  }, { scope: containerRef });

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.1,
      rotation: Math.random() * 10 - 5,
      duration: 0.4,
      ease: "back.out(2)",
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
    });
  };

  const handleHoverExit = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotation: 0,
      duration: 0.4,
      ease: "power2.out",
      boxShadow: "none"
    });
  };

  return (
    <div ref={containerRef} className="flex flex-col items-center min-h-screen relative z-10 w-full">

      {/* Hero Section - Full Height */}
      <div className="min-h-screen flex flex-col items-center justify-center w-full space-y-16 py-20">
        <div ref={heroRef} className="space-y-8 flex flex-col items-center opacity-0">
          <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-primary/50 shadow-[0_0_30px_rgba(0,255,128,0.3)] ring-4 ring-primary/20 hero-text-reveal group cursor-pointer" onClick={handleAvatarClick}>
            <div className="absolute inset-0 bg-primary/20 animate-pulse rounded-full blur-xl group-hover:bg-primary/40 transition-colors"></div>
            {profile?.avatar ? (
              <img src={profile.avatar} alt="Avatar" className={`relative z-10 w-full h-full object-cover hover:scale-110 transition-all duration-700 ${isAvatarGrayscale ? 'grayscale hover:grayscale-0' : ''}`} />
            ) : (
              <div className="relative z-10 w-full h-full bg-black flex items-center justify-center text-6xl border-4 border-primary">
                🐰
              </div>
            )}
          </div>

          <div className="space-y-4 overflow-hidden px-4 relative z-20">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground hero-text-reveal drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
              <TypewriterText text="Hi, I'm Kiki" speed={150} />
            </h1>
            <div className="w-full max-w-2xl mx-auto hero-text-reveal bg-background/40 p-6 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
              <PersonalIntro />
            </div>
            <div className="mt-8 hero-text-reveal">
              <SocialLinks socials={profile?.socials} />
            </div>
          </div>
        </div>

        {/* Tech Stack & Works Section */}
        <div ref={skillsRef} className="w-full max-w-4xl px-4 space-y-12">

          {/* Tech Stack */}
          <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-muted-foreground tracking-widest uppercase">Tech Stack</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "React", icon: "⚛️", color: "hover:text-[#61DAFB]" },
                { name: "Next.js", icon: "▲", color: "hover:text-white" },
                { name: "TypeScript", icon: "TS", color: "hover:text-[#3178C6]" },
                { name: "Tailwind", icon: "🌊", color: "hover:text-[#38B2AC]" },
                { name: "Node.js", icon: "🟢", color: "hover:text-[#339933]" },
                { name: "Three.js", icon: "🧊", color: "hover:text-white" }
              ].map((tech) => (
                <div
                  key={tech.name}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-black/40 dark:bg-white/5 border border-primary/20 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-black/60 dark:hover:bg-white/10 cursor-default group ${tech.color}`}
                >
                  <span className="text-3xl filter drop-shadow-lg group-hover:animate-bounce">{tech.icon}</span>
                  <span className="text-xs font-mono font-bold opacity-70 group-hover:opacity-100">{tech.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Works */}
          <div className="space-y-6 text-center">
            <h3 className="text-xl font-bold text-muted-foreground tracking-widest uppercase">My Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile?.works || [
                { title: "Cyber Blog", description: "A futuristic blog platform", link: "#" },
                { title: "Music Player", description: "Vinyl style music visualizer", link: "/music" },
                { title: "AI Chat", description: "Intelligent conversation agent", link: "#" },
                { title: "Portfolio", description: "Personal showcase site", "link": "#" }
              ]).map((project) => (
                <Link
                  key={project.title}
                  href={project.link}
                  className="group relative p-6 rounded-xl bg-black/40 dark:bg-white/5 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden backdrop-blur-md"
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                    </div>
                    <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div ref={linksRef} className="absolute bottom-10 animate-bounce cursor-pointer" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
          <ArrowRight className="rotate-90 text-primary w-8 h-8 drop-shadow-[0_0_10px_rgba(0,255,128,0.8)]" />
        </div>
      </div>

      {/* Content Previews Section */}
      <div className="w-full max-w-6xl px-6 py-20 space-y-32">

        {/* Blog Preview */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tighter text-foreground drop-shadow-lg flex items-center gap-4">
              <BookOpen className="text-primary" /> 最新博客
            </h2>
            <Link href="/blog" className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors bg-background/40 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/20">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                  <div className="h-64 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 overflow-hidden relative transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(0,255,128,0.15)]">
                    {post.coverImage && (
                      <img src={post.coverImage} alt={post.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10"></div>
                    <div className="absolute bottom-0 left-0 p-6 z-20 space-y-2">
                      <span className="text-primary text-xs font-mono border border-primary/30 px-2 py-1 rounded-full bg-primary/10 backdrop-blur-sm">LATEST</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <p className="text-gray-300 text-sm line-clamp-2">{post.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center text-muted-foreground py-10">暂无文章，快去发布一篇吧！</div>
            )}
          </div>
        </section>

        {/* Music Preview */}
        <section className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-bold tracking-tighter text-foreground drop-shadow-lg flex items-center gap-4">
              <Music className="text-primary" /> 最近常听
            </h2>
            <Link href="/music" className="text-primary hover:text-primary/80 flex items-center gap-2 transition-colors bg-background/40 px-4 py-2 rounded-full backdrop-blur-sm border border-primary/20">
              前往音乐库 <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {music.length > 0 ? (
              music.map((track) => (
                <Link key={track.filename} href="/music" className="group block">
                  <div className="aspect-square rounded-xl bg-background/40 backdrop-blur-md border border-white/10 overflow-hidden relative transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,255,128,0.2)]">
                    {track.coverImage ? (
                      <img src={track.coverImage} alt={track.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center text-black">
                        <Music size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <h4 className="font-bold text-foreground truncate">{track.title || track.filename}</h4>
                    <p className="text-xs text-muted-foreground truncate">{track.artist || 'Unknown'}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center text-muted-foreground py-10">暂无音乐</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

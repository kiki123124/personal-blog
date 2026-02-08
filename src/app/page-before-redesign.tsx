"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Circle } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getStaticUrl } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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

  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data));

    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data.slice(0, 6)));

    fetch('/api/music')
      .then(res => res.json())
      .then(data => setMusic(data.slice(0, 4)));

    // Magnetic effect for buttons
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });

      document.querySelectorAll('.magnetic').forEach((elem) => {
        const rect = elem.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;
        const distance = Math.sqrt(distX * distX + distY * distY);

        if (distance < 100) {
          const strength = (100 - distance) / 100;
          gsap.to(elem, {
            x: distX * strength * 0.3,
            y: distY * strength * 0.3,
            duration: 0.3,
            ease: "power2.out"
          });
        } else {
          gsap.to(elem, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useGSAP(() => {
    // Entrance animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(heroRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.4 }
    )
      .fromTo(".stagger-in",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
        "-=0.9"
      );

    // Parallax effect for sections
    gsap.utils.toArray("section").forEach((section: any) => {
      const elements = section.querySelectorAll(".parallax-item");

      gsap.fromTo(elements,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="w-full bg-stone-50 dark:bg-neutral-950 min-h-screen">

      {/* Hero Section - Subtle Background */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 relative overflow-hidden">
        {/* Very Subtle Spotlight - No Aurora */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(245, 158, 11, 0.03)"
        />

        <div ref={heroRef} className="max-w-7xl w-full opacity-0 relative z-10">

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* Left: Avatar with subtle 3D effect */}
            <div className="lg:col-span-5 stagger-in">
              <CardContainer className="inter-var">
                <CardBody className="relative">
                  <div className="absolute -top-8 -left-8 w-24 h-24 border-t-4 border-l-4 border-amber-500 z-20" />

                  <CardItem translateZ="30" className="w-full">
                    <div className="aspect-square overflow-hidden bg-neutral-900 dark:bg-neutral-100 relative group">
                      {profile?.avatar ? (
                        <img
                          src={getStaticUrl(profile.avatar)}
                          alt="Kiki Chen"
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-9xl font-black text-stone-50 dark:text-neutral-900">
                          K
                        </div>
                      )}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500 translate-x-4 translate-y-4" />
                    </div>
                  </CardItem>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-px bg-neutral-900 dark:bg-neutral-100" />
                    <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                      Designer & Developer
                    </p>
                  </div>
                </CardBody>
              </CardContainer>
            </div>

            {/* Right: Text with subtle generate effect */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-8">
              <div className="space-y-4 lg:space-y-6 stagger-in">
                <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-neutral-50">
                  Kiki<br/>Chen
                </h1>

                <div className="w-20 h-1 bg-amber-500" />

                <TextGenerateEffect
                  words="Crafting thoughtful digital experiences where form meets function, precision meets creativity."
                  className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed font-light"
                  duration={0.5}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 lg:gap-8 stagger-in pt-6 lg:pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50">5+</p>
                  <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Years</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50">{posts.length}</p>
                  <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Articles</p>
                </div>
                <div>
                  <p className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50">{profile?.works?.length || 3}</p>
                  <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Projects</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 stagger-in">
                <HoverBorderGradient
                  containerClassName="magnetic"
                  as="a"
                  href="/blog"
                  className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 font-semibold flex items-center justify-center space-x-2 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base"
                >
                  <span>Read Writing</span>
                  <ArrowUpRight className="w-4 h-4" />
                </HoverBorderGradient>

                <Link
                  href="/music"
                  className="magnetic group px-6 lg:px-8 py-3 lg:py-4 border-2 border-neutral-900 dark:border-neutral-50 text-neutral-900 dark:text-neutral-50 font-semibold hover:bg-neutral-900 hover:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 transition-all inline-flex items-center justify-center text-sm lg:text-base"
                >
                  <span className="flex items-center gap-2">
                    Music Library
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {profile?.socials && (
                <div className="flex flex-wrap gap-4 lg:gap-6 text-xs lg:text-sm stagger-in">
                  {profile.socials.github && (
                    <a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-transparent hover:border-current pb-1"
                    >
                      GitHub
                    </a>
                  )}
                  {profile.socials.x && (
                    <a
                      href={`https://x.com/${profile.socials.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-transparent hover:border-current pb-1"
                    >
                      X / Twitter
                    </a>
                  )}
                  {profile.socials.telegram && (
                    <a
                      href={`https://t.me/${profile.socials.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors border-b border-transparent hover:border-current pb-1"
                    >
                      Telegram
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Selected Works - Clean List (No Images) */}
      <section className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 border-t-2 border-neutral-900 dark:border-neutral-50">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-12 lg:mb-20 parallax-item">
            <div>
              <p className="text-xs lg:text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
                Selected Projects
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Recent Work
              </h2>
            </div>
            <div className="hidden md:block w-32 h-px bg-amber-500" />
          </div>

          <div className="space-y-0 border-t border-neutral-200 dark:border-neutral-800">
            {(profile?.works || [
              { title: "Editorial Blog System", description: "Content-first publishing platform with advanced typography", link: "#", tech: ["Next.js", "TypeScript"] },
              { title: "Audio Visualization", description: "Real-time frequency analysis with Web Audio API", link: "/music", tech: ["Three.js", "Web Audio"] },
              { title: "Portfolio Archive", description: "Minimal case study showcase with smooth transitions", link: "#", tech: ["React", "Framer"] }
            ]).map((project, index) => (
              <Link
                key={project.title}
                href={project.link}
                className="group block py-8 lg:py-12 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors px-4 lg:px-8 parallax-item"
              >
                <div className="grid md:grid-cols-12 gap-4 lg:gap-8 items-center">
                  <div className="md:col-span-1">
                    <span className="text-5xl lg:text-6xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-amber-500 transition-colors">
                      0{index + 1}
                    </span>
                  </div>
                  <div className="md:col-span-7">
                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 lg:mb-3 group-hover:translate-x-2 transition-transform">
                      {project.title}
                    </h3>
                    <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
                      {project.description}
                    </p>
                  </div>
                  <div className="md:col-span-3 flex gap-2 flex-wrap">
                    {project.tech?.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 lg:px-3 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <ArrowUpRight className="w-5 lg:w-6 h-5 lg:h-6 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Writing - Bento Grid with Images */}
      <section className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12 lg:mb-20">
            <p className="text-xs lg:text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
              Latest Thoughts
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Writing
              </h2>
              <Link
                href="/blog"
                className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                View All
                <ArrowUpRight className="w-3 lg:w-4 h-3 lg:h-4" />
              </Link>
            </div>
          </div>

          {posts.length > 0 ? (
            <BentoGrid className="parallax-item">
              {posts.slice(0, 4).map((post, index) => (
                <BentoGridItem
                  key={post.slug}
                  title={
                    <Link href={`/blog/${post.slug}`} className="group flex items-start justify-between">
                      <span className="group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </span>
                      <ArrowUpRight className="w-4 lg:w-5 h-4 lg:h-5 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all ml-2 flex-shrink-0" />
                    </Link>
                  }
                  description={
                    <div className="space-y-2 lg:space-y-3">
                      <time className="text-xs text-neutral-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                        {post.excerpt}
                      </p>
                    </div>
                  }
                  header={
                    post.coverImage ? (
                      <div className="w-full h-32 lg:h-40 bg-neutral-900 dark:bg-neutral-100 overflow-hidden border-b-2 border-neutral-900 dark:border-neutral-50">
                        <img
                          src={getStaticUrl(post.coverImage)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover/bento:scale-105 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 lg:h-40 bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center border-b-2 border-neutral-900 dark:border-neutral-50">
                        <span className="text-4xl lg:text-6xl font-black text-neutral-200 dark:text-neutral-800">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    )
                  }
                  className={
                    index === 0
                      ? "md:col-span-2 bg-stone-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-50 hover:border-amber-500 dark:hover:border-amber-500"
                      : "bg-stone-50 dark:bg-neutral-950 border-2 border-neutral-900 dark:border-neutral-50 hover:border-amber-500 dark:hover:border-amber-500"
                  }
                />
              ))}
            </BentoGrid>
          ) : (
            <div className="text-center text-neutral-500 py-20">
              No posts yet
            </div>
          )}
        </div>
      </section>

      {/* Music - Grid with subtle 3D Cards */}
      <section className="py-20 lg:py-32 px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-7xl mx-auto relative z-10">

          <div className="mb-12 lg:mb-20">
            <p className="text-xs lg:text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
              Current Rotation
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
              Music
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
            {music.length > 0 ? (
              music.map((track) => (
                <CardContainer key={track.filename} className="inter-var">
                  <CardBody className="group">
                    <Link href="/music" className="block">
                      <CardItem translateZ="30" className="w-full mb-3 lg:mb-4">
                        <div className="aspect-square bg-neutral-900 dark:bg-neutral-100 overflow-hidden relative border-2 border-neutral-900 dark:border-neutral-50">
                          {track.coverImage ? (
                            <img
                              src={getStaticUrl(track.coverImage)}
                              alt={track.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Circle className="w-8 lg:w-12 h-8 lg:h-12 text-neutral-700 dark:text-neutral-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </div>
                      </CardItem>
                      <CardItem translateZ="20">
                        <h4 className="font-semibold text-xs lg:text-sm text-neutral-900 dark:text-neutral-50 mb-1 truncate">
                          {track.title || track.filename}
                        </h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                          {track.artist || 'Unknown'}
                        </p>
                      </CardItem>
                    </Link>
                  </CardBody>
                </CardContainer>
              ))
            ) : (
              <div className="col-span-4 text-center text-neutral-500 py-20">
                No music yet
              </div>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}

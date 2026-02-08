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
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

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
      .then(data => setPosts(data.slice(0, 3)));

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

    // Scroll snap effect - snap to sections
    ScrollTrigger.create({
      snap: {
        snapTo: 1 / 3, // Snap to each section (3 main sections)
        duration: { min: 0.2, max: 0.8 },
        ease: "power2.inOut"
      }
    });

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

      {/* Hero Section - Editorial Style with Spotlight */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 relative overflow-hidden">
        {/* Aceternity Spotlight Effect - 黑白配色 */}
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="rgba(245, 158, 11, 0.1)" // amber with low opacity
        />
        <BackgroundBeams className="opacity-20" />

        <div ref={heroRef} className="max-w-7xl w-full opacity-0 relative z-10">

          <div className="grid md:grid-cols-12 gap-12 items-center">

            {/* Left: Avatar with 3D effect */}
            <div className="md:col-span-5 stagger-in">
              <CardContainer className="inter-var">
                <CardBody className="relative">
                  {/* Decorative element */}
                  <div className="absolute -top-8 -left-8 w-24 h-24 border-t-4 border-l-4 border-amber-500 z-20" />

                  <CardItem translateZ="100" className="w-full">
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

                      {/* Accent corner */}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500 translate-x-4 translate-y-4" />
                    </div>
                  </CardItem>

                  {/* Caption */}
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-px bg-neutral-900 dark:bg-neutral-100" />
                    <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                      Designer & Developer
                    </p>
                  </div>
                </CardBody>
              </CardContainer>
            </div>

            {/* Right: Text with Generate Effect */}
            <div className="md:col-span-7 space-y-10">
              <div className="space-y-6 stagger-in">
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-neutral-50">
                  Kiki<br/>Chen
                </h1>

                <div className="w-20 h-1 bg-amber-500" />

                <TextGenerateEffect
                  words="Crafting thoughtful digital experiences where form meets function, precision meets creativity."
                  className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed font-light"
                />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 stagger-in pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">5+</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Years</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{posts.length}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Articles</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">{profile?.works?.length || 3}</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">Projects</p>
                </div>
              </div>

              {/* CTA with Moving Border */}
              <div className="flex gap-4 stagger-in">
                <HoverBorderGradient
                  containerClassName="magnetic"
                  as="a"
                  href="/blog"
                  className="bg-neutral-900 dark:bg-neutral-50 text-neutral-50 dark:text-neutral-900 font-semibold flex items-center space-x-2"
                >
                  <span>Read Writing</span>
                  <ArrowUpRight className="w-4 h-4" />
                </HoverBorderGradient>

                <Link
                  href="/music"
                  className="magnetic group px-8 py-4 border-2 border-neutral-900 dark:border-neutral-50 text-neutral-900 dark:text-neutral-50 font-semibold hover:bg-neutral-900 hover:text-neutral-50 dark:hover:bg-neutral-50 dark:hover:text-neutral-900 transition-all inline-block"
                >
                  <span className="flex items-center gap-2">
                    Music Library
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Link>
              </div>

              {/* Social */}
              {profile?.socials && (
                <div className="flex gap-6 text-sm stagger-in">
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

      {/* Selected Works - List Style with 3D Cards */}
      <section className="py-32 px-6 md:px-12 border-t-2 border-neutral-900 dark:border-neutral-50">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-20 parallax-item">
            <div>
              <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
                Selected Projects
              </p>
              <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Recent Work
              </h2>
            </div>
            <div className="hidden md:block w-32 h-px bg-amber-500" />
          </div>

          <div className="space-y-0 border-t border-neutral-200 dark:border-neutral-800">
            {(profile?.works || [
              { title: "Editorial Blog System", description: "Content-first publishing platform", link: "#", tech: ["Next.js", "TypeScript"] },
              { title: "Audio Visualization", description: "Real-time frequency analysis", link: "/music", tech: ["Three.js", "Web Audio"] },
              { title: "Portfolio Archive", description: "Minimal case study showcase", link: "#", tech: ["React", "Framer"] }
            ]).map((project, index) => (
              <CardContainer key={project.title} className="inter-var w-full">
                <CardBody className="w-full">
                  <Link
                    href={project.link}
                    className="group block py-12 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors px-8 parallax-item"
                  >
                    <CardItem translateZ="50" className="w-full">
                      <div className="grid md:grid-cols-12 gap-8 items-center">
                        <div className="md:col-span-1">
                          <span className="text-6xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-amber-500 transition-colors">
                            0{index + 1}
                          </span>
                        </div>
                        <div className="md:col-span-7">
                          <h3 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-3 group-hover:translate-x-2 transition-transform">
                            {project.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400">
                            {project.description}
                          </p>
                        </div>
                        <div className="md:col-span-3 flex gap-2">
                          {project.tech?.map((tech) => (
                            <span
                              key={tech}
                              className="text-xs px-3 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div className="md:col-span-1 flex justify-end">
                          <ArrowUpRight className="w-6 h-6 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                        </div>
                      </div>
                    </CardItem>
                  </Link>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Writing - Grid with 3D Cards */}
      <section className="py-32 px-6 md:px-12 bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">

          <div className="mb-20">
            <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
              Latest Thoughts
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Writing
              </h2>
              <Link
                href="/blog"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors"
              >
                View All
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <CardContainer key={post.slug} className="inter-var">
                  <CardBody className="group">
                    <Link href={`/blog/${post.slug}`} className="block">
                      {post.coverImage && (
                        <CardItem translateZ="100" className="w-full mb-6">
                          <div className="aspect-[4/5] overflow-hidden bg-neutral-900 dark:bg-neutral-100 relative">
                            <img
                              src={getStaticUrl(post.coverImage)}
                              alt={post.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 w-12 h-12 bg-amber-500 flex items-center justify-center text-xs font-bold">
                              {String(index + 1).padStart(2, '0')}
                            </div>
                          </div>
                        </CardItem>
                      )}
                      <CardItem translateZ="50" className="space-y-3">
                        <time className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-500">
                          {new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                          {post.excerpt}
                        </p>
                      </CardItem>
                    </Link>
                  </CardBody>
                </CardContainer>
              ))
            ) : (
              <div className="col-span-3 text-center text-neutral-500 py-20">
                No posts yet
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Music - Minimal with 3D Cards */}
      <section className="py-32 px-6 md:px-12 relative">
        <div className="max-w-7xl mx-auto relative z-10">

          <div className="mb-20">
            <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400 mb-4">
              Current Rotation
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-neutral-900 dark:text-neutral-50">
              Music
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {music.length > 0 ? (
              music.map((track) => (
                <CardContainer key={track.filename} className="inter-var">
                  <CardBody className="group">
                    <Link href="/music" className="block">
                      <CardItem translateZ="100" className="w-full mb-4">
                        <div className="aspect-square bg-neutral-900 dark:bg-neutral-100 overflow-hidden relative">
                          {track.coverImage ? (
                            <img
                              src={getStaticUrl(track.coverImage)}
                              alt={track.title}
                              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Circle className="w-12 h-12 text-neutral-700 dark:text-neutral-300" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-20 transition-opacity" />
                        </div>
                      </CardItem>
                      <CardItem translateZ="50">
                        <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1 truncate">
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

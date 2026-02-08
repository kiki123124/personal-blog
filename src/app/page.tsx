"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Circle, Mouse } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, useInView } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getStaticUrl } from "@/lib/utils";

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

// 🎨 Micro-interaction: Counter Animation Component
function AnimatedCounter({ value, label }: { value: number | string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView && typeof value === 'number') {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref}>
      <motion.p
        className="text-3xl lg:text-4xl font-black text-neutral-900 dark:text-neutral-50 tabular-nums"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {typeof value === 'number' ? count : value}
      </motion.p>
      <p className="text-xs lg:text-sm text-neutral-600 dark:text-neutral-400 mt-1">{label}</p>
    </div>
  );
}

// 🎨 Micro-interaction: Magnetic Image Component (Swiss Design inspired)
function MagneticImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.05);
    y.set((e.clientY - centerY) * 0.05);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={ref}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative Swiss grid corner */}
      <motion.div
        className="absolute -top-8 -left-8 w-24 h-24 border-t-4 border-l-4 border-amber-500 z-20"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      />

      <motion.div
        style={{ x: springX, y: springY }}
        className="aspect-square overflow-hidden bg-neutral-900 dark:bg-neutral-100 relative group"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />

        {/* Subtle overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-amber-500/0"
          whileHover={{
            background: "linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0))"
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Accent corner */}
        <motion.div
          className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500"
          initial={{ x: 0, y: 0 }}
          animate={{ x: 16, y: 16 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        />
      </motion.div>

      {/* Caption with reveal animation */}
      <motion.div
        className="mt-8 flex items-center gap-4 overflow-hidden"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7 }}
      >
        <motion.div
          className="h-px bg-neutral-900 dark:bg-neutral-100"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        />
        <p className="text-sm uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
          Designer & Developer
        </p>
      </motion.div>
    </div>
  );
}

// 🎨 Micro-interaction: Liquid Button Component
function LiquidButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        className="relative px-6 lg:px-8 py-3 lg:py-4 overflow-hidden cursor-pointer group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Border */}
        <div className="absolute inset-0 border-2 border-neutral-900 dark:border-neutral-50" />

        {/* Liquid fill */}
        <motion.div
          className="absolute inset-0 bg-neutral-900 dark:bg-neutral-50"
          initial={{ x: "-100%", skewX: -15 }}
          animate={{
            x: isHovered ? "0%" : "-100%",
            skewX: isHovered ? 0 : -15
          }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        />

        {/* Text */}
        <span className="relative z-10 flex items-center gap-2 font-semibold text-sm lg:text-base">
          <motion.span
            animate={{
              color: isHovered ? "rgb(250, 250, 250)" : "rgb(23, 23, 23)"
            }}
            className="dark:text-neutral-50"
          >
            {children}
          </motion.span>
          <motion.div
            animate={{
              x: isHovered ? 4 : 0,
              y: isHovered ? -4 : 0,
              color: isHovered ? "rgb(250, 250, 250)" : "rgb(23, 23, 23)"
            }}
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.div>
        </span>
      </motion.div>
    </Link>
  );
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [music, setMusic] = useState<MusicTrack[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

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

    // Scroll progress indicator
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="w-full bg-stone-50 dark:bg-neutral-950 min-h-screen relative">

      {/* 🎨 Scroll Progress Indicator - Swiss Design */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-amber-500 z-50 origin-left"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-20 relative overflow-hidden">

        {/* Subtle grid background - Swiss Design inspired */}
        <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '100px 100px' }}
        />

        <div className="max-w-7xl w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left: Avatar with Magnetic Effect */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile?.avatar ? (
                <MagneticImage
                  src={getStaticUrl(profile.avatar)}
                  alt="Kiki Chen"
                />
              ) : (
                <MagneticImage
                  src="/placeholder.jpg"
                  alt="K"
                />
              )}
            </motion.div>

            {/* Right: Text with Staggered Animation */}
            <div className="lg:col-span-7 space-y-8 lg:space-y-10">

              {/* Name with character stagger */}
              <motion.div
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
                }}
              >
                <div className="overflow-hidden">
                  <motion.h1
                    className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-neutral-50"
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Kiki<br/>Chen
                  </motion.h1>
                </div>

                <motion.div
                  className="h-1 bg-amber-500 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: 80 }}
                />

                <motion.p
                  className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed font-light"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  Crafting thoughtful digital experiences where form meets function, precision meets creativity.
                </motion.p>
              </motion.div>

              {/* Stats with Counter Animation */}
              <motion.div
                className="grid grid-cols-3 gap-6 lg:gap-8 pt-8 border-t border-neutral-200 dark:border-neutral-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <AnimatedCounter value="5+" label="Years" />
                <AnimatedCounter value={posts.length} label="Articles" />
                <AnimatedCounter value={profile?.works?.length || 3} label="Projects" />
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <LiquidButton href="/blog">Read Writing</LiquidButton>

                <Link
                  href="/music"
                  className="group px-6 lg:px-8 py-3 lg:py-4 border-2 border-neutral-900 dark:border-neutral-50 text-neutral-900 dark:text-neutral-50 font-semibold hover:bg-amber-500 hover:border-amber-500 transition-all inline-flex items-center justify-center text-sm lg:text-base"
                >
                  <span className="flex items-center gap-2">
                    Music Library
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>

              {/* Social Links */}
              {profile?.socials && (
                <motion.div
                  className="flex flex-wrap gap-6 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  {profile.socials.github && (
                    <motion.a
                      href={`https://github.com/${profile.socials.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative group"
                      whileHover={{ y: -2 }}
                    >
                      GitHub
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  )}
                  {profile.socials.x && (
                    <motion.a
                      href={`https://x.com/${profile.socials.x}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative group"
                      whileHover={{ y: -2 }}
                    >
                      X / Twitter
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  )}
                  {profile.socials.telegram && (
                    <motion.a
                      href={`https://t.me/${profile.socials.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors relative group"
                      whileHover={{ y: -2 }}
                    >
                      Telegram
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300" />
                    </motion.a>
                  )}
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Selected Works - Clean List */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-20 border-t-2 border-neutral-900 dark:border-neutral-50">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="flex items-end justify-between mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-xs lg:text-sm uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 mb-4">
                Selected Projects
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Recent Work
              </h2>
            </div>
            <motion.div
              className="hidden md:block h-px bg-amber-500"
              initial={{ width: 0 }}
              whileInView={{ width: 128 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          </motion.div>

          <div className="space-y-0 border-t border-neutral-200 dark:border-neutral-800">
            {(profile?.works || [
              { title: "Editorial Blog System", description: "Content-first publishing platform", link: "#", tech: ["Next.js", "TypeScript"] },
              { title: "Audio Visualization", description: "Real-time frequency analysis", link: "/music", tech: ["Three.js", "Web Audio"] },
              { title: "Portfolio Archive", description: "Minimal case study showcase", link: "#", tech: ["React", "Framer"] }
            ]).map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link
                  href={project.link}
                  className="group block py-8 lg:py-12 border-b border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors px-4 lg:px-8"
                >
                  <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-center">
                    <div className="md:col-span-1">
                      <motion.span
                        className="text-5xl lg:text-6xl font-black text-neutral-200 dark:text-neutral-800 group-hover:text-amber-500 transition-colors tabular-nums"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        0{index + 1}
                      </motion.span>
                    </div>
                    <div className="md:col-span-7">
                      <motion.h3
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 8 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {project.title}
                      </motion.h3>
                      <p className="text-sm lg:text-base text-neutral-600 dark:text-neutral-400">
                        {project.description}
                      </p>
                    </div>
                    <div className="md:col-span-3 flex gap-2 flex-wrap">
                      {project.tech?.map((tech) => (
                        <motion.span
                          key={tech}
                          className="text-xs px-2 lg:px-3 py-1 border border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400"
                          whileHover={{
                            borderColor: "rgb(245, 158, 11)",
                            color: "rgb(245, 158, 11)",
                            scale: 1.05
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                    <div className="md:col-span-1 flex justify-end">
                      <motion.div
                        whileHover={{ x: 4, y: -4 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <ArrowUpRight className="w-6 h-6 text-neutral-400 group-hover:text-amber-500 transition-colors" />
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Writing - Grid with Images */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-20 bg-neutral-100 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs lg:text-sm uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 mb-4">
              Latest Thoughts
            </p>
            <div className="flex items-end justify-between">
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
                Writing
              </h2>
              <Link
                href="/blog"
                className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 transition-colors group"
              >
                View All
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block"
                  >
                    {post.coverImage && (
                      <motion.div
                        className="aspect-[4/5] bg-neutral-900 dark:bg-neutral-100 overflow-hidden mb-6 border-2 border-neutral-900 dark:border-neutral-50 relative"
                        whileHover={{ scale: 1.02, borderColor: "rgb(245, 158, 11)" }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <img
                          src={getStaticUrl(post.coverImage)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <motion.div
                          className="absolute top-4 right-4 w-12 h-12 bg-amber-500 flex items-center justify-center text-xs font-bold"
                          initial={{ rotate: 0 }}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </motion.div>
                      </motion.div>
                    )}
                    <div className="space-y-3">
                      <time className="text-xs uppercase tracking-wider text-neutral-500">
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <h3 className="text-xl lg:text-2xl font-bold text-neutral-900 dark:text-neutral-50 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-neutral-500 py-20">
              No posts yet
            </div>
          )}
        </div>
      </section>

      {/* Music - Grid */}
      <section className="py-24 lg:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">

          <motion.div
            className="mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs lg:text-sm uppercase tracking-[0.3em] text-neutral-600 dark:text-neutral-400 mb-4">
              Current Rotation
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-neutral-900 dark:text-neutral-50">
              Music
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {music.length > 0 ? (
              music.map((track, index) => (
                <motion.div
                  key={track.filename}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Link href="/music" className="group block">
                    <motion.div
                      className="aspect-square bg-neutral-900 dark:bg-neutral-100 overflow-hidden relative border-2 border-neutral-900 dark:border-neutral-50 mb-4"
                      whileHover={{
                        scale: 1.05,
                        rotate: 2,
                        borderColor: "rgb(245, 158, 11)"
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {track.coverImage ? (
                        <img
                          src={getStaticUrl(track.coverImage)}
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Circle className="w-12 h-12 text-neutral-700 dark:text-neutral-300" />
                        </div>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-amber-500"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.2 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-neutral-50 mb-1 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {track.title || track.filename}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {track.artist || 'Unknown'}
                    </p>
                  </Link>
                </motion.div>
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

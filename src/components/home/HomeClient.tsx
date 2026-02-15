"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Circle } from "lucide-react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { getStaticUrl } from "@/lib/utils";

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

interface ProfileData {
  skills: string[];
  avatar: string;
  socials?: {
    github?: string;
    telegram?: string;
    x?: string;
  };
  works?: {
    title: string;
    description: string;
    link: string;
    tech?: string[];
  }[];
}

interface HomeClientProps {
  posts: Post[];
  music: MusicTrack[];
  profile: ProfileData | null;
}

// Animated Counter Component
function AnimatedCounter({ value, label }: { value: number | string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useState(() => {
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
  });

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

// Magnetic Image Component with decorative frames
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
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
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
    </div>
  );
}

export function HomeClient({ posts, music, profile }: HomeClientProps) {
  return (
    <div className="w-full bg-stone-50 dark:bg-neutral-950 min-h-screen relative">

      {/* Hero Section - simplified for server rendering */}
      <section className="min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-20 py-20 relative overflow-hidden">
        <div className="max-w-7xl w-full relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Avatar */}
            <motion.div
              className="lg:col-span-5"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              {profile?.avatar && (
                <MagneticImage
                  src={getStaticUrl(profile.avatar)}
                  alt="Kiki Luo"
                />
              )}
            </motion.div>

            {/* Content */}
            <div className="lg:col-span-7 space-y-8">
              <motion.h1
                className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-neutral-900 dark:text-neutral-50"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Kiki<br />Luo
              </motion.h1>

              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-neutral-600 dark:text-neutral-400 max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                04年生，爱阅读，有点文艺。喜欢把生活里细碎的感受写下来，用文字留住那些转瞬即逝的时刻。
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8 border-t border-neutral-200 dark:border-neutral-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <AnimatedCounter value={new Date().getFullYear() - 2004} label="岁" />
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
                <Link
                  href="/blog"
                  className="px-6 lg:px-8 py-3 lg:py-4 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-black font-semibold hover:bg-amber-500 transition-colors inline-flex items-center justify-center"
                >
                  Read Writing
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
                <Link
                  href="/music"
                  className="px-6 lg:px-8 py-3 lg:py-4 border-2 border-neutral-900 dark:border-neutral-50 text-neutral-900 dark:text-neutral-50 font-semibold hover:bg-amber-500 hover:border-amber-500 transition-all inline-flex items-center justify-center"
                >
                  Music Library
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Preview */}
      <section className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12">Latest Writing</h2>
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.slice(0, 3).map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                  {post.coverImage && (
                    <div className="aspect-[4/5] bg-neutral-900 dark:bg-neutral-100 overflow-hidden mb-4 relative">
                      <Image
                        src={getStaticUrl(post.coverImage)}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-amber-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {post.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">No posts yet</p>
          )}
        </div>
      </section>

      {/* Music Preview */}
      <section className="py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black mb-12">Music</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                        <Image
                          src={getStaticUrl(track.coverImage)}
                          alt={track.title || track.filename}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
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
              <p className="text-neutral-500 col-span-4">No music yet</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

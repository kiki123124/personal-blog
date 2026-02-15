"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Circle } from "lucide-react";
import { motion, useInView } from "framer-motion";
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
                <div className="aspect-square overflow-hidden bg-neutral-900 dark:bg-neutral-100 relative">
                  <Image
                    src={getStaticUrl(profile.avatar)}
                    alt="Kiki Luo"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </div>
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
              music.map((track) => (
                <Link key={track.filename} href="/music" className="group">
                  <div className="aspect-square bg-neutral-900 dark:bg-neutral-100 overflow-hidden mb-4 relative">
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
                  </div>
                  <h4 className="font-semibold text-sm truncate">
                    {track.title || track.filename}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                    {track.artist || 'Unknown'}
                  </p>
                </Link>
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

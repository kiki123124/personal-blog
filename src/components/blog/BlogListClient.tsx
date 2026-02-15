"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { PostData } from "@/lib/posts";
import { getStaticUrl } from "@/lib/utils";

interface BlogListClientProps {
  posts: PostData[];
}

export function BlogListClient({ posts }: BlogListClientProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-20 py-12">
      <header className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold tracking-tight"
        >
          Writing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-muted-foreground max-w-2xl"
        >
          Thoughts on design, technology, and the craft of building digital products.
        </motion.p>
      </header>

      <div className="space-y-16">
        {posts.length === 0 ? (
          <div className="text-muted-foreground">No posts yet.</div>
        ) : (
          posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="space-y-4">
                  {post.coverImage && (
                    <div className="aspect-[21/9] w-full overflow-hidden rounded-xl bg-muted relative">
                      <Image
                        src={getStaticUrl(post.coverImage)}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                      />
                    </div>
                  )}
                  <div className="space-y-3">
                    <time className="text-xs font-mono text-muted-foreground">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <h2 className="text-3xl font-bold tracking-tight group-hover:text-muted-foreground transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="pt-2">
                      <span className="text-sm font-medium group-hover:underline underline-offset-4">
                        Read article →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostData } from '@/lib/posts';

export default function BlogPage() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="space-y-12">
            <header className="space-y-2">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-4xl font-bold tracking-tight text-foreground"
                >
                    博客文章
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground"
                >
                    记录生活，分享技术，还有一些碎碎念。
                </motion.p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {loading ? (
                    <div className="text-muted-foreground col-span-full">加载中...</div>
                ) : posts.length === 0 ? (
                    <div className="text-muted-foreground col-span-full">暂无文章。</div>
                ) : (
                    posts.map((post, index) => (
                        <motion.div
                            key={post.slug}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/blog/${post.slug}`}>
                                <div className="group h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                                    {post.coverImage && (
                                        <div className="h-48 w-full overflow-hidden">
                                            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                        </div>
                                    )}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h2 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                        </div>
                                        <p className="text-muted-foreground line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded w-fit">
                                            {new Date(post.date).toLocaleDateString('zh-CN')}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

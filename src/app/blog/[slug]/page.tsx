import { getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = getPostData(decodedSlug);

    return (
        <article className="max-w-3xl mx-auto pb-20">
            <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
                <ArrowLeft size={16} />
                Back to Blog
            </Link>

            <div className="bg-black/60 dark:bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-2xl border border-white/10 shadow-2xl">
                <header className="space-y-6 mb-10 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-balance text-foreground">
                        {post.title}
                    </h1>
                    <time className="block text-muted-foreground font-mono text-sm">
                        {new Date(post.date).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </time>
                </header>

                <div className="prose prose-invert prose-zinc max-w-none">
                    {/* We'll use a simple div for now, but normally you'd use a markdown renderer */}
                    <div className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-gray-300 dark:text-gray-200">
                        {post.content}
                    </div>
                </div>
            </div>
        </article>
    );
}

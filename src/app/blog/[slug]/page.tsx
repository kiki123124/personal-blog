import { getPostData, getSortedPostsData } from '@/lib/posts';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';

// Generate static params for all posts
export async function generateStaticParams() {
    const posts = await getSortedPostsData();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

// Generate metadata for each post (SEO)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    try {
        const post = await getPostData(decodedSlug);
        const baseUrl = 'https://kiki-luo.com'; // 替换为你的实际域名

        return {
            title: `${post.title} | Kiki Luo`,
            description: post.excerpt || post.content.slice(0, 160),
            authors: [{ name: 'Kiki Luo' }],
            keywords: [post.title, 'blog', 'writing', 'Kiki Luo'],
            openGraph: {
                title: post.title,
                description: post.excerpt || post.content.slice(0, 160),
                type: 'article',
                publishedTime: post.date,
                authors: ['Kiki Luo'],
                images: post.coverImage
                    ? [
                          {
                              url: `${baseUrl}/api/static/uploads/${post.coverImage}`,
                              width: 1200,
                              height: 630,
                              alt: post.title,
                          },
                      ]
                    : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: post.excerpt || post.content.slice(0, 160),
                images: post.coverImage ? [`${baseUrl}/api/static/uploads/${post.coverImage}`] : [],
            },
        };
    } catch {
        return {
            title: 'Post Not Found | Kiki Luo',
            description: 'The requested post could not be found.',
        };
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);
    const post = await getPostData(decodedSlug);

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

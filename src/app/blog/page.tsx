import { getSortedPostsData } from '@/lib/posts';
import { BlogListClient } from '@/components/blog/BlogListClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing | Kiki Luo',
  description: 'Thoughts on design, technology, and the craft of building digital products.',
  openGraph: {
    title: 'Writing | Kiki Luo',
    description: 'Thoughts on design, technology, and the craft of building digital products.',
  },
};

// Server Component - 数据在服务端获取
export default async function BlogPage() {
  const posts = await getSortedPostsData();

  return <BlogListClient posts={posts} />;
}

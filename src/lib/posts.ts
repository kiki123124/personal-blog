import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    content: string;
    coverImage?: string;
}

export async function getSortedPostsData(): Promise<PostData[]> {
    await fs.mkdir(postsDirectory, { recursive: true });
    const fileNames = await fs.readdir(postsDirectory);
    const allPostsData = await Promise.all(fileNames.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        return {
            slug,
            ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage?: string }),
            content: matterResult.content,
        } as PostData;
    }));
    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    return {
        slug,
        ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage?: string }),
        content: matterResult.content,
    } as PostData;
}

export async function createPost(data: PostData) {
    await fs.mkdir(postsDirectory, { recursive: true });
    const fullPath = path.join(postsDirectory, `${data.slug}.md`);
    const fileContent = matter.stringify(data.content, {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        coverImage: data.coverImage
    });
    await fs.writeFile(fullPath, fileContent);
}

export async function deletePost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    await fs.unlink(fullPath).catch(() => {});
}

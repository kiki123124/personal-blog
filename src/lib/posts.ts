import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

/**
 * 验证并清理 slug，防止路径遍历攻击
 * 只允许字母、数字、连字符和下划线
 */
function sanitizeSlug(slug: string): string {
    // 移除任何路径分隔符和特殊字符
    const sanitized = slug.replace(/[^a-zA-Z0-9\-_]/g, '');

    if (!sanitized || sanitized !== slug) {
        throw new Error('Invalid slug: Only alphanumeric characters, hyphens, and underscores are allowed');
    }

    return sanitized;
}

/**
 * 验证路径是否在允许的目录内
 */
function validatePath(targetPath: string, baseDir: string): void {
    const resolvedPath = path.resolve(targetPath);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedPath.startsWith(resolvedBase)) {
        throw new Error('Invalid path: Path traversal attempt detected');
    }
}

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
    const sanitized = sanitizeSlug(slug);
    const fullPath = path.join(postsDirectory, `${sanitized}.md`);
    validatePath(fullPath, postsDirectory);

    const fileContents = await fs.readFile(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    return {
        slug: sanitized,
        ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage?: string }),
        content: matterResult.content,
    } as PostData;
}

export async function createPost(data: PostData) {
    const sanitized = sanitizeSlug(data.slug);
    await fs.mkdir(postsDirectory, { recursive: true });
    const fullPath = path.join(postsDirectory, `${sanitized}.md`);
    validatePath(fullPath, postsDirectory);

    const fileContent = matter.stringify(data.content, {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        coverImage: data.coverImage
    });
    await fs.writeFile(fullPath, fileContent);
}

export async function deletePost(slug: string) {
    const sanitized = sanitizeSlug(slug);
    const fullPath = path.join(postsDirectory, `${sanitized}.md`);
    validatePath(fullPath, postsDirectory);

    await fs.unlink(fullPath).catch(() => {});
}

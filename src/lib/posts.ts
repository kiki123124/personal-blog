import fs from 'fs';
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

export function getSortedPostsData(): PostData[] {
    // Create directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);

        return {
            slug,
            ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage?: string }),
            content: matterResult.content,
        } as PostData;
    });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostData(slug: string): PostData {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        slug,
        ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage?: string }),
        content: matterResult.content,
    } as PostData;
}

export function createPost(data: PostData) {
    if (!fs.existsSync(postsDirectory)) {
        fs.mkdirSync(postsDirectory, { recursive: true });
    }
    const fullPath = path.join(postsDirectory, `${data.slug}.md`);
    const fileContent = matter.stringify(data.content, {
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        coverImage: data.coverImage
    });
    fs.writeFileSync(fullPath, fileContent);
}

export function deletePost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
    }
}

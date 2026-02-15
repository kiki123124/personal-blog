import { getSortedPostsData } from '@/lib/posts';
import fs from 'fs/promises';
import path from 'path';
import { HomeClient } from '@/components/home/HomeClient';

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

interface MusicTrack {
  filename: string;
  title?: string;
  artist?: string;
  coverImage?: string;
}

// Server Component - 数据在服务端获取
export default async function Home() {
  // 获取博客文章数据
  const allPosts = await getSortedPostsData();
  const posts = allPosts.slice(0, 6);

  // 获取个人资料数据
  let profile: ProfileData | null = null;
  try {
    const profilePath = path.join(process.cwd(), 'src/content/profile.json');
    const profileContent = await fs.readFile(profilePath, 'utf8');
    profile = JSON.parse(profileContent);
  } catch (error) {
    console.error('Error loading profile:', error);
  }

  // 获取音乐数据
  let music: MusicTrack[] = [];
  try {
    const musicDir = path.join(process.cwd(), 'public/music');
    await fs.mkdir(musicDir, { recursive: true });
    const files = await fs.readdir(musicDir);

    music = files
      .filter((file) => file.endsWith('.mp3'))
      .map((filename) => ({
        filename,
        title: filename.replace(/^\d+_/, '').replace(/\.mp3$/, '').replace(/_/g, ' '),
        artist: 'Unknown',
      }))
      .slice(0, 4);
  } catch (error) {
    console.error('Error loading music:', error);
  }

  // 将数据传递给客户端组件
  return <HomeClient posts={posts} music={music} profile={profile} />;
}

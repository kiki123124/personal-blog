import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFile = path.join(process.cwd(), 'src/content/profile.json');

interface ProfileData {
    avatar?: string;
    skills?: string[];
    socials?: {
        qq?: string;
        wechat?: string;
        telegram?: string;
        x?: string;
        whatsapp?: string;
        github?: string;
    };
    works?: {
        title: string;
        description: string;
        imageUrl: string;
        link: string;
    }[];
}

async function getProfileData(): Promise<ProfileData> {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return { skills: ['✨ 创意设计', '🎵 音乐鉴赏', '📝 写作', '🐱 撸猫高手'] };
    }
}

async function saveProfileData(data: ProfileData) {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function GET() {
    const data = await getProfileData();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const avatarFile = formData.get('avatar') as File | null;
        const skills = formData.get('skills') as string | null;

        const currentData = await getProfileData();
        const newData: ProfileData = { ...currentData };

        if (avatarFile) {
            const buffer = Buffer.from(await avatarFile.arrayBuffer());
            const filename = 'avatar_' + Date.now() + '_' + avatarFile.name.replace(/\s/g, '_');
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(path.join(uploadDir, filename), buffer);
            newData.avatar = `/uploads/${filename}`;
        }

        if (skills) newData.skills = JSON.parse(skills);

        const socials = formData.get('socials') as string | null;
        if (socials) newData.socials = JSON.parse(socials);

        const works = formData.get('works') as string | null;
        if (works) newData.works = JSON.parse(works);

        await saveProfileData(newData);
        return NextResponse.json({ Message: "Success", data: newData, status: 200 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ Message: "Failed", status: 500 });
    }
}

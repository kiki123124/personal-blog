import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const musicDirectory = path.join(process.cwd(), 'public/music');
const dataFile = path.join(process.cwd(), 'src/content/music-data.json');

interface MusicTrack {
    filename: string;
    title: string;
    artist: string;
    coverImage?: string;
}

async function getMusicData(): Promise<MusicTrack[]> {
    try {
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveMusicData(data: MusicTrack[]) {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function GET() {
    const tracks = await getMusicData();
    return NextResponse.json(tracks);
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('audio') as File;
        const cover = formData.get('cover') as File | null;
        const title = formData.get('title') as string;
        const artist = formData.get('artist') as string;

        if (!file) {
            return NextResponse.json({ error: "No music file received." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');

        await fs.mkdir(musicDirectory, { recursive: true });
        await fs.writeFile(path.join(musicDirectory, filename), buffer);

        let coverPath = '';
        if (cover) {
            const coverBuffer = Buffer.from(await cover.arrayBuffer());
            const coverFilename = 'cover_' + Date.now() + '_' + cover.name.replace(/\s/g, '_');
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            await fs.mkdir(uploadDir, { recursive: true });
            await fs.writeFile(path.join(uploadDir, coverFilename), coverBuffer);
            coverPath = `/uploads/${coverFilename}`;
        }

        const tracks = await getMusicData();
        tracks.push({
            filename,
            title: title || file.name.replace(/\.[^/.]+$/, ""),
            artist: artist || 'Unknown Artist',
            coverImage: coverPath
        });
        await saveMusicData(tracks);

        return NextResponse.json({ Message: "Success", status: 201 });
    } catch (error) {
        console.log("Error occured ", error);
        return NextResponse.json({ message: 'Error uploading file' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filename = searchParams.get('filename');

        if (!filename) {
            return NextResponse.json({ message: 'Filename is required' }, { status: 400 });
        }

        const musicData = await getMusicData();
        const track = musicData.find(t => t.filename === filename);

        if (track) {
            const audioPath = path.join(process.cwd(), 'public/music', track.filename);
            await fs.unlink(audioPath).catch(() => {});

            if (track.coverImage && track.coverImage.startsWith('/uploads/')) {
                const coverPath = path.join(process.cwd(), 'public', track.coverImage);
                await fs.unlink(coverPath).catch(() => {});
            }
        }

        const newData = musicData.filter(t => t.filename !== filename);
        await saveMusicData(newData);

        return NextResponse.json({ message: 'Track deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting track' }, { status: 500 });
    }
}

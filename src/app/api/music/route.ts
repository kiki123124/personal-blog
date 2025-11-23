import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

const musicDirectory = path.join(process.cwd(), 'public/music');
const dataFile = path.join(process.cwd(), 'src/content/music-data.json');

interface MusicTrack {
    filename: string;
    title: string;
    artist: string;
    coverImage?: string;
}

function getMusicData(): MusicTrack[] {
    if (!fs.existsSync(dataFile)) {
        return [];
    }
    const data = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(data);
}

function saveMusicData(data: MusicTrack[]) {
    if (!fs.existsSync(path.dirname(dataFile))) {
        fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    }
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

export async function GET() {
    const tracks = getMusicData();
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

        // Save Music File
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '_' + file.name.replace(/\s/g, '_');

        if (!fs.existsSync(musicDirectory)) {
            fs.mkdirSync(musicDirectory, { recursive: true });
        }
        await writeFile(path.join(musicDirectory, filename), buffer);

        // Save Cover Image (if exists)
        let coverPath = '';
        if (cover) {
            const coverBuffer = Buffer.from(await cover.arrayBuffer());
            const coverFilename = 'cover_' + Date.now() + '_' + cover.name.replace(/\s/g, '_');
            const uploadDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            await writeFile(path.join(uploadDir, coverFilename), coverBuffer);
            coverPath = `/uploads/${coverFilename}`;
        }

        // Update Metadata
        const tracks = getMusicData();
        tracks.push({
            filename,
            title: title || file.name.replace(/\.[^/.]+$/, ""),
            artist: artist || 'Unknown Artist',
            coverImage: coverPath
        });
        saveMusicData(tracks);

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

        const musicData = getMusicData();
        const track = musicData.find(t => t.filename === filename);

        if (track) {
            // Remove audio file
            const audioPath = path.join(process.cwd(), 'public/music', track.filename);
            if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);

            // Remove cover image if it exists and is not used by others (simplified: just delete if in uploads)
            if (track.coverImage && track.coverImage.startsWith('/uploads/')) {
                const coverPath = path.join(process.cwd(), 'public', track.coverImage);
                if (fs.existsSync(coverPath)) fs.unlinkSync(coverPath);
            }
        }

        const newData = musicData.filter(t => t.filename !== filename);
        saveMusicData(newData);

        return NextResponse.json({ message: 'Track deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting track' }, { status: 500 });
    }
}

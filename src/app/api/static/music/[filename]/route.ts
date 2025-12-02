import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const filePath = path.join(process.cwd(), 'public/music', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Music file not found', { status: 404 });
        }

        // Read file
        const fileBuffer = fs.readFileSync(filePath);

        // Determine content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'audio/mpeg'; // default

        if (ext === '.mp3') contentType = 'audio/mpeg';
        else if (ext === '.wav') contentType = 'audio/wav';
        else if (ext === '.ogg') contentType = 'audio/ogg';
        else if (ext === '.m4a') contentType = 'audio/mp4';

        // Return file with proper headers for audio streaming
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving music file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

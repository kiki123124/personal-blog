import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const filePath = path.join(process.cwd(), 'public/uploads', filename);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return new NextResponse('Image not found', { status: 404 });
        }

        // Read file
        const fileBuffer = fs.readFileSync(filePath);

        // Determine content type based on file extension
        const ext = path.extname(filename).toLowerCase();
        let contentType = 'image/jpeg'; // default

        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.gif') contentType = 'image/gif';
        else if (ext === '.webp') contentType = 'image/webp';
        else if (ext === '.svg') contentType = 'image/svg+xml';

        // Return file with proper headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving upload file:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

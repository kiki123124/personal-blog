import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 验证文件名，防止路径遍历
 */
function sanitizeFilename(filename: string): string {
    // 移除路径分隔符和特殊字符，只保留文件名部分
    const basename = path.basename(filename);

    // 验证文件名格式（只允许字母、数字、连字符、下划线和点）
    if (!/^[a-zA-Z0-9\-_\.]+$/.test(basename)) {
        throw new Error('Invalid filename format');
    }

    return basename;
}

/**
 * 验证路径是否在允许的目录内
 */
function validatePath(targetPath: string, baseDir: string): void {
    const resolvedPath = path.resolve(targetPath);
    const resolvedBase = path.resolve(baseDir);

    if (!resolvedPath.startsWith(resolvedBase)) {
        throw new Error('Path traversal attempt detected');
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;
        const sanitized = sanitizeFilename(filename);

        const baseDir = path.join(process.cwd(), 'public/music');
        const filePath = path.join(baseDir, sanitized);

        // 验证路径安全性
        validatePath(filePath, baseDir);

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

import { NextResponse } from 'next/server';
import { getSortedPostsData, createPost, deletePost, PostData } from '@/lib/posts';

export async function GET() {
    const posts = getSortedPostsData();
    return NextResponse.json(posts);
}

export async function POST(request: Request) {
    try {
        const data: PostData = await request.json();
        createPost(data);
        return NextResponse.json({ message: 'Post created successfully' }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ message: 'Slug is required' }, { status: 400 });
        }

        deletePost(slug);
        return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
    }
}

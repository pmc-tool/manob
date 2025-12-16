// Blog Tags API Route
import { NextResponse } from 'next/server';
import { mockBlogPosts } from '@/lib/mocks/blog.mock';

export async function GET() {
  try {
    // Extract unique tags from all posts
    const allTags = new Set<string>();
    mockBlogPosts.forEach((post) => {
      post.tags.split(',').forEach((t) => {
        const trimmed = t.trim();
        if (trimmed) allTags.add(trimmed);
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Tags fetched successfully',
      data: Array.from(allTags),
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch tags',
        data: [],
      },
      { status: 500 }
    );
  }
}

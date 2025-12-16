// Blog List API Route
import { NextRequest, NextResponse } from 'next/server';
import {
  mockBlogPosts,
  mockBlogTags,
  filterBlogsByTag,
  searchBlogs,
  BlogPost,
} from '@/lib/mocks/blog.mock';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);
    const tag = searchParams.get('tag') || '';
    const search = searchParams.get('search') || '';

    let posts: BlogPost[] = [...mockBlogPosts];

    // Apply tag filter
    if (tag) {
      posts = filterBlogsByTag(posts, tag);
    }

    // Apply search filter
    if (search) {
      posts = searchBlogs(posts, search);
    }

    // Calculate pagination
    const totalCount = posts.length;
    const totalPages = Math.ceil(totalCount / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPosts = posts.slice(startIndex, endIndex);

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
      message: 'Blog posts fetched successfully',
      data: {
        items: paginatedPosts,
        pagination: {
          total_count: totalCount,
          total_pages: totalPages,
          current_page: page,
          per_page: limit,
        },
        tags: Array.from(allTags),
      },
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch blog posts',
        data: null,
      },
      { status: 500 }
    );
  }
}

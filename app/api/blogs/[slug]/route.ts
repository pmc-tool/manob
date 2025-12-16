// Single Blog API Route
import { NextRequest, NextResponse } from 'next/server';
import { getBlogBySlug } from '@/lib/mocks/blog.mock';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Slug is required',
          data: null,
        },
        { status: 400 }
      );
    }

    const post = getBlogBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          message: 'Blog post not found',
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post fetched successfully',
      data: post,
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch blog post',
        data: null,
      },
      { status: 500 }
    );
  }
}

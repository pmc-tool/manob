// Blog API Service
// Fetches blog data from PMC/manob.ai external API

const API_URL_CORE = process.env.NEXT_PUBLIC_API_URL_CORE || 'https://api.packmycode.com/core/v1';
const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || 'https://ds.packmycode.com';

// Types matching the real API response
export interface ApiBlogAuthor {
  id?: string;
  first_name: string;
  last_name: string;
  user_name?: string;
  email?: string;
  profile_image: string;
  join_as?: string;
  country?: string;
  city?: string;
  zone?: string;
  member_since?: string;
}

export interface ApiBlogPost {
  id: string;
  title: string;
  slug: string;
  blog_type?: string;
  short_description: string;
  description?: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
  user_meta: ApiBlogAuthor;
  tags: string;
  status?: string;
  category_id?: string;
  category_title?: string;
  total_views?: number;
  total_likes?: number;
  total_dislikes?: number;
}

export interface ApiBlogResponse {
  status: boolean;
  statusCode: number;
  message: string;
  path: string;
  data: {
    items: ApiBlogPost[];
    pagination?: {
      total_count: number;
      total_pages: number;
      current_page: number;
      per_page: number;
    };
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiBlogDetailResponse {
  status: boolean;
  statusCode: number;
  message: string;
  data: ApiBlogPost;
}

// Mapped types for frontend use
export interface BlogAuthor {
  first_name: string;
  last_name: string;
  user_name: string;
  profile_image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
  user_meta: BlogAuthor;
  tags: string;
  view_count?: number;
  category_title?: string;
}

export interface BlogPagination {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

export interface BlogListResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
  tags: string[];
}

// Helper to get full image URL
function getImageUrl(path: string): string {
  if (!path) return '/images/placeholder-blog.jpg';
  if (path.startsWith('http') || path.startsWith('/')) return path;
  return `${S3_BUCKET}/${path}`;
}

// Map API response to frontend format
function mapBlogPost(post: ApiBlogPost): BlogPost {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    short_description: post.short_description || '',
    description: post.description || '',
    cover_image: getImageUrl(post.cover_image),
    created_at: post.created_at,
    updated_at: post.updated_at,
    user_meta: {
      first_name: post.user_meta?.first_name || 'Anonymous',
      last_name: post.user_meta?.last_name || '',
      user_name: post.user_meta?.user_name || '',
      profile_image: getImageUrl(post.user_meta?.profile_image || ''),
    },
    tags: post.tags || '',
    view_count: post.total_views,
    category_title: post.category_title,
  };
}

// Fetch blog posts list from external API
export async function fetchBlogPosts(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  search?: string;
}): Promise<BlogListResponse> {
  const { page = 1, limit = 12, tag, search } = params || {};

  const queryParams = new URLSearchParams();
  queryParams.set('page', String(page));
  queryParams.set('limit', String(limit));
  if (tag) queryParams.set('tag', tag);
  if (search) queryParams.set('search', search);

  try {
    const response = await fetch(`${API_URL_CORE}/public/blogs?${queryParams.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blogs: ${response.status}`);
    }

    const json: ApiBlogResponse = await response.json();

    if (!json.status) {
      throw new Error(json.message || 'Failed to fetch blogs');
    }

    const items = json.data?.items || [];
    const total = json.data?.pagination?.total_count || json.data?.total || items.length;
    const totalPages = json.data?.pagination?.total_pages || Math.ceil(total / limit);

    // Extract unique tags from posts
    const tagSet = new Set<string>();
    items.forEach((post) => {
      if (post.tags) {
        post.tags.split(',').forEach((t) => {
          const trimmed = t.trim().replace(/^#/, ''); // Remove # prefix if present
          if (trimmed) tagSet.add(trimmed);
        });
      }
    });

    return {
      posts: items.map(mapBlogPost),
      pagination: {
        total_count: total,
        total_pages: totalPages,
        current_page: page,
        per_page: limit,
      },
      tags: Array.from(tagSet),
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: [],
      pagination: {
        total_count: 0,
        total_pages: 1,
        current_page: 1,
        per_page: limit,
      },
      tags: [],
    };
  }
}

// Fetch single blog post by slug
export async function fetchBlogBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_URL_CORE}/public/blogs/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch blog: ${response.status}`);
    }

    const json: ApiBlogDetailResponse = await response.json();

    if (!json.status || !json.data) {
      return null;
    }

    return mapBlogPost(json.data);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Fetch related posts (posts with similar tags, excluding current)
export async function fetchRelatedPosts(
  currentId: string,
  tags: string,
  limit: number = 4
): Promise<BlogPost[]> {
  try {
    const tagArray = tags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean);
    const tag = tagArray[0] || '';

    const queryParams = new URLSearchParams();
    queryParams.set('limit', String(limit + 1));
    if (tag) queryParams.set('tag', tag);

    const response = await fetch(`${API_URL_CORE}/public/blogs?${queryParams.toString()}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const json: ApiBlogResponse = await response.json();

    if (!json.status) {
      return [];
    }

    return (json.data?.items || [])
      .filter((post) => post.id !== currentId)
      .slice(0, limit)
      .map(mapBlogPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Fetch all blog slugs for static generation
export async function fetchAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${API_URL_CORE}/public/blogs?limit=100`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const json: ApiBlogResponse = await response.json();

    if (!json.status) {
      return [];
    }

    return (json.data?.items || []).map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

// Helper function to format date
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Fetch available tags
export async function fetchBlogTags(): Promise<string[]> {
  try {
    // Get tags from blog posts since there's no dedicated tags endpoint
    const response = await fetchBlogPosts({ limit: 50 });
    return response.tags;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    return [];
  }
}

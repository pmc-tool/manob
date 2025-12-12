// CONTRACT: GET /home/featured-services, GET /home/trending-services, GET /services
// This mock data structure matches the exact API response from PackMyCode

export interface ServiceCreator {
  id: string;
  full_name: string;
  user_name: string;
  email: string;
  profile_image: string;
  is_online: boolean;
  level: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string;
  price: number;
  mrp?: number;
  avg_rating: number;
  total_reviews: number;
  total_sales: number;
  global_ranking: number;
  genre_ranking: number;
  is_liked: boolean;
  is_featured: boolean;
  is_onsale?: boolean;
  is_trending?: boolean;
  is_pixi_compatible?: boolean;
  creator: ServiceCreator;
  category?: string;
  category_id?: string;
}

// MOCK: Sample creator data
const mockServiceCreator1: ServiceCreator = {
  id: 'svc-creator-1',
  full_name: 'Alex Thompson',
  user_name: 'alexthompson',
  email: 'alex@example.com',
  profile_image: 'https://ui-avatars.com/api/?name=Alex+Thompson&background=random',
  is_online: true,
  level: 'Top Rated',
};

const mockServiceCreator2: ServiceCreator = {
  id: 'svc-creator-2',
  full_name: 'Emma Wilson',
  user_name: 'emmawilson',
  email: 'emma@example.com',
  profile_image: 'https://ui-avatars.com/api/?name=Emma+Wilson&background=random',
  is_online: false,
  level: 'Pro',
};

const mockServiceCreator3: ServiceCreator = {
  id: 'svc-creator-3',
  full_name: 'David Chen',
  user_name: 'davidchen',
  email: 'david@example.com',
  profile_image: 'https://ui-avatars.com/api/?name=David+Chen&background=random',
  is_online: true,
  level: 'Rising Star',
};

// MOCK: Featured services data
export const mockFeaturedServices: Service[] = [
  {
    id: 'svc-1',
    title: 'I will build a responsive React website with modern design',
    slug: 'build-responsive-react-website',
    thumbnail_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    price: 150,
    mrp: 200,
    avg_rating: 4.9,
    total_reviews: 234,
    total_sales: 567,
    global_ranking: 5,
    genre_ranking: 2,
    is_liked: false,
    is_featured: true,
    is_onsale: true,
    is_pixi_compatible: true,
    creator: mockServiceCreator1,
    category: 'Web Development',
    category_id: 'web-dev',
  },
  {
    id: 'svc-2',
    title: 'Professional logo design with unlimited revisions',
    slug: 'professional-logo-design',
    thumbnail_image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=300&fit=crop',
    price: 75,
    avg_rating: 4.8,
    total_reviews: 189,
    total_sales: 423,
    global_ranking: 8,
    genre_ranking: 3,
    is_liked: true,
    is_featured: true,
    creator: mockServiceCreator2,
    category: 'Graphic Design',
    category_id: 'graphic-design',
  },
  {
    id: 'svc-3',
    title: 'Full-stack mobile app development with React Native',
    slug: 'mobile-app-react-native',
    thumbnail_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    price: 500,
    mrp: 650,
    avg_rating: 4.9,
    total_reviews: 89,
    total_sales: 145,
    global_ranking: 3,
    genre_ranking: 1,
    is_liked: false,
    is_featured: true,
    is_onsale: true,
    is_pixi_compatible: true,
    creator: mockServiceCreator3,
    category: 'Mobile Development',
    category_id: 'mobile-dev',
  },
  {
    id: 'svc-4',
    title: 'SEO optimization and digital marketing strategy',
    slug: 'seo-digital-marketing',
    thumbnail_image: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop',
    price: 200,
    avg_rating: 4.7,
    total_reviews: 156,
    total_sales: 312,
    global_ranking: 12,
    genre_ranking: 4,
    is_liked: false,
    is_featured: true,
    creator: mockServiceCreator1,
    category: 'Digital Marketing',
    category_id: 'digital-marketing',
  },
  {
    id: 'svc-5',
    title: 'Professional video editing and motion graphics',
    slug: 'video-editing-motion-graphics',
    thumbnail_image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop',
    price: 100,
    avg_rating: 4.8,
    total_reviews: 267,
    total_sales: 534,
    global_ranking: 7,
    genre_ranking: 2,
    is_liked: true,
    is_featured: true,
    creator: mockServiceCreator2,
    category: 'Video & Animation',
    category_id: 'video-animation',
  },
  {
    id: 'svc-6',
    title: 'Custom WordPress theme development',
    slug: 'wordpress-theme-development',
    thumbnail_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    price: 250,
    avg_rating: 4.6,
    total_reviews: 123,
    total_sales: 278,
    global_ranking: 15,
    genre_ranking: 5,
    is_liked: false,
    is_featured: true,
    creator: mockServiceCreator3,
    category: 'Web Development',
    category_id: 'web-dev',
  },
];

// MOCK: Trending services data
export const mockTrendingServices: Service[] = [
  {
    id: 'svc-trend-1',
    title: 'AI-powered chatbot integration for your business',
    slug: 'ai-chatbot-integration',
    thumbnail_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    price: 300,
    avg_rating: 4.9,
    total_reviews: 45,
    total_sales: 89,
    global_ranking: 1,
    genre_ranking: 1,
    is_liked: false,
    is_featured: false,
    is_trending: true,
    is_pixi_compatible: true,
    creator: mockServiceCreator1,
    category: 'AI Services',
    category_id: 'ai-services',
  },
  {
    id: 'svc-trend-2',
    title: 'Social media management and content creation',
    slug: 'social-media-management',
    thumbnail_image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
    price: 120,
    mrp: 150,
    avg_rating: 4.8,
    total_reviews: 178,
    total_sales: 389,
    global_ranking: 4,
    genre_ranking: 1,
    is_liked: true,
    is_featured: false,
    is_onsale: true,
    is_trending: true,
    creator: mockServiceCreator2,
    category: 'Social Media',
    category_id: 'social-media',
  },
  {
    id: 'svc-trend-3',
    title: 'E-commerce store setup with Shopify',
    slug: 'shopify-store-setup',
    thumbnail_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    price: 350,
    avg_rating: 4.7,
    total_reviews: 92,
    total_sales: 156,
    global_ranking: 6,
    genre_ranking: 2,
    is_liked: false,
    is_featured: false,
    is_trending: true,
    creator: mockServiceCreator3,
    category: 'E-commerce',
    category_id: 'ecommerce',
  },
  {
    id: 'svc-trend-4',
    title: 'Professional copywriting for websites and ads',
    slug: 'professional-copywriting',
    thumbnail_image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop',
    price: 80,
    avg_rating: 4.9,
    total_reviews: 234,
    total_sales: 567,
    global_ranking: 2,
    genre_ranking: 1,
    is_liked: false,
    is_featured: false,
    is_trending: true,
    creator: mockServiceCreator1,
    category: 'Writing',
    category_id: 'writing',
  },
];

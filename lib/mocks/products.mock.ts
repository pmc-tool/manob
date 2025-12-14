// CONTRACT: GET /home/featured-products, GET /home/trending-products, GET /products
// This mock data structure matches the exact API response from manob.ai

export interface ProductCreator {
  id: string;
  email: string;
  full_name: string;
  is_online: boolean;
  level: string;
  profile_image: string;
  user_name: string;
  first_name?: string;
  last_name?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  thumbnail_image: string;
  price: number;
  mrp?: number; // Original price for discount calculation
  avg_rating: number;
  total_reviews: number;
  total_sales: number;
  creator: ProductCreator;
  genre_ranking: number;
  global_ranking: number;
  is_featured: boolean;
  is_wishlist: boolean;
  is_liked: boolean;
  is_onsale?: boolean;
  is_trending?: boolean;
  is_pixi_compatible?: boolean;
}

// MOCK: Sample product data
const mockCreator: ProductCreator = {
  id: 'creator-1',
  email: 'john@example.com',
  full_name: 'John Developer',
  is_online: true,
  level: 'Pro',
  profile_image: 'https://ui-avatars.com/api/?name=John+Developer&background=random',
  user_name: 'johndev',
  first_name: 'John',
  last_name: 'Developer',
};

const mockCreator2: ProductCreator = {
  id: 'creator-2',
  email: 'sarah@example.com',
  full_name: 'Sarah Designer',
  is_online: false,
  level: 'Expert',
  profile_image: 'https://ui-avatars.com/api/?name=Sarah+Designer&background=random',
  user_name: 'sarahdesign',
  first_name: 'Sarah',
  last_name: 'Designer',
};

const mockCreator3: ProductCreator = {
  id: 'creator-3',
  email: 'mike@example.com',
  full_name: 'Mike Builder',
  is_online: true,
  level: 'Rising',
  profile_image: 'https://ui-avatars.com/api/?name=Mike+Builder&background=random',
  user_name: 'mikebuilder',
  first_name: 'Mike',
  last_name: 'Builder',
};

export const mockFeaturedProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'Modern SaaS Dashboard Template',
    slug: 'modern-saas-dashboard-template',
    thumbnail_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    price: 49,
    mrp: 79,
    avg_rating: 4.8,
    total_reviews: 124,
    total_sales: 856,
    creator: mockCreator,
    genre_ranking: 1,
    global_ranking: 5,
    is_featured: true,
    is_wishlist: false,
    is_liked: false,
    is_onsale: true,
    is_pixi_compatible: true,
  },
  {
    id: 'prod-2',
    title: 'E-commerce Starter Kit with React',
    slug: 'ecommerce-starter-kit-react',
    thumbnail_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    price: 79,
    avg_rating: 4.9,
    total_reviews: 89,
    total_sales: 542,
    creator: mockCreator2,
    genre_ranking: 2,
    global_ranking: 8,
    is_featured: true,
    is_wishlist: true,
    is_liked: true,
    is_trending: true,
  },
  {
    id: 'prod-3',
    title: 'AI-Powered Chat Application',
    slug: 'ai-powered-chat-application',
    thumbnail_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop',
    price: 129,
    mrp: 199,
    avg_rating: 4.7,
    total_reviews: 67,
    total_sales: 234,
    creator: mockCreator3,
    genre_ranking: 3,
    global_ranking: 12,
    is_featured: true,
    is_wishlist: false,
    is_liked: false,
    is_onsale: true,
    is_pixi_compatible: true,
  },
  {
    id: 'prod-4',
    title: 'Mobile App UI Kit - Premium',
    slug: 'mobile-app-ui-kit-premium',
    thumbnail_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
    price: 59,
    avg_rating: 4.6,
    total_reviews: 156,
    total_sales: 1023,
    creator: mockCreator,
    genre_ranking: 4,
    global_ranking: 3,
    is_featured: true,
    is_wishlist: false,
    is_liked: true,
  },
  {
    id: 'prod-5',
    title: 'WordPress Theme - Business Pro',
    slug: 'wordpress-theme-business-pro',
    thumbnail_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
    price: 39,
    avg_rating: 4.5,
    total_reviews: 203,
    total_sales: 1567,
    creator: mockCreator2,
    genre_ranking: 5,
    global_ranking: 2,
    is_featured: true,
    is_wishlist: true,
    is_liked: false,
    is_trending: true,
  },
  {
    id: 'prod-6',
    title: 'Node.js API Boilerplate',
    slug: 'nodejs-api-boilerplate',
    thumbnail_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=300&fit=crop',
    price: 29,
    avg_rating: 4.4,
    total_reviews: 78,
    total_sales: 432,
    creator: mockCreator3,
    genre_ranking: 6,
    global_ranking: 18,
    is_featured: true,
    is_wishlist: false,
    is_liked: false,
  },
];

export const mockTrendingProducts: Product[] = [
  {
    id: 'trend-1',
    title: 'Next.js 14 Full-Stack Template',
    slug: 'nextjs-14-fullstack-template',
    thumbnail_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
    price: 89,
    avg_rating: 4.9,
    total_reviews: 45,
    total_sales: 189,
    creator: mockCreator,
    genre_ranking: 1,
    global_ranking: 1,
    is_featured: false,
    is_wishlist: false,
    is_liked: false,
    is_trending: true,
    is_pixi_compatible: true,
  },
  {
    id: 'trend-2',
    title: 'Tailwind CSS Component Library',
    slug: 'tailwind-css-component-library',
    thumbnail_image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=300&fit=crop',
    price: 49,
    mrp: 69,
    avg_rating: 4.8,
    total_reviews: 112,
    total_sales: 678,
    creator: mockCreator2,
    genre_ranking: 2,
    global_ranking: 4,
    is_featured: false,
    is_wishlist: true,
    is_liked: true,
    is_onsale: true,
    is_trending: true,
  },
  {
    id: 'trend-3',
    title: 'React Native Starter App',
    slug: 'react-native-starter-app',
    thumbnail_image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    price: 99,
    avg_rating: 4.7,
    total_reviews: 34,
    total_sales: 145,
    creator: mockCreator3,
    genre_ranking: 3,
    global_ranking: 7,
    is_featured: false,
    is_wishlist: false,
    is_liked: false,
    is_trending: true,
  },
  {
    id: 'trend-4',
    title: 'Vue.js Admin Dashboard',
    slug: 'vuejs-admin-dashboard',
    thumbnail_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    price: 69,
    avg_rating: 4.6,
    total_reviews: 89,
    total_sales: 423,
    creator: mockCreator,
    genre_ranking: 4,
    global_ranking: 9,
    is_featured: false,
    is_wishlist: false,
    is_liked: true,
    is_trending: true,
  },
];

// CONTRACT: GET /search/suggestions response structure
export interface SearchSuggestion {
  id: string;
  name: string;
  image: string;
  slug?: string;
}

export interface SearchSuggestionsResponse {
  services: SearchSuggestion[];
  products: SearchSuggestion[];
  recent_searches: string[];
  top_searches: string[];
  suggestions: string[];
}

// MOCK: Search suggestions data
export const mockSearchSuggestions: SearchSuggestionsResponse = {
  products: [
    { id: 'search-prod-1', name: 'React Dashboard Template', image: 'products/dashboard.jpg', slug: 'react-dashboard-template' },
    { id: 'search-prod-2', name: 'E-commerce UI Kit', image: 'products/ecommerce.jpg', slug: 'ecommerce-ui-kit' },
    { id: 'search-prod-3', name: 'Mobile App Template', image: 'products/mobile.jpg', slug: 'mobile-app-template' },
  ],
  services: [
    { id: 'search-svc-1', name: 'Custom Web Development', image: 'services/webdev.jpg' },
    { id: 'search-svc-2', name: 'UI/UX Design Services', image: 'services/design.jpg' },
  ],
  recent_searches: [],
  top_searches: ['React', 'Next.js', 'Dashboard', 'E-commerce', 'Admin Template'],
  suggestions: ['react template', 'nextjs starter', 'dashboard ui', 'landing page'],
};

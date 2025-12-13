// Service Details Mock Data

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  deliveryDays: number;
  revisions: number | 'Unlimited';
  features: string[];
}

export interface ServiceData {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryId: string;
  subcategory?: string;
  short_description: string;
  full_description: string;
  gallery_images: string[];
  video_url?: string;
  packages: ServicePackage[];
  total_orders: number;
  total_views: number;
  total_likes: number;
  is_liked: boolean;
  avg_rating: number;
  total_reviews: number;
  response_time: string;
  current_status: string;
  tags: string[];
  faqs: Array<{ question: string; answer: string }>;
  created_at: string;
  updated_at: string;
  seller: {
    id: string;
    first_name: string;
    last_name: string;
    user_name: string;
    profile_image: string;
    member_since: string;
    country: string;
    languages: string[];
    response_time: string;
    last_delivery: string;
    description: string;
    level: string;
    total_reviews: number;
    avg_rating: number;
    completed_orders: number;
    badges: Array<{ badge_icon: string; badge_name: string }>;
  };
}

export interface ServiceReview {
  id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  content: string;
  created_at: string;
  country?: string;
  seller_reply?: string;
}

export const mockService: ServiceData = {
  id: 'srv-001',
  slug: 'professional-logo-design-service',
  title: 'I will design a professional modern logo for your business',
  category: 'Graphic Design',
  categoryId: 'graphic-design',
  subcategory: 'Logo Design',
  short_description:
    'Get a unique, professional logo that perfectly represents your brand. I create modern, minimalist, and memorable logos that make your business stand out.',
  full_description: `
    <h3>About This Service</h3>
    <p>Looking for a professional logo that will make your brand stand out? You've come to the right place! With over 5 years of experience in graphic design, I create logos that are not only visually stunning but also meaningful and memorable.</p>

    <h3>What You'll Get</h3>
    <ul>
      <li>100% Original & Unique Design</li>
      <li>High-Resolution Files (PNG, JPG, PDF)</li>
      <li>Vector Source Files (AI, EPS, SVG)</li>
      <li>Transparent Background Version</li>
      <li>Social Media Kit (upon request)</li>
      <li>Brand Guidelines (Premium package)</li>
    </ul>

    <h3>My Design Process</h3>
    <ol>
      <li><strong>Discovery:</strong> I start by understanding your brand, target audience, and competitors</li>
      <li><strong>Concept Development:</strong> I create multiple initial concepts based on our discussion</li>
      <li><strong>Refinement:</strong> We work together to refine the chosen concept until it's perfect</li>
      <li><strong>Delivery:</strong> You receive all final files in various formats</li>
    </ol>

    <h3>Why Choose Me?</h3>
    <ul>
      <li>Fast turnaround time</li>
      <li>Unlimited revisions until you're 100% satisfied</li>
      <li>Clear communication throughout the process</li>
      <li>Professional and friendly service</li>
    </ul>

    <p><strong>Ready to get started?</strong> Click "Order Now" and let's create something amazing together!</p>
  `,
  gallery_images: [
    'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
  ],
  packages: [
    {
      id: 'pkg-basic',
      name: 'Basic',
      description: '1 concept, basic logo design',
      price: 50,
      oldPrice: 75,
      deliveryDays: 3,
      revisions: 2,
      features: [
        '1 Logo Concept',
        'PNG & JPG Files',
        'Basic Support',
      ],
    },
    {
      id: 'pkg-standard',
      name: 'Standard',
      description: '3 concepts with revisions',
      price: 100,
      oldPrice: 150,
      deliveryDays: 5,
      revisions: 5,
      features: [
        '3 Logo Concepts',
        'PNG, JPG & PDF Files',
        'Vector Files (AI, EPS)',
        'Transparent Background',
        'Social Media Kit',
      ],
    },
    {
      id: 'pkg-premium',
      name: 'Premium',
      description: 'Complete brand identity',
      price: 250,
      deliveryDays: 7,
      revisions: 'Unlimited',
      features: [
        '5 Logo Concepts',
        'All File Formats',
        'Vector Source Files',
        'Transparent Background',
        'Social Media Kit',
        'Brand Guidelines',
        'Business Card Design',
        'Letterhead Design',
        'Priority Support',
      ],
    },
  ],
  total_orders: 342,
  total_views: 12580,
  total_likes: 156,
  is_liked: false,
  avg_rating: 4.9,
  total_reviews: 287,
  response_time: '1 hour',
  current_status: 'PUBLISHED',
  tags: ['logo design', 'branding', 'minimalist', 'modern', 'business logo', 'graphic design'],
  faqs: [
    {
      question: 'What information do you need to start?',
      answer: 'I will need your business name, a brief description of your business, your target audience, preferred colors (if any), and any design inspiration or references you like.',
    },
    {
      question: 'Can you match my existing brand colors?',
      answer: 'Absolutely! Just share your brand colors (HEX codes preferred) and I will incorporate them into the design.',
    },
    {
      question: 'What if I\'m not satisfied with the designs?',
      answer: 'Your satisfaction is my priority. I offer revisions with every package, and I will work with you until you are 100% happy with the result.',
    },
    {
      question: 'Do you provide the source files?',
      answer: 'Yes! Vector source files (AI, EPS, SVG) are included in the Standard and Premium packages.',
    },
    {
      question: 'Can you design a logo in a specific style?',
      answer: 'Yes, I can create logos in various styles including minimalist, vintage, modern, abstract, mascot, and more. Just let me know your preference!',
    },
  ],
  created_at: '2023-06-15T08:00:00Z',
  updated_at: '2024-12-10T14:30:00Z',
  seller: {
    id: 'seller-001',
    first_name: 'Sarah',
    last_name: 'Designer',
    user_name: 'sarahdesigns',
    profile_image: 'https://i.pravatar.cc/150?img=5',
    member_since: '2021-03-20T00:00:00Z',
    country: 'United States',
    languages: ['English', 'Spanish'],
    response_time: '1 hour',
    last_delivery: '2 days ago',
    description: 'Professional graphic designer with 5+ years of experience specializing in logo design and brand identity. I\'ve helped hundreds of businesses create memorable visual identities.',
    level: 'Top Rated',
    total_reviews: 892,
    avg_rating: 4.9,
    completed_orders: 1247,
    badges: [
      { badge_icon: '/images/badges/top-rated.png', badge_name: 'Top Rated' },
      { badge_icon: '/images/badges/fast-delivery.png', badge_name: 'Fast Delivery' },
    ],
  },
};

export const mockServiceReviews: ServiceReview[] = [
  {
    id: 'rev-001',
    user_name: 'John Mitchell',
    user_avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    content: 'Sarah did an amazing job on my company logo! She understood exactly what I was looking for and delivered beyond my expectations. Highly recommend her services!',
    created_at: '2024-12-08T14:30:00Z',
    country: 'Canada',
    seller_reply: 'Thank you so much, John! It was a pleasure working with you. Best of luck with your business!',
  },
  {
    id: 'rev-002',
    user_name: 'Emily Watson',
    user_avatar: 'https://i.pravatar.cc/150?img=9',
    rating: 5,
    content: 'Fantastic work! The logo perfectly captures the essence of my brand. Communication was excellent throughout the process.',
    created_at: '2024-12-05T09:15:00Z',
    country: 'United Kingdom',
  },
  {
    id: 'rev-003',
    user_name: 'Carlos Rodriguez',
    user_avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 4,
    content: 'Great designer with creative ideas. The only reason for 4 stars is because the delivery took a bit longer than expected, but the quality made up for it.',
    created_at: '2024-11-28T16:45:00Z',
    country: 'Spain',
    seller_reply: 'Thank you for your feedback, Carlos! I apologize for the slight delay - I wanted to make sure everything was perfect. Glad you loved the final result!',
  },
  {
    id: 'rev-004',
    user_name: 'Lisa Park',
    user_avatar: 'https://i.pravatar.cc/150?img=16',
    rating: 5,
    content: 'This is my third time ordering from Sarah and she never disappoints. Professional, creative, and always delivers quality work.',
    created_at: '2024-11-20T11:00:00Z',
    country: 'South Korea',
  },
];

export const mockRelatedServices = [
  {
    id: 'rel-001',
    slug: 'business-card-design',
    title: 'Professional Business Card Design',
    img: 'https://images.unsplash.com/photo-1589041127168-9b1915731dc3?w=400',
    authorName: 'Mike Designer',
    price: 30,
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 'rel-002',
    slug: 'brand-identity-package',
    title: 'Complete Brand Identity Package',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    authorName: 'Brand Studio',
    price: 500,
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 'rel-003',
    slug: 'social-media-kit-design',
    title: 'Social Media Kit & Templates',
    img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400',
    authorName: 'Creative Hub',
    price: 75,
    rating: 4.7,
    reviews: 234,
  },
  {
    id: 'rel-004',
    slug: 'website-ui-design',
    title: 'Modern Website UI/UX Design',
    img: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
    authorName: 'WebPro Design',
    price: 200,
    rating: 4.8,
    reviews: 178,
  },
];

export const mockServiceReviewStats = {
  avg_rating: 4.9,
  total_reviews: 287,
  rating_sequence: {
    5: 245,
    4: 32,
    3: 7,
    2: 2,
    1: 1,
  },
};

export function formatPrice(price: number): string {
  return price > 0 ? Number(price).toFixed(0) : '0';
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Package Comparison Data (for PackageComparisonTable)
export interface PackageAttribute {
  key: string;
  value: string | number | boolean | null;
}

export interface ComparisonPackageInfo {
  title?: string;
  short_description?: string;
  price: number;
  discounted_price?: number;
  delivery_time?: number;
  attributes?: PackageAttribute[];
}

export interface PackagesComparisonInfo {
  basic?: ComparisonPackageInfo;
  standard?: ComparisonPackageInfo;
  premium?: ComparisonPackageInfo;
}

export interface PackageTab {
  id: 'basic' | 'standard' | 'premium';
  title: string;
}

export const mockPackageTabs: PackageTab[] = [
  { id: 'basic', title: 'Basic' },
  { id: 'standard', title: 'Standard' },
  { id: 'premium', title: 'Premium' },
];

export const mockPackagesComparisonInfo: PackagesComparisonInfo = {
  basic: {
    title: 'Basic',
    short_description: '1 concept, basic logo design',
    price: 75,
    discounted_price: 50,
    delivery_time: 3,
    attributes: [
      { key: 'logo_concepts', value: 1 },
      { key: 'revisions', value: 2 },
      { key: 'png_jpg_files', value: true },
      { key: 'vector_files', value: false },
      { key: 'transparent_background', value: false },
      { key: 'social_media_kit', value: false },
      { key: 'brand_guidelines', value: false },
      { key: 'business_card_design', value: false },
      { key: 'letterhead_design', value: false },
      { key: 'priority_support', value: false },
    ],
  },
  standard: {
    title: 'Standard',
    short_description: '3 concepts with revisions',
    price: 150,
    discounted_price: 100,
    delivery_time: 5,
    attributes: [
      { key: 'logo_concepts', value: 3 },
      { key: 'revisions', value: 5 },
      { key: 'png_jpg_files', value: true },
      { key: 'vector_files', value: true },
      { key: 'transparent_background', value: true },
      { key: 'social_media_kit', value: true },
      { key: 'brand_guidelines', value: false },
      { key: 'business_card_design', value: false },
      { key: 'letterhead_design', value: false },
      { key: 'priority_support', value: false },
    ],
  },
  premium: {
    title: 'Premium',
    short_description: 'Complete brand identity',
    price: 250,
    delivery_time: 7,
    attributes: [
      { key: 'logo_concepts', value: 5 },
      { key: 'revisions', value: 'Unlimited' },
      { key: 'png_jpg_files', value: true },
      { key: 'vector_files', value: true },
      { key: 'transparent_background', value: true },
      { key: 'social_media_kit', value: true },
      { key: 'brand_guidelines', value: true },
      { key: 'business_card_design', value: true },
      { key: 'letterhead_design', value: true },
      { key: 'priority_support', value: true },
    ],
  },
};

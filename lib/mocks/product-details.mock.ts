// Product Details Mock Data
export interface ProductData {
  id: string;
  product_name: string;
  short_description: string;
  full_description: string;
  product_preview_file_url: string;
  screenshots_urls: string[];
  is_onsale: boolean;
  regular_lic_price: number;
  regular_lic_fee: number;
  extended_lic_price: number;
  extended_lic_fee: number;
  discount_regular_price: number;
  discount_extended_price: number;
  total_sales: number;
  total_views: number;
  total_likes: number;
  is_liked: boolean;
  current_status: string;
  product_attributes: Array<{
    attribute_type_title: string;
    attribute_title: string;
  }>;
  is_gutenberg_potimized: boolean;
  is_high_resolution: boolean;
  layout_columns: string;
  layout_type: string;
  product_tags: string[];
  product_doc_url: string;
  updated_at: string;
  created_at: string;
  user_meta: {
    sub: string;
    first_name: string;
    last_name: string;
    user_name: string;
    profile_image: string;
    member_since: string;
  };
}

export interface License {
  type: string;
  lic_type: string;
  price: number;
  oldPrice: number;
  extendSupportPrice: number;
  extendSupportOldPrice: number;
  description: string;
}

export interface Review {
  id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  content: string;
  created_at: string;
  author_reply?: string;
}

export interface Comment {
  id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
  replies?: Array<{
    id: string;
    user_name: string;
    user_avatar: string;
    content: string;
    created_at: string;
    is_author: boolean;
  }>;
}

export const mockProduct: ProductData = {
  id: 'prod-001',
  product_name: 'Modern Admin Dashboard Template - React & Next.js',
  short_description:
    'A premium admin dashboard template built with React 19, Next.js 14, and Tailwind CSS. Perfect for SaaS applications, analytics platforms, and admin panels.',
  full_description: `
    <h3>Overview</h3>
    <p>This premium admin dashboard template is the perfect foundation for building modern web applications. Built with the latest technologies including React 19, Next.js 14, and Tailwind CSS 4.</p>

    <h3>Key Features</h3>
    <ul>
      <li>Fully responsive design</li>
      <li>Dark/Light mode support</li>
      <li>100+ UI components</li>
      <li>Authentication pages</li>
      <li>Charts and analytics</li>
      <li>Form validation</li>
      <li>Data tables</li>
      <li>Calendar integration</li>
    </ul>

    <h3>Tech Stack</h3>
    <ul>
      <li>React 19</li>
      <li>Next.js 14</li>
      <li>TypeScript</li>
      <li>Tailwind CSS 4</li>
      <li>Framer Motion</li>
      <li>Recharts</li>
    </ul>

    <h3>Support</h3>
    <p>We provide 6 months of dedicated support with every purchase. Our team is available to help you with setup, customization, and any technical questions.</p>
  `,
  product_preview_file_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  screenshots_urls: [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
  ],
  is_onsale: true,
  regular_lic_price: 49,
  regular_lic_fee: 0,
  extended_lic_price: 249,
  extended_lic_fee: 0,
  discount_regular_price: 39,
  discount_extended_price: 199,
  total_sales: 1247,
  total_views: 45892,
  total_likes: 328,
  is_liked: false,
  current_status: 'PUBLISHED',
  product_attributes: [
    { attribute_type_title: 'Compatible Browsers', attribute_title: 'Chrome' },
    { attribute_type_title: 'Compatible Browsers', attribute_title: 'Firefox' },
    { attribute_type_title: 'Compatible Browsers', attribute_title: 'Safari' },
    { attribute_type_title: 'Compatible Browsers', attribute_title: 'Edge' },
    { attribute_type_title: 'Software Version', attribute_title: 'React 19.x' },
    { attribute_type_title: 'Software Version', attribute_title: 'Next.js 14.x' },
  ],
  is_gutenberg_potimized: true,
  is_high_resolution: true,
  layout_columns: '4+',
  layout_type: 'Responsive',
  product_tags: ['react', 'nextjs', 'admin', 'dashboard', 'tailwind', 'typescript'],
  product_doc_url: '/docs/admin-dashboard',
  updated_at: '2024-12-10T10:30:00Z',
  created_at: '2024-06-15T08:00:00Z',
  user_meta: {
    sub: 'user-001',
    first_name: 'Alex',
    last_name: 'Thompson',
    user_name: 'alexdev',
    profile_image: 'https://i.pravatar.cc/150?img=11',
    member_since: '2022-01-15T00:00:00Z',
  },
};

export const mockLicenses: License[] = [
  {
    type: 'Regular License',
    lic_type: 'REGULAR',
    price: 39,
    oldPrice: 49,
    extendSupportPrice: 14.7,
    extendSupportOldPrice: 0,
    description:
      'Use, by you or one client, in a single end product which end users are not charged for. The total price includes the item price and a buyer fee.',
  },
  {
    type: 'Extended License',
    lic_type: 'EXTENDED',
    price: 199,
    oldPrice: 249,
    extendSupportPrice: 74.7,
    extendSupportOldPrice: 0,
    description:
      'Use, by you or one client, in a single end product which end users can be charged for. The total price includes the item price and a buyer fee.',
  },
];

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    user_name: 'Michael Chen',
    user_avatar: 'https://i.pravatar.cc/150?img=12',
    rating: 5,
    content:
      'Excellent template! Clean code, well documented, and easy to customize. The support team was also very helpful when I had questions about the chart integration.',
    created_at: '2024-12-08T14:30:00Z',
    author_reply: 'Thank you for the kind words, Michael! We\'re glad you enjoyed the template.',
  },
  {
    id: 'rev-002',
    user_name: 'Sarah Williams',
    user_avatar: 'https://i.pravatar.cc/150?img=5',
    rating: 4,
    content:
      'Great template overall. The design is modern and the components are well-built. Only minor issue was some TypeScript warnings that needed fixing.',
    created_at: '2024-12-05T09:15:00Z',
  },
  {
    id: 'rev-003',
    user_name: 'James Rodriguez',
    user_avatar: 'https://i.pravatar.cc/150?img=8',
    rating: 5,
    content:
      'This saved me weeks of development time. The authentication flow and dashboard layouts are exactly what I needed for my SaaS project.',
    created_at: '2024-11-28T16:45:00Z',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'com-001',
    user_name: 'David Park',
    user_avatar: 'https://i.pravatar.cc/150?img=15',
    content:
      'Does this template include RTL support? I need to build an app that supports Arabic and Hebrew.',
    created_at: '2024-12-09T11:20:00Z',
    replies: [
      {
        id: 'rep-001',
        user_name: 'Alex Thompson',
        user_avatar: 'https://i.pravatar.cc/150?img=11',
        content:
          'Yes, the template includes full RTL support! You can enable it by setting the dir attribute on the html element and the styles will automatically adjust.',
        created_at: '2024-12-09T13:45:00Z',
        is_author: true,
      },
    ],
  },
  {
    id: 'com-002',
    user_name: 'Emma Wilson',
    user_avatar: 'https://i.pravatar.cc/150?img=9',
    content:
      'Can I use this template for multiple projects if I purchase the regular license?',
    created_at: '2024-12-07T08:30:00Z',
    replies: [
      {
        id: 'rep-002',
        user_name: 'Alex Thompson',
        user_avatar: 'https://i.pravatar.cc/150?img=11',
        content:
          'The regular license covers one end product. For multiple projects, you\'ll need to purchase additional licenses or consider the extended license.',
        created_at: '2024-12-07T10:15:00Z',
        is_author: true,
      },
    ],
  },
];

export const mockRelatedProducts = [
  {
    id: 'rel-001',
    title: 'E-commerce Dashboard Pro',
    thumbnail_image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    price: 59,
    total_sales: 856,
    avg_rating: 4.8,
    total_reviews: 124,
    creator: {
      first_name: 'Sarah',
      last_name: 'Dev',
      user_name: 'sarahdev',
    },
  },
  {
    id: 'rel-002',
    title: 'SaaS Landing Page Kit',
    thumbnail_image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400',
    price: 29,
    total_sales: 1523,
    avg_rating: 4.9,
    total_reviews: 287,
    creator: {
      first_name: 'Mike',
      last_name: 'Builder',
      user_name: 'mikebuilder',
    },
  },
  {
    id: 'rel-003',
    title: 'CRM System Template',
    thumbnail_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
    price: 79,
    total_sales: 432,
    avg_rating: 4.7,
    total_reviews: 89,
    creator: {
      first_name: 'Lisa',
      last_name: 'Code',
      user_name: 'lisacode',
    },
  },
  {
    id: 'rel-004',
    title: 'Analytics Dashboard',
    thumbnail_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    price: 45,
    total_sales: 678,
    avg_rating: 4.6,
    total_reviews: 156,
    creator: {
      first_name: 'Tom',
      last_name: 'React',
      user_name: 'tomreact',
    },
  },
];

export const mockReviewStats = {
  avg_rating: 4.7,
  total_reviews: 156,
  rating_sequence: {
    5: 98,
    4: 42,
    3: 10,
    2: 4,
    1: 2,
  },
};

export function formatPrice(price: number): string {
  return price > 0 ? Number(price).toFixed(2).replace(/\.00$/, '') : '0';
}

export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
  return formatDate(dateString);
}

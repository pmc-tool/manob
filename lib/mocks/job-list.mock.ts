// Job List mock data - matching PMC design

export interface JobSkill {
  id: string;
  title: string;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  description: string;
  service_price: number;
  delivery_time: number;
  delivery_time_type: string;
  experience_level: string;
  total_bids: number;
  status: 'OPEN' | 'HIRED' | 'CLOSED' | 'EXPIRED';
  job_type: 'REGULAR' | 'LIVE';
  skills: JobSkill[];
  created_at: string;
  post_duration?: number;
  post_duration_type?: string;
}

export interface JobListData {
  items: Job[];
  pagination: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
}

// Mock job skills
export const mockSkills: JobSkill[] = [
  { id: 'skill-1', title: 'React' },
  { id: 'skill-2', title: 'Node.js' },
  { id: 'skill-3', title: 'TypeScript' },
  { id: 'skill-4', title: 'Next.js' },
  { id: 'skill-5', title: 'Python' },
  { id: 'skill-6', title: 'Django' },
  { id: 'skill-7', title: 'PostgreSQL' },
  { id: 'skill-8', title: 'MongoDB' },
  { id: 'skill-9', title: 'AWS' },
  { id: 'skill-10', title: 'Docker' },
  { id: 'skill-11', title: 'GraphQL' },
  { id: 'skill-12', title: 'REST API' },
];

// Mock jobs data
export const mockJobs: Job[] = [
  {
    id: 'job-001',
    slug: 'build-ecommerce-platform-react-nodejs',
    title: 'Build an E-commerce Platform with React and Node.js',
    description: 'Looking for an experienced developer to build a full-stack e-commerce platform. The project includes user authentication, product management, shopping cart, payment integration (Stripe), and an admin dashboard. Must have experience with React, Node.js, and PostgreSQL.',
    service_price: 2500,
    delivery_time: 30,
    delivery_time_type: 'Days',
    experience_level: 'Expert',
    total_bids: 12,
    status: 'OPEN',
    job_type: 'REGULAR',
    skills: [mockSkills[0], mockSkills[1], mockSkills[2], mockSkills[6]],
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-002',
    slug: 'mobile-app-development-react-native',
    title: 'Mobile App Development with React Native',
    description: 'Need a skilled React Native developer to create a cross-platform mobile application for iOS and Android. The app will include real-time chat, push notifications, and integration with our existing REST API backend.',
    service_price: 3500,
    delivery_time: 45,
    delivery_time_type: 'Days',
    experience_level: 'Expert',
    total_bids: 8,
    status: 'OPEN',
    job_type: 'LIVE',
    skills: [mockSkills[0], mockSkills[2], mockSkills[11]],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    post_duration: 7,
    post_duration_type: 'DAYS',
  },
  {
    id: 'job-003',
    slug: 'wordpress-website-customization',
    title: 'WordPress Website Customization and Plugin Development',
    description: 'Looking for a WordPress expert to customize our existing theme and develop custom plugins. Must have experience with WooCommerce, custom post types, and REST API integration.',
    service_price: 800,
    delivery_time: 14,
    delivery_time_type: 'Days',
    experience_level: 'Intermediate',
    total_bids: 15,
    status: 'OPEN',
    job_type: 'REGULAR',
    skills: [{ id: 'wp-1', title: 'WordPress' }, { id: 'wp-2', title: 'PHP' }, { id: 'wp-3', title: 'WooCommerce' }],
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-004',
    slug: 'python-data-analysis-dashboard',
    title: 'Python Data Analysis and Dashboard Development',
    description: 'Need a Python developer to create data analysis scripts and a web-based dashboard using Django and Plotly. The project involves processing large datasets, creating visualizations, and building an interactive dashboard.',
    service_price: 1800,
    delivery_time: 21,
    delivery_time_type: 'Days',
    experience_level: 'Expert',
    total_bids: 6,
    status: 'OPEN',
    job_type: 'REGULAR',
    skills: [mockSkills[4], mockSkills[5], { id: 'plotly', title: 'Plotly' }],
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-005',
    slug: 'aws-infrastructure-setup',
    title: 'AWS Infrastructure Setup and DevOps Pipeline',
    description: 'Looking for an AWS expert to set up our cloud infrastructure including EC2, RDS, S3, CloudFront, and CI/CD pipeline using GitHub Actions. Must have experience with Docker and Kubernetes.',
    service_price: 2000,
    delivery_time: 10,
    delivery_time_type: 'Days',
    experience_level: 'Expert',
    total_bids: 4,
    status: 'HIRED',
    job_type: 'REGULAR',
    skills: [mockSkills[8], mockSkills[9], { id: 'k8s', title: 'Kubernetes' }],
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-006',
    slug: 'graphql-api-development',
    title: 'GraphQL API Development with Apollo Server',
    description: 'Need an experienced developer to build a GraphQL API using Apollo Server and Node.js. The API will handle complex queries, mutations, and subscriptions for a real-time application.',
    service_price: 1500,
    delivery_time: 14,
    delivery_time_type: 'Days',
    experience_level: 'Intermediate',
    total_bids: 9,
    status: 'OPEN',
    job_type: 'LIVE',
    skills: [mockSkills[10], mockSkills[1], mockSkills[2]],
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    post_duration: 3,
    post_duration_type: 'DAYS',
  },
  {
    id: 'job-007',
    slug: 'landing-page-design-development',
    title: 'Landing Page Design and Development',
    description: 'Looking for a frontend developer to create a high-converting landing page with animations and responsive design. Must be proficient in HTML, CSS, JavaScript, and have experience with conversion optimization.',
    service_price: 500,
    delivery_time: 7,
    delivery_time_type: 'Days',
    experience_level: 'Entry',
    total_bids: 22,
    status: 'OPEN',
    job_type: 'REGULAR',
    skills: [{ id: 'html', title: 'HTML' }, { id: 'css', title: 'CSS' }, { id: 'js', title: 'JavaScript' }],
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-008',
    slug: 'shopify-store-development',
    title: 'Shopify Store Development and Theme Customization',
    description: 'Need a Shopify expert to develop a custom store with theme modifications, app integrations, and checkout customization. Experience with Liquid templating and Shopify APIs required.',
    service_price: 1200,
    delivery_time: 14,
    delivery_time_type: 'Days',
    experience_level: 'Intermediate',
    total_bids: 11,
    status: 'OPEN',
    job_type: 'REGULAR',
    skills: [{ id: 'shopify', title: 'Shopify' }, { id: 'liquid', title: 'Liquid' }, { id: 'js', title: 'JavaScript' }],
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock job list data
export const mockJobListData: JobListData = {
  items: mockJobs,
  pagination: {
    total_count: mockJobs.length,
    total_pages: 1,
    current_page: 1,
    per_page: 25,
  },
};

// Filter options for sidebar
export const jobFilterOptions = {
  experience_level: [
    { id: 'entry', title: 'Entry Level', count: 1 },
    { id: 'intermediate', title: 'Intermediate', count: 3 },
    { id: 'expert', title: 'Expert', count: 4 },
  ],
  job_type: [
    { id: 'all', title: 'All', count: 8 },
    { id: 'live', title: 'Live Job', count: 2 },
    { id: 'regular', title: 'Regular Job', count: 6 },
  ],
  price_range: {
    min: 0,
    max: 5000,
  },
};

// Helper function to calculate time ago
// Extended job interface for job details
export interface JobOwner {
  id: string;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  profile_image: string;
  country: string;
  isVerified: boolean;
  avg_rating: number;
  created_at: string;
  total_orders: number;
}

export interface BuyerDetails {
  hire_rate: number;
  total_spent: number;
  total_jobs: number;
  total_projects: number;
  member_since: string;
}

export interface JobDetails extends Job {
  owner_meta: JobOwner;
  owner_info: JobOwner;
  category_meta: {
    id: string;
    title: string;
    slug: string;
  };
  primary_category: {
    id: string;
    title: string;
  };
  avg_bid_price: number;
  attached_product_meta?: {
    id: string;
    title: string;
    product_preview_file: string;
    avg_rating: number;
    total_review: number;
  };
  is_bidded?: boolean;
}

// Mock owner data
const mockOwner: JobOwner = {
  id: 'owner-001',
  first_name: 'John',
  last_name: 'Smith',
  user_name: 'johnsmith',
  email: 'john@example.com',
  profile_image: 'uploads/profiles/default-avatar.png',
  country: 'United States',
  isVerified: true,
  avg_rating: 4.8,
  created_at: '2023-01-15T00:00:00.000Z',
  total_orders: 45,
};

// Mock buyer details
export const mockBuyerDetails: BuyerDetails = {
  hire_rate: 85,
  total_spent: 25000,
  total_jobs: 32,
  total_projects: 28,
  member_since: '2023-01-15T00:00:00.000Z',
};

// Mock job details data
export const mockJobDetails: Record<string, JobDetails> = {
  'job-001': {
    ...mockJobs[0],
    owner_meta: mockOwner,
    owner_info: mockOwner,
    category_meta: { id: 'cat-1', title: 'Web Development', slug: 'web-development' },
    primary_category: { id: 'cat-1', title: 'Web Development' },
    avg_bid_price: 2200,
    is_bidded: false,
  },
  'job-002': {
    ...mockJobs[1],
    owner_meta: { ...mockOwner, id: 'owner-002', first_name: 'Sarah', last_name: 'Johnson', user_name: 'sarahj' },
    owner_info: { ...mockOwner, id: 'owner-002', first_name: 'Sarah', last_name: 'Johnson', user_name: 'sarahj' },
    category_meta: { id: 'cat-2', title: 'Mobile Development', slug: 'mobile-development' },
    primary_category: { id: 'cat-2', title: 'Mobile Development' },
    avg_bid_price: 3200,
    is_bidded: false,
  },
  'job-003': {
    ...mockJobs[2],
    owner_meta: { ...mockOwner, id: 'owner-003', first_name: 'Mike', last_name: 'Wilson', user_name: 'mikew' },
    owner_info: { ...mockOwner, id: 'owner-003', first_name: 'Mike', last_name: 'Wilson', user_name: 'mikew' },
    category_meta: { id: 'cat-3', title: 'WordPress', slug: 'wordpress' },
    primary_category: { id: 'cat-3', title: 'WordPress' },
    avg_bid_price: 650,
    is_bidded: true,
  },
  'job-004': {
    ...mockJobs[3],
    owner_meta: mockOwner,
    owner_info: mockOwner,
    category_meta: { id: 'cat-4', title: 'Data Science', slug: 'data-science' },
    primary_category: { id: 'cat-4', title: 'Data Science' },
    avg_bid_price: 1600,
    is_bidded: false,
  },
  'job-005': {
    ...mockJobs[4],
    owner_meta: { ...mockOwner, id: 'owner-004', first_name: 'Emily', last_name: 'Brown', user_name: 'emilyb' },
    owner_info: { ...mockOwner, id: 'owner-004', first_name: 'Emily', last_name: 'Brown', user_name: 'emilyb' },
    category_meta: { id: 'cat-5', title: 'DevOps', slug: 'devops' },
    primary_category: { id: 'cat-5', title: 'DevOps' },
    avg_bid_price: 1850,
    is_bidded: false,
  },
  'job-006': {
    ...mockJobs[5],
    owner_meta: mockOwner,
    owner_info: mockOwner,
    category_meta: { id: 'cat-1', title: 'Web Development', slug: 'web-development' },
    primary_category: { id: 'cat-1', title: 'Web Development' },
    avg_bid_price: 1350,
    is_bidded: false,
  },
  'job-007': {
    ...mockJobs[6],
    owner_meta: { ...mockOwner, id: 'owner-005', first_name: 'David', last_name: 'Lee', user_name: 'davidl' },
    owner_info: { ...mockOwner, id: 'owner-005', first_name: 'David', last_name: 'Lee', user_name: 'davidl' },
    category_meta: { id: 'cat-6', title: 'UI/UX Design', slug: 'ui-ux-design' },
    primary_category: { id: 'cat-6', title: 'UI/UX Design' },
    avg_bid_price: 420,
    is_bidded: false,
  },
  'job-008': {
    ...mockJobs[7],
    owner_meta: mockOwner,
    owner_info: mockOwner,
    category_meta: { id: 'cat-7', title: 'E-commerce', slug: 'ecommerce' },
    primary_category: { id: 'cat-7', title: 'E-commerce' },
    avg_bid_price: 1100,
    is_bidded: false,
  },
};

// Helper to get job details by id or slug
export function getJobDetails(idOrSlug: string): JobDetails | null {
  // Try direct id match
  if (mockJobDetails[idOrSlug]) {
    return mockJobDetails[idOrSlug];
  }
  // Try slug match
  const job = mockJobs.find(j => j.slug === idOrSlug);
  if (job && mockJobDetails[job.id]) {
    return mockJobDetails[job.id];
  }
  return null;
}

// Helper function to format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

// Helper function to calculate deadline
export function calculateDeadline(deliveryTime: number, deliveryTimeType: string): string {
  const currentDate = new Date();
  const deadlineDate = new Date(currentDate);

  if (deliveryTimeType.toUpperCase() === 'DAY' || deliveryTimeType.toUpperCase() === 'DAYS') {
    deadlineDate.setDate(deadlineDate.getDate() + deliveryTime);
  } else if (deliveryTimeType.toUpperCase() === 'HOUR' || deliveryTimeType.toUpperCase() === 'HOURS') {
    deadlineDate.setHours(deadlineDate.getHours() + deliveryTime);
  }

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(deadlineDate);
}

export function calculateTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
}

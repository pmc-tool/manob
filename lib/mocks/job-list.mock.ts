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

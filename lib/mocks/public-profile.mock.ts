// CONTRACT: GET /user/profile/:username
// Mock data for public user profiles

export interface PublicUserProfile {
  id: string;
  user_name: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  about_me: string;
  avg_rating: number;
  total_reviews: number;
  completed_orders: number;
  city: string;
  country: string;
  languages: Array<{
    language_id: number;
    language_name: string;
    level: string;
  }>;
  skills: Array<{
    skill_id: number;
    skill_name: string;
  }>;
  badges: Array<{
    badge_icon: string;
    badge_name: string;
  }>;
  member_since: string;
  seller_level: string;
  response_time: string;
  last_delivery: string;
  reviews: Array<{
    id: string;
    reviewer_name: string;
    reviewer_image: string;
    reviewer_username: string;
    rating: number;
    content: string;
    created_at: string;
    helpful_count: number;
  }>;
  services?: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
    rating: number;
    reviews_count: number;
  }>;
  products?: Array<{
    id: string;
    title: string;
    image: string;
    price: number;
    rating: number;
    sales_count: number;
  }>;
}

// MOCK: Sample public profiles data
export const mockPublicProfiles: Record<string, PublicUserProfile> = {
  'john-developer': {
    id: 'user-1',
    user_name: 'john-developer',
    first_name: 'John',
    last_name: 'Developer',
    profile_image: 'https://ui-avatars.com/api/?name=John+Developer&background=ea2725&color=fff&size=300',
    about_me:
      'I am a passionate full-stack developer with over 8 years of experience in building scalable web applications. My expertise spans React, Next.js, Node.js, and cloud technologies. I love turning complex problems into simple, beautiful solutions.',
    avg_rating: 4.8,
    total_reviews: 156,
    completed_orders: 203,
    city: 'San Francisco',
    country: 'United States',
    languages: [
      { language_id: 1, language_name: 'English', level: 'Native' },
      { language_id: 2, language_name: 'Spanish', level: 'Intermediate' },
    ],
    skills: [
      { skill_id: 1, skill_name: 'React' },
      { skill_id: 2, skill_name: 'Next.js' },
      { skill_id: 3, skill_name: 'TypeScript' },
      { skill_id: 4, skill_name: 'Node.js' },
      { skill_id: 5, skill_name: 'PostgreSQL' },
      { skill_id: 6, skill_name: 'AWS' },
    ],
    badges: [
      { badge_icon: '/images/badges/top-rated.png', badge_name: 'Top Rated' },
      { badge_icon: '/images/badges/fast-delivery.png', badge_name: 'Fast Delivery' },
    ],
    member_since: '2020-01-15',
    seller_level: 'Pro Seller',
    response_time: '1 hour',
    last_delivery: '2 days ago',
    reviews: [
      {
        id: 'review-1',
        reviewer_name: 'Sarah Wilson',
        reviewer_image: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random',
        reviewer_username: 'sarah-wilson',
        rating: 5,
        content: 'John delivered exceptional work on our React project. His code quality and attention to detail were outstanding.',
        created_at: '2024-01-15',
        helpful_count: 12,
      },
      {
        id: 'review-2',
        reviewer_name: 'Mike Chen',
        reviewer_image: 'https://ui-avatars.com/api/?name=Mike+Chen&background=random',
        reviewer_username: 'mike-chen',
        rating: 5,
        content: 'Fantastic developer! Completed the project ahead of schedule and went above and beyond.',
        created_at: '2024-01-10',
        helpful_count: 8,
      },
      {
        id: 'review-3',
        reviewer_name: 'Emma Thompson',
        reviewer_image: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=random',
        reviewer_username: 'emma-thompson',
        rating: 4,
        content: 'Great work overall. Very professional and knowledgeable. Would definitely hire again.',
        created_at: '2024-01-05',
        helpful_count: 5,
      },
    ],
    services: [
      {
        id: 'service-1',
        title: 'Full-Stack Web Application Development',
        image: 'https://picsum.photos/seed/service1/400/300',
        price: 500,
        rating: 4.9,
        reviews_count: 45,
      },
      {
        id: 'service-2',
        title: 'React & Next.js Frontend Development',
        image: 'https://picsum.photos/seed/service2/400/300',
        price: 300,
        rating: 4.8,
        reviews_count: 62,
      },
    ],
    products: [
      {
        id: 'product-1',
        title: 'E-Commerce Dashboard Template',
        image: 'https://picsum.photos/seed/product1/400/300',
        price: 49,
        rating: 4.7,
        sales_count: 234,
      },
      {
        id: 'product-2',
        title: 'Admin Panel Starter Kit',
        image: 'https://picsum.photos/seed/product2/400/300',
        price: 39,
        rating: 4.6,
        sales_count: 189,
      },
    ],
  },
  'sarah-wilson': {
    id: 'user-2',
    user_name: 'sarah-wilson',
    first_name: 'Sarah',
    last_name: 'Wilson',
    profile_image: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=4f46e5&color=fff&size=300',
    about_me:
      'UI/UX Designer with 6+ years of experience creating beautiful and intuitive digital experiences. I specialize in mobile app design, web interfaces, and design systems.',
    avg_rating: 4.9,
    total_reviews: 98,
    completed_orders: 142,
    city: 'Los Angeles',
    country: 'United States',
    languages: [
      { language_id: 1, language_name: 'English', level: 'Native' },
      { language_id: 3, language_name: 'French', level: 'Beginner' },
    ],
    skills: [
      { skill_id: 10, skill_name: 'Figma' },
      { skill_id: 11, skill_name: 'UI Design' },
      { skill_id: 12, skill_name: 'UX Research' },
      { skill_id: 13, skill_name: 'Prototyping' },
      { skill_id: 14, skill_name: 'Design Systems' },
    ],
    badges: [
      { badge_icon: '/images/badges/top-rated.png', badge_name: 'Top Rated' },
    ],
    member_since: '2021-03-22',
    seller_level: 'Level 2 Seller',
    response_time: '2 hours',
    last_delivery: '1 day ago',
    reviews: [
      {
        id: 'review-4',
        reviewer_name: 'John Developer',
        reviewer_image: 'https://ui-avatars.com/api/?name=John+Developer&background=random',
        reviewer_username: 'john-developer',
        rating: 5,
        content: 'Sarah created an amazing design for our app. Highly recommended!',
        created_at: '2024-02-01',
        helpful_count: 15,
      },
    ],
    services: [
      {
        id: 'service-3',
        title: 'Mobile App UI/UX Design',
        image: 'https://picsum.photos/seed/service3/400/300',
        price: 400,
        rating: 4.9,
        reviews_count: 52,
      },
    ],
  },
  'mike-chen': {
    id: 'user-3',
    user_name: 'mike-chen',
    first_name: 'Mike',
    last_name: 'Chen',
    profile_image: 'https://ui-avatars.com/api/?name=Mike+Chen&background=10b981&color=fff&size=300',
    about_me:
      'Backend specialist and DevOps engineer. I help businesses build scalable, secure, and reliable infrastructure.',
    avg_rating: 4.7,
    total_reviews: 72,
    completed_orders: 95,
    city: 'Seattle',
    country: 'United States',
    languages: [
      { language_id: 1, language_name: 'English', level: 'Fluent' },
      { language_id: 5, language_name: 'Chinese', level: 'Native' },
    ],
    skills: [
      { skill_id: 20, skill_name: 'AWS' },
      { skill_id: 21, skill_name: 'Docker' },
      { skill_id: 22, skill_name: 'Kubernetes' },
      { skill_id: 23, skill_name: 'Python' },
      { skill_id: 24, skill_name: 'Go' },
    ],
    badges: [],
    member_since: '2022-06-10',
    seller_level: 'Level 1 Seller',
    response_time: '3 hours',
    last_delivery: '3 days ago',
    reviews: [],
    services: [
      {
        id: 'service-4',
        title: 'AWS Cloud Infrastructure Setup',
        image: 'https://picsum.photos/seed/service4/400/300',
        price: 600,
        rating: 4.7,
        reviews_count: 38,
      },
    ],
  },
};

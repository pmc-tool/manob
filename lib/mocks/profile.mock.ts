// CONTRACT: GET /user/profile
// This mock data structure matches the exact API response from manob.ai

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  about_me: string;
  avg_rating: number;
  total_reviews: number;
  profile_completion: number;
  city: string;
  zone: string;
  country: string;
  zip_code: string;
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
}

export interface LanguageOption {
  id: string;
  language_name: string;
}

// MOCK: Sample user profile data
export const mockUserProfile: UserProfile = {
  id: 'user-1',
  email: 'john.developer@example.com',
  first_name: 'John',
  last_name: 'Developer',
  profile_image: 'https://ui-avatars.com/api/?name=John+Developer&background=ea2725&color=fff&size=300',
  about_me:
    'I am a passionate full-stack developer with over 8 years of experience in building scalable web applications. My expertise spans React, Next.js, Node.js, and cloud technologies. I love turning complex problems into simple, beautiful solutions. When I\'m not coding, you\'ll find me exploring new technologies, contributing to open source projects, or mentoring junior developers. I believe in clean code, test-driven development, and continuous learning.',
  avg_rating: 4.8,
  total_reviews: 156,
  profile_completion: 85,
  city: 'San Francisco',
  zone: 'California',
  country: 'United States',
  zip_code: '94102',
  languages: [
    { language_id: 1, language_name: 'English', level: 'NATIVE' },
    { language_id: 2, language_name: 'Spanish', level: 'INTERMEDIATE' },
    { language_id: 3, language_name: 'German', level: 'BEGINNER' },
  ],
  skills: [
    { skill_id: 1, skill_name: 'React' },
    { skill_id: 2, skill_name: 'Next.js' },
    { skill_id: 3, skill_name: 'TypeScript' },
    { skill_id: 4, skill_name: 'Node.js' },
    { skill_id: 5, skill_name: 'PostgreSQL' },
    { skill_id: 6, skill_name: 'AWS' },
    { skill_id: 7, skill_name: 'Docker' },
    { skill_id: 8, skill_name: 'GraphQL' },
  ],
  badges: [
    { badge_icon: '/images/badges/top-rated.png', badge_name: 'Top Rated' },
    { badge_icon: '/images/badges/fast-delivery.png', badge_name: 'Fast Delivery' },
  ],
  member_since: 'Jan 2020',
  seller_level: 'Pro',
  response_time: '1 hour',
};

// MOCK: Language options for dropdown
export const mockLanguageOptions: LanguageOption[] = [
  { id: '1', language_name: 'English' },
  { id: '2', language_name: 'Spanish' },
  { id: '3', language_name: 'German' },
  { id: '4', language_name: 'French' },
  { id: '5', language_name: 'Chinese' },
  { id: '6', language_name: 'Japanese' },
  { id: '7', language_name: 'Korean' },
  { id: '8', language_name: 'Portuguese' },
  { id: '9', language_name: 'Arabic' },
  { id: '10', language_name: 'Hindi' },
];

// MOCK: Skill search results
export const mockSkillOptions = [
  { id: 1, name: 'React' },
  { id: 2, name: 'Next.js' },
  { id: 3, name: 'TypeScript' },
  { id: 4, name: 'JavaScript' },
  { id: 5, name: 'Node.js' },
  { id: 6, name: 'Python' },
  { id: 7, name: 'Django' },
  { id: 8, name: 'PostgreSQL' },
  { id: 9, name: 'MongoDB' },
  { id: 10, name: 'AWS' },
  { id: 11, name: 'Docker' },
  { id: 12, name: 'Kubernetes' },
  { id: 13, name: 'GraphQL' },
  { id: 14, name: 'REST API' },
  { id: 15, name: 'CSS' },
  { id: 16, name: 'Tailwind CSS' },
  { id: 17, name: 'UI/UX Design' },
  { id: 18, name: 'Figma' },
  { id: 19, name: 'Vue.js' },
  { id: 20, name: 'Angular' },
];

// MOCK: Search skills function
export const searchSkills = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return mockSkillOptions.filter((skill) =>
    skill.name.toLowerCase().includes(lowerQuery)
  );
};

// CONTRACT: GET /user/reviews response
export interface UserReview {
  id: string;
  reviewer_name: string;
  reviewer_image: string;
  rating: number;
  content: string;
  created_at: string;
  helpful_count: number;
  author_reply?: string;
  author_reply_date?: string;
}

// MOCK: User reviews
export const mockUserReviews: UserReview[] = [
  {
    id: 'review-1',
    reviewer_name: 'Sarah Wilson',
    reviewer_image: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random',
    rating: 5,
    content:
      'John delivered exceptional work on our React project. His code quality and attention to detail were outstanding. Communication was great throughout the project.',
    created_at: '2024-01-15',
    helpful_count: 12,
    author_reply: 'Thank you so much for the kind words, Sarah! It was a pleasure working with you.',
    author_reply_date: '2024-01-16',
  },
  {
    id: 'review-2',
    reviewer_name: 'Mike Chen',
    reviewer_image: 'https://ui-avatars.com/api/?name=Mike+Chen&background=random',
    rating: 5,
    content:
      'Fantastic developer! Completed the project ahead of schedule and went above and beyond to ensure everything was perfect.',
    created_at: '2024-01-10',
    helpful_count: 8,
  },
  {
    id: 'review-3',
    reviewer_name: 'Emma Thompson',
    reviewer_image: 'https://ui-avatars.com/api/?name=Emma+Thompson&background=random',
    rating: 4,
    content:
      'Great work overall. Very professional and knowledgeable. Would definitely hire again for future projects.',
    created_at: '2024-01-05',
    helpful_count: 5,
  },
];

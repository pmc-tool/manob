// API functions for user profile
// CONTRACT: GET /user/profile/:username

import { mockPublicProfiles, type PublicUserProfile } from '@/lib/mocks/public-profile.mock';

// MOCK: Get public user profile by username
// Will be replaced with actual API call
export function getPublicUserProfile(username: string): PublicUserProfile | null {
  // Return existing mock profile if found
  if (mockPublicProfiles[username]) {
    return mockPublicProfiles[username];
  }

  // Generate a fallback profile for any username (for demo purposes)
  // In production, this would return null and trigger a 404
  const displayName = username
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    id: `user-${username}`,
    user_name: username,
    first_name: displayName.split(' ')[0] || 'User',
    last_name: displayName.split(' ').slice(1).join(' ') || '',
    profile_image: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&color=fff&size=300`,
    about_me: 'This user profile is currently being set up. Check back later for more information.',
    avg_rating: 0,
    total_reviews: 0,
    completed_orders: 0,
    city: '',
    country: '',
    languages: [],
    skills: [],
    badges: [],
    member_since: new Date().toISOString(),
    seller_level: '',
    response_time: 'N/A',
    last_delivery: 'N/A',
    reviews: [],
    services: [],
    products: [],
  };
}

// MOCK: Get user's services
export function getUserServices(userId: string) {
  // Will fetch from API
  return [];
}

// MOCK: Get user's products
export function getUserProducts(userId: string) {
  // Will fetch from API
  return [];
}

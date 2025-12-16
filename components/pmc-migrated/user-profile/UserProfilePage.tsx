// Public User Profile Page Component
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  MapPin,
  Clock,
  CheckCircle,
  Calendar,
  MessageCircle,
  Globe,
  Award,
  ShoppingBag,
  Briefcase,
  ThumbsUp
} from 'lucide-react';
import { PmcButton } from '@/components/ui/pmc-button';
import type { PublicUserProfile } from '@/lib/mocks/public-profile.mock';

interface UserProfilePageProps {
  profile: PublicUserProfile;
}

export default function UserProfilePage({ profile }: UserProfilePageProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const formatReviewDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Image
              src={profile.profile_image}
              alt={`${profile.first_name} ${profile.last_name}`}
              width={150}
              height={150}
              className="rounded-full object-cover border-4 border-gray-100"
              unoptimized
            />
          </div>

          {/* Profile Info */}
          <div className="flex-grow">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.first_name} {profile.last_name}
              </h1>
              {profile.seller_level && (
                <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full font-medium">
                  {profile.seller_level}
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-3">@{profile.user_name}</p>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold text-lg">{profile.avg_rating.toFixed(1)}</span>
                <span className="text-gray-500">({profile.total_reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <ShoppingBag className="h-4 w-4" />
                <span>{profile.completed_orders} orders completed</span>
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}, {profile.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Member since {formatDate(profile.member_since)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Responds in {profile.response_time}</span>
              </div>
            </div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <div className="flex gap-2 mt-4 flex-wrap">
                {profile.badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-sm"
                    title={badge.badge_name}
                  >
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-gray-700">{badge.badge_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Button */}
          <div className="flex-shrink-0 self-start">
            <PmcButton
              variant="primary"
              icon={<MessageCircle className="h-4 w-4" />}
              onClick={() => console.log('Contact seller')}
            >
              Contact Me
            </PmcButton>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - About & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{profile.about_me}</p>
          </div>

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill.skill_id}
                    className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm"
                  >
                    {skill.skill_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {profile.services && profile.services.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Services
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.services.map((service) => (
                  <Link
                    key={service.id}
                    href={`/service-details/${service.id}`}
                    className="block group"
                  >
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary line-clamp-2 text-sm">
                          {service.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span>{service.rating}</span>
                            <span className="text-gray-400">({service.reviews_count})</span>
                          </div>
                          <span className="font-semibold text-primary">
                            From ${service.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {profile.products && profile.products.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product-details/${product.id}`}
                    className="block group"
                  >
                    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-32">
                        <Image
                          src={product.image}
                          alt={product.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary line-clamp-2 text-sm">
                          {product.title}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span>{product.rating}</span>
                            <span className="text-gray-400">({product.sales_count} sales)</span>
                          </div>
                          <span className="font-semibold text-primary">
                            ${product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Reviews ({profile.total_reviews})
            </h2>
            {profile.reviews && profile.reviews.length > 0 ? (
              <div className="space-y-6">
                {profile.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-start gap-3">
                      <Link href={`/${review.reviewer_username}`}>
                        <Image
                          src={review.reviewer_image}
                          alt={review.reviewer_name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </Link>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-1">
                          <Link
                            href={`/${review.reviewer_username}`}
                            className="font-medium text-gray-900 hover:text-primary"
                          >
                            {review.reviewer_name}
                          </Link>
                          <span className="text-sm text-gray-500">
                            {formatReviewDate(review.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm">{review.content}</p>
                        {review.helpful_count > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <ThumbsUp className="h-3.5 w-3.5" />
                            <span>{review.helpful_count} found this helpful</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet</p>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar Info */}
        <div className="space-y-6">
          {/* Seller Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Seller Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response time</span>
                <span className="font-medium">{profile.response_time}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Last delivery</span>
                <span className="font-medium">{profile.last_delivery}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Orders completed</span>
                <span className="font-medium">{profile.completed_orders}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Member since</span>
                <span className="font-medium">{formatDate(profile.member_since)}</span>
              </div>
            </div>
          </div>

          {/* Languages Card */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages
              </h3>
              <div className="space-y-2">
                {profile.languages.map((lang) => (
                  <div key={lang.language_id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-900">{lang.language_name}</span>
                    <span className="text-gray-500 capitalize">{lang.level.toLowerCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Location Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <p className="text-gray-600">
              {profile.city}, {profile.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Seller Card component for service details (matching original PMC design)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Clock, CheckCircle, MessageCircle, ArrowUpRight } from 'lucide-react';

interface SellerCardProps {
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
    badges?: Array<{ badge_icon: string; badge_name: string }>;
  };
  onContactClick?: () => void;
}

export default function SellerCard({ seller, onContactClick }: SellerCardProps) {
  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const handleContactClick = () => {
    if (onContactClick) {
      onContactClick();
    } else {
      console.log('Contact seller clicked');
    }
  };

  return (
    <div className="seller-card mb-4 p-4 relative rounded-lg shadow bg-white">
      {/* Seller Header */}
      <div className="flex items-start gap-3 mb-4">
        <Link href={`/${seller.user_name}`} className="flex-shrink-0">
          <Image
            src={seller.profile_image}
            alt={`${seller.first_name} ${seller.last_name}`}
            width={80}
            height={80}
            className="rounded-full object-cover border-2 border-gray-100"
            unoptimized
          />
        </Link>
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <Link href={`/${seller.user_name}`} className="font-bold fz18 hover:text-primary">
              {seller.first_name} {seller.last_name}
            </Link>
            {seller.level && (
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded font-medium">
                {seller.level}
              </span>
            )}
          </div>
          <p className="text-gray-500 fz14 mb-2">@{seller.user_name}</p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold">{seller.avg_rating.toFixed(1)}</span>
              <span className="text-gray-500 fz13">({seller.total_reviews})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="seller-info border-t border-b py-3 mb-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>From</span>
          </span>
          <span className="font-medium">{seller.country}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-gray-600">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>Member since</span>
          </span>
          <span className="font-medium">{formatMemberSince(seller.member_since)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>Avg. response time</span>
          </span>
          <span className="font-medium">{seller.response_time}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Last delivery</span>
          <span className="font-medium">{seller.last_delivery}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Languages</span>
          <span className="font-medium">{seller.languages.join(', ')}</span>
        </div>
      </div>

      {/* Seller Description */}
      <p className="text-gray-600 fz14 mb-4 line-clamp-4">{seller.description}</p>

      {/* Badges */}
      {seller.badges && seller.badges.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {seller.badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded text-xs"
              title={badge.badge_name}
            >
              <Image
                src={badge.badge_icon}
                alt={badge.badge_name}
                width={16}
                height={16}
                className="object-contain"
                unoptimized
              />
              <span className="text-gray-600">{badge.badge_name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid gap-2">
        <button
          onClick={handleContactClick}
          className="ud-btn btn-thm w-full"
        >
          <MessageCircle className="h-4 w-4" />
          Contact Me
        </button>
        <Link
          href={`/${seller.user_name}`}
          className="ud-btn btn-soft-primary w-full"
        >
          View Profile
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import { Rate } from 'antd';
import { TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileCardProps {
  profileImage?: string;
  name: string;
  rating: number;
  sellerLevel: string;
  memberSince: string;
  responseTime: string;
  profileLink: string;
}

export default function ProfileCard({
  profileImage,
  name,
  rating,
  sellerLevel,
  memberSince,
  responseTime,
  profileLink,
}: ProfileCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Cover gradient */}
      <div className="h-20 bg-gradient-to-r from-primary/80 to-primary" />

      {/* Profile content */}
      <div className="px-4 pb-4 text-center relative">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 mx-auto -mt-10 relative overflow-hidden shadow-md">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500 bg-gray-100">
              {getInitials(name)}
            </div>
          )}
        </div>

        {/* Name & Rating */}
        <h5 className="text-lg font-semibold text-gray-900 mt-3 mb-1">{name}</h5>
        <div className="flex items-center justify-center gap-2 mb-4">
          <Rate disabled allowHalf value={rating} className="text-sm" />
          <span className="text-sm text-gray-500">({rating?.toFixed(1) || 0})</span>
        </div>

        {/* Info Items */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <TrendingUp size={16} />
              Seller Level
            </span>
            <span className="font-medium text-gray-900">{sellerLevel || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <Users size={16} />
              Member Since
            </span>
            <span className="font-medium text-gray-900">{memberSince || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <Clock size={16} />
              Response Time
            </span>
            <span className="font-medium text-gray-900">{responseTime || 'N/A'}</span>
          </div>
        </div>

        {/* View Profile Link */}
        <Link
          href={profileLink}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-primary hover:text-primary/80 border-t border-gray-100 pt-4 transition-colors"
        >
          VIEW PROFILE
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

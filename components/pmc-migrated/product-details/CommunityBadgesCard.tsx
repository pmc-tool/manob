// Community Badges Card component (matching original PMC design exactly)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, BadgeCheck } from 'lucide-react';
import { PmcButton, SecondaryButton } from '@/components/ui/pmc-button';

interface Badge {
  badge_icon: string;
  badge_name: string;
}

interface UserMeta {
  sub: string;
  first_name: string;
  last_name: string;
  user_name: string;
  profile_image: string;
  member_since: string;
}

interface CommunityBadgesCardProps {
  logoSrc?: string;
  memberName?: string;
  memberSince?: string;
  badges?: Badge[];
  profileLink?: string;
  userMeta?: UserMeta | null;
  onMessageClick?: () => void;
}

export default function CommunityBadgesCard({
  logoSrc,
  memberName,
  memberSince,
  badges,
  profileLink,
  userMeta,
  onMessageClick,
}: CommunityBadgesCardProps) {
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toDateString();
  };

  // Generate initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const handleMessageClick = () => {
    if (onMessageClick) {
      onMessageClick();
    } else {
      // Default behavior - could navigate to messages or show a modal
      console.log('Message to seller clicked');
    }
  };

  return (
    <div className="mb-4 p-3 sm:p-4 relative rounded-lg shadow bg-white">
      <div className="flex">
        {/* Avatar */}
        <div className="relative shrink-0">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={memberName || 'Member'}
              width={46}
              height={46}
              className="rounded object-cover"
              unoptimized
            />
          ) : (
            <div className="w-[46px] h-[46px] rounded bg-red-100 flex items-center justify-center text-primary font-semibold">
              {getInitials(memberName)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-grow ml-3">
          <h5 className="font-bold text-[19px] mb-0">
            {memberName}
            <BadgeCheck size={20} className="text-green-500 ml-1 inline-block" />
          </h5>
          <p className="mb-0 text-gray-600 text-sm">Member since {formatMemberSince(memberSince)}</p>

          {/* Badges */}
          {badges && badges.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {badges.map((badge, index) => (
                <Image
                  key={index}
                  src={badge.badge_icon}
                  alt={badge.badge_name}
                  width={30}
                  height={34}
                  className="object-contain"
                  unoptimized
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {(profileLink || userMeta) && (
        <div className="grid mt-4 gap-3">
          {profileLink && (
            <Link href={`/${profileLink}`}>
              <SecondaryButton fullWidth icon={<ArrowUpRight size={16} />} iconPosition="end">
                View Profile
              </SecondaryButton>
            </Link>
          )}
          {userMeta && (
            <PmcButton
              variant="primary"
              fullWidth
              onClick={handleMessageClick}
              icon={<MessageCircle size={16} />}
              iconPosition="end"
            >
              Message to seller
            </PmcButton>
          )}
        </div>
      )}
    </div>
  );
}

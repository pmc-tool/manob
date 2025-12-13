// Community Badges Card component (matching original PMC design exactly)
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, MessageCircle, BadgeCheck } from 'lucide-react';

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
    // Original: mb-4 p-3 p-lg-3 p-sm-4 p-xl-4 position-relative rounded-3 shadow
    <div className="mb-4 p-3 sm:p-4 relative rounded-3 shadow bg-white">
      {/* Original: d-flex */}
      <div className="flex">
        {/* Avatar - Original: thumb position-relative */}
        <div className="thumb relative flex-shrink-0">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt={memberName || 'Member'}
              width={46}
              height={46}
              className="rounded-2 object-cover"
              unoptimized
            />
          ) : (
            <div className="w-[46px] h-[46px] rounded-2 bg-red-100 flex items-center justify-center text-primary font-semibold">
              {getInitials(memberName)}
            </div>
          )}
        </div>

        {/* Info - Original: flex-grow-1 ms-3 */}
        <div className="flex-grow ms-3">
          {/* Original: fw-bold fz19 mb-0 */}
          <h5 className="fw-bold fz19 mb-0">
            {memberName}
            <BadgeCheck size={20} className="text-green-500 ms-1 inline-block" />
          </h5>
          <p className="mb-0">Member since {formatMemberSince(memberSince)}</p>

          {/* Badges - Original: community-badges d-flex gap-2 flex-wrap */}
          {badges && badges.length > 0 && (
            <div className="community-badges flex gap-2 flex-wrap">
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

      {/* Action Buttons - Original: d-grid mt-4 gap-3 */}
      {(profileLink || userMeta) && (
        <div className="grid mt-4 gap-3">
          {profileLink && (
            <Link
              href={`/${profileLink}`}
              className="ud-btn btn-soft-primary w-full"
            >
              View Profile
              <ArrowUpRight size={16} className="ms-2 inline-block" />
            </Link>
          )}
          {userMeta && (
            <button
              onClick={handleMessageClick}
              className="ud-btn btn-thm w-full"
            >
              Message to seller
              <MessageCircle size={16} className="ms-2 inline-block" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

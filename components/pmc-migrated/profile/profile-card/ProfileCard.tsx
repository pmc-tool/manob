// MIGRATION: ProfileCard component from manob.ai
'use client';

import Link from 'next/link';
import { TrendingUp, Users, Clock, ArrowUpRight } from 'lucide-react';
import { Avatar } from '@/components/pmc-migrated/shared/avatar';
import { ReviewStars } from '@/components/pmc-migrated/marketplace/review-stars';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  profileImage: string;
  name: string;
  rating: number;
  reviewsCount?: number;
  sellerLevel: string;
  memberSince: string;
  responseTime: string;
  profileLink: string;
}

export default function ProfileCard({
  profileImage,
  name,
  rating,
  reviewsCount = 0,
  sellerLevel,
  memberSince,
  responseTime,
  profileLink,
}: ProfileCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.coverImage} />

      <div className={styles.avatarWrapper}>
        <Avatar avatar={profileImage} username={name} size={96} className={styles.avatar} />
      </div>

      <h5 className={styles.name}>{name}</h5>

      <div className={styles.rating}>
        <ReviewStars rating={rating} reviewCount={reviewsCount} size={14} />
      </div>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <TrendingUp size={17} />
          </span>
          <span className={styles.infoLabel}>Seller Level</span>
          <span className={styles.infoValue}>{sellerLevel}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <Users size={17} />
          </span>
          <span className={styles.infoLabel}>Member Since</span>
          <span className={styles.infoValue}>{memberSince}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoIcon}>
            <Clock size={17} />
          </span>
          <span className={styles.infoLabel}>Response Time</span>
          <span className={styles.infoValue}>{responseTime}</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Link href={profileLink} className={styles.viewProfile}>
          <span>View Profile</span>
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </div>
  );
}

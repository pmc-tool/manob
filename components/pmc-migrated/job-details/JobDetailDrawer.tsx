// JobDetailDrawer - migrated from PMC (matching original design exactly)
"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Drawer } from "antd";
import {
  X,
  ExternalLink,
  Clock,
  MapPin,
  Tag,
  Grid3X3,
  Calendar,
  Info,
  BadgeCheck,
  Star,
} from "lucide-react";
import {
  JobDetails,
  calculateTimeAgo,
  calculateDeadline,
  formatDate,
} from "@/lib/mocks/job-list.mock";
import { useAuth } from "@/context/AuthContext";
import styles from "./JobDetailDrawer.module.css";

const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || "";

interface JobDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: JobDetails | null;
  onBidClick?: () => void;
}

export default function JobDetailDrawer({
  isOpen,
  onClose,
  jobData,
  onBidClick,
}: JobDetailDrawerProps) {
  const { isAuthenticated, user, openLoginModal } = useAuth();

  const isJobOwner = user?.id === jobData?.owner_meta?.id;

  const cleanedDescription = useMemo(() => {
    if (!jobData?.description) return "";
    // Strip HTML if present and clean up
    const parser =
      typeof window !== "undefined" ? new DOMParser() : null;
    if (parser) {
      const doc = parser.parseFromString(jobData.description, "text/html");
      return doc.body.innerHTML.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "").trim();
    }
    return jobData.description;
  }, [jobData?.description]);

  const handleBidClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (onBidClick) {
      onBidClick();
    }
  };

  if (!jobData) return null;

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      placement="right"
      width={1040}
      closable={false}
      className={styles.jobDetailDrawer}
      styles={{ body: { padding: 0 } }}
    >
      {/* Header */}
      <div className={styles.drawerHeader}>
        {jobData.status === "OPEN" ? (
          <Link
            href={`/job-details/${jobData.slug}`}
            target="_blank"
            className={styles.drawerHeaderLink}
          >
            <ExternalLink size={20} />
            Open job in a new window
          </Link>
        ) : (
          <span className={styles.drawerHeaderLink}>Job Details</span>
        )}
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      {/* Body */}
      <div className={styles.drawerBody}>
        {/* Status alerts */}
        {jobData.status !== "OPEN" && (
          <div className={styles.alertWarning}>
            <Info size={26} className="flex-shrink-0" />
            <div>
              <h5>This job is currently {jobData.status.replace("_", " ")}.</h5>
              <div>You can take action accordingly.</div>
            </div>
          </div>
        )}

        {isJobOwner && (
          <div className={styles.alertWarning}>
            <Info size={26} className="flex-shrink-0" />
            <div>
              <h5>This job item is yours!</h5>
              <div>
                This job is assigned by you. Review details and take action as
                needed.
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 lg:pr-6">
            {/* Title & Meta */}
            <h3 className={styles.jobTitle}>{jobData.title}</h3>
            <div className={styles.jobMeta}>
              <div>
                <span className="italic mr-2">By</span>
                <Link
                  href={`/${jobData.owner_meta?.user_name}`}
                  className="text-primary font-medium"
                >
                  {jobData.owner_meta?.first_name} {jobData.owner_meta?.last_name}
                </Link>
              </div>
              <div className={styles.jobMetaItem}>
                <Clock size={16} />
                <span className="text-gray-500">Posted</span>
                <span className="font-semibold ml-1">
                  {calculateTimeAgo(jobData.created_at)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div
              className={`mt-4 ${styles.jobDes}`}
              dangerouslySetInnerHTML={{ __html: cleanedDescription }}
            />

            {/* Job Overview */}
            <div className="mt-8">
              <h4 className={styles.sectionTitle}>Job Overview</h4>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <Tag size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      ${jobData.service_price}
                    </div>
                    <div className={styles.overviewLabel}>Price</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <Grid3X3 size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      {jobData.primary_category?.title || jobData.category_meta?.title}
                    </div>
                    <div className={styles.overviewLabel}>Category</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <Clock size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      {jobData.delivery_time}{" "}
                      {jobData.delivery_time > 1
                        ? jobData.delivery_time_type + "S"
                        : jobData.delivery_time_type}
                    </div>
                    <div className={styles.overviewLabel}>Delivery Time</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <Clock size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      {jobData.experience_level
                        ? jobData.experience_level.charAt(0).toUpperCase() +
                          jobData.experience_level.slice(1).toLowerCase()
                        : ""}
                    </div>
                    <div className={styles.overviewLabel}>Experience Level</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            {jobData.skills && jobData.skills.length > 0 && (
              <div className="mt-8">
                <h4 className={styles.sectionTitle}>Skill & Experience</h4>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills.map((skill) => (
                    <span key={skill.id} className={styles.skillTag}>
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Activity on job */}
            <div className="mt-8">
              <h4 className={styles.sectionTitle}>Activity on this job</h4>
              <div className={styles.overviewGrid}>
                <div className={styles.overviewItem}>
                  <Tag size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      ${jobData.avg_bid_price || 0}
                    </div>
                    <div className={styles.overviewLabel}>Avg Bid Price</div>
                  </div>
                </div>
                <div className={styles.overviewItem}>
                  <Grid3X3 size={21} className={styles.overviewIcon} />
                  <div>
                    <div className={styles.overviewValue}>
                      {jobData.total_bids || 0}
                    </div>
                    <div className={styles.overviewLabel}>Total bidding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Not logged in card */}
            {!isAuthenticated && (
              <div className={`${styles.sidebarCard} hidden lg:block`}>
                <h5 className="font-semibold mb-3">
                  Explore opportunities for free
                </h5>
                <Link href="/auth" className={styles.bidButton}>
                  Sign up
                </Link>
                <div className="text-sm mt-2 text-center text-gray-500">
                  Already have an account?{" "}
                  <Link
                    href="/auth/sign-in"
                    className="font-semibold text-primary underline"
                  >
                    Log in
                  </Link>
                </div>
              </div>
            )}

            {/* Logged in cards */}
            {isAuthenticated && (
              <>
                {/* Price & Job info card */}
                <div className={styles.sidebarCard}>
                  <div className="mb-3">
                    <div className="flex gap-3">
                      <MapPin size={18} className="text-gray-500" />
                      <div className="text-sm text-gray-500">
                        {jobData.owner_info?.country || "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="text-3xl font-bold">
                      ${jobData.service_price}
                    </div>
                    <div className="text-gray-500">Main Price</div>
                  </div>
                  <div className="flex mb-3">
                    <div className={styles.iconCircle}>
                      <Clock size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="font-bold flex items-center gap-2">
                        <span>
                          {jobData.job_type
                            ? jobData.job_type.charAt(0).toUpperCase() +
                              jobData.job_type.slice(1).toLowerCase()
                            : "Regular"}
                        </span>
                        {jobData.job_type === "LIVE" && (
                          <div
                            className={`${styles.pulsatingDot} ${styles.positive}`}
                          />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Job type</div>
                    </div>
                  </div>
                  <div className="flex mb-3">
                    <div className={styles.iconCircle}>
                      <Calendar size={16} />
                    </div>
                    <div className="ml-3">
                      <div className="font-bold">
                        {calculateDeadline(
                          jobData.delivery_time,
                          jobData.delivery_time_type
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Application Deadline
                      </div>
                    </div>
                  </div>
                  {!isJobOwner && (
                    <button
                      onClick={handleBidClick}
                      className={`${styles.bidButton} hidden lg:block`}
                      disabled={jobData.is_bidded}
                    >
                      {jobData.is_bidded ? "Already Submitted Bid" : "Bid Now"}
                    </button>
                  )}
                </div>

                {/* Buyer card */}
                {!isJobOwner && jobData.owner_info && (
                  <div className={styles.sidebarCard}>
                    <div className={styles.buyerCard}>
                      <Image
                        src={
                          jobData.owner_info.profile_image
                            ? `${S3_BUCKET}/${jobData.owner_info.profile_image}`
                            : "/images/default-avatar.png"
                        }
                        width={56}
                        height={56}
                        alt={`${jobData.owner_info.first_name}`}
                        className={styles.buyerAvatar}
                      />
                      <div>
                        <div className={styles.buyerName}>
                          {jobData.owner_info.first_name}{" "}
                          {jobData.owner_info.last_name}
                          {jobData.owner_info.isVerified && (
                            <BadgeCheck
                              size={18}
                              className={styles.verifiedBadge}
                            />
                          )}
                        </div>
                        {(jobData.owner_info.avg_rating || 0) > 0 && (
                          <div className="flex items-center gap-1 text-sm">
                            <Star
                              size={13}
                              className="fill-yellow-400 text-yellow-400"
                            />
                            <span>{jobData.owner_info.avg_rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <ul className="flex flex-wrap text-sm text-gray-500 mt-3 gap-x-4 gap-y-1">
                      <li>
                        Member Since{" "}
                        <span className="font-semibold text-gray-900">
                          {formatDate(jobData.owner_info.created_at)}
                        </span>
                      </li>
                      <li>
                        Country{" "}
                        <span className="font-semibold text-gray-900">
                          {jobData.owner_info.country}
                        </span>
                      </li>
                      <li>
                        Total Orders{" "}
                        <span className="font-semibold text-gray-900">
                          {jobData.owner_info.total_orders || 0}
                        </span>
                      </li>
                    </ul>
                    <Link
                      href={`/${jobData.owner_meta?.user_name}`}
                      className={`${styles.secondaryButton} mt-4`}
                    >
                      Learn more about buyer
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer for mobile */}
      {!isAuthenticated && (
        <div className={`${styles.drawerFooter} lg:hidden`}>
          <h5 className="text-center text-lg font-semibold mb-3">
            Explore opportunities for free.
          </h5>
          <Link href="/auth" className={styles.bidButton}>
            Sign up
          </Link>
          <div className="text-sm mt-2 text-center text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-semibold text-primary underline"
            >
              Log in
            </Link>
          </div>
        </div>
      )}

      {isAuthenticated && !isJobOwner && (
        <div className={`${styles.drawerFooter} lg:hidden`}>
          <h5 className="text-center text-lg font-semibold mb-3">
            Place your bid and showcase your skills to win this project.
          </h5>
          <button
            onClick={handleBidClick}
            className={styles.bidButton}
            disabled={jobData.is_bidded}
          >
            {jobData.is_bidded ? "Already Submitted Bid" : "Bid Job"}
          </button>
        </div>
      )}
    </Drawer>
  );
}

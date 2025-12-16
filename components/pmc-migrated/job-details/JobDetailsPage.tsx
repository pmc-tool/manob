// JobDetailsPage - migrated from PMC (matching original design exactly)
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import {
  JobDetails,
  mockBuyerDetails,
  getJobDetails,
  calculateTimeAgo,
  formatDate,
} from "@/lib/mocks/job-list.mock";
import { useAuth } from "@/context/AuthContext";
import JobCard from "../job-list/job-card";
import styles from "./JobDetailsPage.module.css";

const S3_BUCKET = process.env.NEXT_PUBLIC_S3BUCKET || "";

interface JobDetailsPageProps {
  slug: string;
}

export default function JobDetailsPage({ slug }: JobDetailsPageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated, user, openLoginModal } = useAuth();

  // Get job data from mock
  const jobData = getJobDetails(slug);
  const buyerDetails = mockBuyerDetails;
  const relatedJobData: JobDetails[] = []; // Empty for now

  const isJobOwner = user?.id === jobData?.owner_meta?.id;

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBidClick = () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    // TODO: Open bid modal
    console.log("Open bid modal");
  };

  if (!jobData) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Job not found
        </h2>
        <p className="text-gray-500 mb-4">
          The job you&apos;re looking for could not be found.
        </p>
        <Link
          href="/job-list"
          className="px-4 py-2 bg-primary text-white rounded hover:opacity-90"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className="bg-gray-100 px-4 py-4 md:py-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left">
              <div className="flex-1">
                <h3 className="text-2xl font-medium mb-2">{jobData.title}</h3>
                <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-gray-500">
                  <li>
                    Price{" "}
                    <span className="font-semibold text-gray-900">
                      ${jobData.service_price}
                    </span>
                  </li>
                  <li>
                    Posted{" "}
                    <span className="font-semibold text-gray-900">
                      {calculateTimeAgo(jobData.created_at)}
                    </span>
                  </li>
                  <li>
                    Total Bid{" "}
                    <span className="font-semibold text-gray-900">
                      {jobData.total_bids || 0}
                    </span>
                  </li>
                </ul>
              </div>
              {jobData.job_type === "LIVE" && (
                <div className="text-sm">
                  Application ends:{" "}
                  <span className="font-semibold">
                    {formatDate(jobData.created_at)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div
                className={`${styles.itemDescription} ${
                  isExpanded ? styles.isExpanded : ""
                }`}
                dangerouslySetInnerHTML={{ __html: jobData.description }}
              />

              {/* Skills */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Skill & Experience</h3>
                <div className="flex flex-wrap gap-2">
                  {jobData.skills?.map((skill) => (
                    <span
                      key={skill.id}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm capitalize"
                    >
                      {skill.title}
                    </span>
                  ))}
                </div>
              </div>

              {/* Show more/less - mobile only */}
              <div className="mt-4 lg:hidden">
                <button
                  type="button"
                  onClick={toggleContent}
                  className="flex items-center justify-center gap-1 w-full text-primary font-semibold bg-transparent border-0"
                >
                  {isExpanded ? "Show Less" : "Show More"}
                  {isExpanded ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </button>
              </div>

              {/* Bid Button */}
              {!isJobOwner && (
                <div className="mt-6 lg:mt-8">
                  <button
                    type="button"
                    onClick={handleBidClick}
                    disabled={jobData.is_bidded}
                    className={styles.bidButton}
                  >
                    {jobData.is_bidded ? "Already Submitted Bid" : "Bid on the job"}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1 lg:pl-6">
              {/* Job Overview Card */}
              <div className={styles.sidebarCard}>
                <h5 className="text-lg font-semibold border-b pb-3 mb-4">
                  Job Overview
                </h5>
                <ul className="flex flex-col gap-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Price</span>
                    <span className="font-medium">${jobData.service_price || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Delivery Time</span>
                    <span className="font-medium">
                      {jobData.delivery_time || 0}{" "}
                      {jobData.delivery_time > 1
                        ? jobData.delivery_time_type + "S"
                        : jobData.delivery_time_type || ""}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Experience Level</span>
                    <span className="font-medium">
                      {jobData.experience_level
                        ? jobData.experience_level.charAt(0).toUpperCase() +
                          jobData.experience_level.slice(1).toLowerCase()
                        : ""}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">
                      {jobData.category_meta?.title}
                    </span>
                  </li>
                </ul>
                {!isJobOwner && (
                  <div className="border-t pt-4 mt-4">
                    <button
                      type="button"
                      onClick={handleBidClick}
                      disabled={jobData.is_bidded}
                      className={styles.secondaryButton}
                    >
                      {jobData.is_bidded ? "Already Submitted Bid" : "Bid on the job"}
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                )}
              </div>

              {/* Employer Card */}
              <div className={styles.sidebarCard}>
                <h5 className="text-lg font-semibold border-b pb-3 mb-4">
                  Employer
                </h5>
                <ul className="flex flex-col gap-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-500">Hire Rate</span>
                    <span className="font-medium">{buyerDetails.hire_rate || 0}%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Total Expense</span>
                    <span className="font-medium">
                      ${buyerDetails.total_spent?.toLocaleString() || 0}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Total Job Post</span>
                    <span className="font-medium">{buyerDetails.total_jobs || 0}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Total Complete Projects</span>
                    <span className="font-medium">
                      {buyerDetails.total_projects || 0}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-500">Member Since</span>
                    <span className="font-medium">
                      {formatDate(buyerDetails.member_since)}
                    </span>
                  </li>
                </ul>
                <div className="border-t pt-4 mt-4">
                  <Link
                    href={`/${jobData.owner_meta?.user_name}`}
                    className={styles.secondaryButton}
                  >
                    {isJobOwner ? "View My Profile" : "View Buyer Profile"}
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Jobs */}
      {relatedJobData.length > 0 && (
        <section className="py-8 border-t">
          <div className="container mx-auto px-4">
            <div className="lg:w-2/3">
              <h3 className="text-xl font-semibold mb-4">Related Jobs</h3>
              {relatedJobData.map((cardData, idx) => (
                <JobCard
                  key={cardData.id}
                  id={cardData.id}
                  posted={calculateTimeAgo(cardData.created_at)}
                  salary={cardData.service_price}
                  title={cardData.title}
                  description={cardData.description}
                  days={`${cardData.delivery_time} ${cardData.delivery_time_type}`}
                  level={cardData.experience_level}
                  totalBids={cardData.total_bids}
                  url={`/job-details/${cardData.slug}`}
                  status={cardData.status}
                  jobType={cardData.job_type}
                  skills={cardData.skills || []}
                  idx={idx}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// JobCard - migrated from PMC (matching original design exactly)
"use client";

import { Orbitron } from "next/font/google";
import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import styles from "./JobCard.module.css";
import { GhostButton, SecondaryButton } from "@/components/ui/pmc-button";

const orbitron = Orbitron({
  subsets: ["latin"],
  display: "swap",
});

interface JobCardProps {
  id?: number | string;
  posted: string;
  salary: string | number;
  title: string;
  description: string;
  days?: string;
  level: string;
  totalBids: string | number;
  status?: string;
  showButtons?: boolean;
  cancelButton?: boolean;
  targetDate?: any;
  jobType?: string;
  skills?: { id: string; title: string }[];
  idx?: number;
  url?: string;
  onDelete?: (id: any) => void;
  onCancel?: () => void;
  handleDrawer?: (id: any) => void;
}

export default function JobCard({
  id,
  posted,
  salary,
  title,
  description,
  days,
  level,
  totalBids,
  status = "",
  targetDate = "",
  showButtons = false,
  cancelButton = false,
  jobType,
  skills = [],
  idx,
  url,
  onDelete = () => {},
  onCancel,
  handleDrawer = () => {},
}: JobCardProps) {
  // Map status to CSS module classes
  const statusClass = jobType ? styles[jobType.trim().toLowerCase()] : "";
  const idxClass =
    idx === 0 ? styles["active"] : idx === 1 ? styles["activeYellow"] : "";

  const getTruncatedDescription = () => {
    // Strip HTML tags
    const plainText = description.replace(/<[^>]*>/g, "");
    if (plainText.length > 500) {
      return plainText.slice(0, 300) + "...";
    }
    return plainText;
  };

  return (
    <>
      <div
        className={`${styles.jobListCard} items-start border mb-3 overflow-hidden p-3 lg:p-4 relative rounded-2xl shadow ${statusClass ?? ""} ${idxClass}`}
      >
        <div
          onClick={() => handleDrawer(id)}
          className="absolute inset-0 cursor-pointer z-0"
        ></div>

        <div className="absolute bottom-0 right-0 mb-1 md:mb-2 mr-3 text-sm">
          Posted: {posted}
        </div>
        <div className="pb-1 flex gap-2">
          <span className="text-[17px] font-medium text-gray-900">${salary}</span>
          {status === "HIRED" && (
            <span
              className={`border-2 inline-flex border-green-600 text-green-600 font-bold ${styles.hired}`}
            >
              <div className="px-1 border-r-2 border-green-600">
                <Check size={18} />
              </div>
              <div className="px-2">HIRED</div>
            </span>
          )}
        </div>
        <h5 className="text-lg font-semibold">{title}</h5>
        <p
          className={`text-sm leading-relaxed mb-2 text-gray-500 hidden sm:block ${styles.jobDes}`}
        >
          <span>{getTruncatedDescription()}</span>
        </p>
        <div className="border-t mt-3 pt-3">
          <ul className="flex items-center flex-wrap gap-x-4 gap-y-1 mb-2 text-gray-500 text-sm">
            <li>
              Delivery{" "}
              <span className="font-semibold text-gray-900">
                {days
                  ? String(days).toLowerCase().charAt(0).toUpperCase() +
                    String(days).toLowerCase().slice(1)
                  : ""}
              </span>
            </li>
            <li>
              <span className="font-semibold text-gray-900">
                {level
                  ? String(level).toLowerCase().charAt(0).toUpperCase() +
                    String(level).toLowerCase().slice(1)
                  : ""}
              </span>
            </li>
            <li>
              Total Bidding:{" "}
              <span className="font-semibold text-gray-900">{totalBids || 0}</span>
            </li>
          </ul>
          {skills?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {skills.map((sk) => (
                <p
                  key={sk.id}
                  className={`px-3 py-1 rounded-full ${styles.cardTag}`}
                >
                  {sk.title}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Live job countdown placeholder */}
        {targetDate && jobType === "LIVE" && (
          <div className="absolute right-0 mr-4 my-2 lg:mt-3 top-0">
            <span className={`${orbitron.className} bg-orange-500 text-white text-xs px-2 py-1 rounded`}>
              LIVE
            </span>
          </div>
        )}

        {(showButtons === true || cancelButton === true) && (
          <div className="flex gap-1 relative z-10 mb-2 mt-3 sm:mb-0">
            {showButtons && (
              <>
                {status !== "HIRED" && (
                  <GhostButton
                    onClick={() => onDelete(id)}
                    title="Delete"
                    icon={<Trash2 size={16} />}
                    className={styles.btnSoftPrimary}
                  />
                )}
                <Link href={`/user/freelancer-list/${id}`}>
                  <SecondaryButton className={`text-sm font-semibold ${styles.btnSoftPrimary}`}>
                    See Bidding
                  </SecondaryButton>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

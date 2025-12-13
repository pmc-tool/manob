// JobCard - migrated from PMC (matching original design exactly)
"use client";

import { Orbitron } from "next/font/google";
import Link from "next/link";
import { Check, Trash2 } from "lucide-react";
import styles from "./JobCard.module.css";

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
        className={`${styles.jobListCard} align-items-start border mb-3 overflow-hidden p-3 p-lg-4 position-relative rounded-4 shadow ${statusClass ?? ""} ${idxClass}`}
      >
        <div
          onClick={() => handleDrawer(id)}
          className="stretched-link curp"
        ></div>

        <div className="bottom-0 end-0 mb-1 mb-md-2 me-3 position-absolute small">
          Posted: {posted}
        </div>
        <div className="pb-1 d-flex gap-2">
          <span className="fz17 fw-medium text-dark">${salary}</span>
          {status === "HIRED" && (
            <span
              className={`border d-inline-flex border-success border-2 text-success fw-bold ${styles.hired}`}
            >
              <div className="px-1 border-end border-2 border-success">
                <Check size={18} />
              </div>
              <div className="px-2">HIRED</div>
            </span>
          )}
        </div>
        <h5 className="fz18">{title}</h5>
        <p
          className={`fz14 lh-base mb-2 text-muted d-none d-sm-block ${styles.jobDes}`}
        >
          <span>{getTruncatedDescription()}</span>
        </p>
        <div className="border-top mt-3 pt-3">
          <ul className="align-items-center d-flex flex-wrap list-inline list-separator mb-2 text-muted">
            <li className="list-inline-item">
              Delivery{" "}
              <span className="fw-semibold text-dark">
                {days
                  ? String(days).toLowerCase().charAt(0).toUpperCase() +
                    String(days).toLowerCase().slice(1)
                  : ""}
              </span>
            </li>
            <li className="list-inline-item">
              <span className="fw-semibold text-dark">
                {level
                  ? String(level).toLowerCase().charAt(0).toUpperCase() +
                    String(level).toLowerCase().slice(1)
                  : ""}
              </span>
            </li>
            <li className="list-inline-item">
              Total Bidding:{" "}
              <span className="fw-semibold text-dark">{totalBids || 0}</span>
            </li>
          </ul>
          {skills?.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {skills.map((sk) => (
                <p
                  key={sk.id}
                  className={`px-3 py-1 rounded-5 tag ${styles.cardTag}`}
                >
                  {sk.title}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Live job countdown placeholder */}
        {targetDate && jobType === "LIVE" && (
          <div className="countdown-wrap end-0 me-4 my-2 mt-lg-3 top-0 position-absolute">
            <span className={`${orbitron.className} bg-orange-500 text-white text-xs px-2 py-1 rounded`}>
              LIVE
            </span>
          </div>
        )}

        {(showButtons === true || cancelButton === true) && (
          <div className="d-flex gap-1 position-relative z-1 mb-2 mt-3 mb-sm-0">
            {showButtons && (
              <>
                {status !== "HIRED" && (
                  <button
                    className={`btn-thm-border ud-btn align-items-center btn-icon d-flex fz14 justify-content-center p-0 rounded-2 ${styles.btnSoftPrimary}`}
                    onClick={() => onDelete(id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <Link
                  className={`btn-thm-border ud-btn fw-semibold fz14 px-3 py-2 rounded-2 ${styles.btnSoftPrimary}`}
                  href={`/user/freelancer-list/${id}`}
                >
                  See Bidding
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}

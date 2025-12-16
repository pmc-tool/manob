"use client";

import { useEffect, useState } from "react";
import { CheckCheck, Star } from "lucide-react";
import Link from "next/link";
import styles from "./chat.module.css";

interface OrderRequestProps {
  service_id: string;
  title: string;
  description: string;
  price: number;
  deliveryTime: string;
  sendingTime: string;
  isSeen: string;
  imageSrc: string;
  reviews: {
    rating: number;
    count: number;
  };
  revision: number;
  isSelf?: boolean;
  handleWithdrawCustomOffer: () => void;
  cus_order_status?: string;
}

const getStatusClass = (status: string) => {
  const statusClasses: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    WITHDRAW: "bg-gray-100 text-gray-800",
    COMPLETED: "bg-blue-100 text-blue-800",
  };
  return statusClasses[status] || "bg-gray-100 text-gray-800";
};

const capitalizeWords = (text: string): string =>
  text
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export default function OrderRequest({
  service_id,
  title,
  description,
  price,
  deliveryTime,
  sendingTime,
  isSeen,
  isSelf,
  imageSrc,
  reviews,
  revision,
  cus_order_status,
  handleWithdrawCustomOffer,
}: OrderRequestProps) {
  const [userMood, setUserMood] = useState<string | null>(null);

  // Get userMood on client side only to avoid hydration mismatch
  useEffect(() => {
    setUserMood(localStorage.getItem("r_ty"));
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  return (
    <div className="flex items-center gap-1 flex-wrap flex-row-reverse">
      <div className={`${styles.text} ${styles.textMe}`}>
        <div className={styles.orderPackage}>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-3">
            <Link
              href={`/service-details/${service_id}`}
              className="block hover:opacity-90"
            >
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 relative">
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-32 md:h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-1">
                  <p className="text-xs text-gray-500 mb-1">Web & App Design</p>
                  <h4 className="text-sm font-medium line-clamp-2 mb-2">
                    {title}
                  </h4>
                  {reviews.rating > 0 && reviews.count > 0 && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star size={13} className="text-yellow-400 fill-current" />
                      <span className="font-medium">{reviews.rating}</span>
                      <span className="text-gray-500">({reviews.count})</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </div>

          <h6 className="font-medium text-sm mb-2">{title}</h6>
          <p className="text-sm text-gray-600 border-b pb-3 mb-3">
            {description}
          </p>

          <div className="flex justify-between items-center text-sm border-b pb-2 mb-2">
            <span className="font-medium">Price</span>
            <span>${price}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2 mb-2">
            <span className="font-medium">Revisions</span>
            <span>{revision < 100 ? revision : "Unlimited"}</span>
          </div>
          <div className="flex justify-between items-center text-sm border-b pb-2 mb-2">
            <span className="font-medium">Delivery Time</span>
            <span>{deliveryTime}</span>
          </div>

          {cus_order_status === "PENDING" ? (
            <div className="mt-3 mb-2">
              <button
                type="button"
                className="w-full py-2 px-4 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  userMood === "BUYER" || cus_order_status !== "PENDING"
                }
                onClick={handleWithdrawCustomOffer}
              >
                Withdraw Custom Offer
              </button>
            </div>
          ) : cus_order_status ? (
            <div className="flex justify-between items-center mt-2 mb-2">
              <span className="font-medium text-sm">Status</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                  cus_order_status
                )}`}
              >
                {capitalizeWords(cus_order_status)}
              </span>
            </div>
          ) : null}

          <div
            className={`${styles.textSendingTime} ${
              isSeen === "READ" && isSelf ? styles.seen : ""
            }`}
          >
            {formatTime(sendingTime)}
            {isSelf && (
              <CheckCheck
                size={14}
                className={`${styles.checkIcon} ${
                  isSeen === "READ" ? styles.seen : ""
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

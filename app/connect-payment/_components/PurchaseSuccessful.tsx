"use client";

import { Card, Button, Alert } from "antd";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { dateFormat, getExpiryDate } from "@/utils/dateFormat";

interface SubscriptionMeta {
  connect_count: number;
  validity: number;
  total_payable: number;
}

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
  subscription_meta?: SubscriptionMeta;
}

interface PurchaseSuccessfulProps {
  packageData: PackageData;
}

export default function PurchaseSuccessful({ packageData }: PurchaseSuccessfulProps) {
  const date = new Date();

  // Use subscription_meta if available, otherwise fallback to packageData values
  const connectCount = packageData?.subscription_meta?.connect_count || packageData?.connect_count || 0;
  const validity = packageData?.subscription_meta?.validity || packageData?.validity || 1;
  const totalPayable = packageData?.subscription_meta?.total_payable || packageData?.total_payable || 0;

  return (
    <Card className="max-w-2xl mx-auto">
      <Alert
        type="success"
        showIcon
        icon={<CheckCircle2 size={24} className="text-green-500" />}
        message={<span className="font-semibold text-lg">Thank You for Your Purchase</span>}
        description="A receipt was sent to your email address"
        className="mb-4"
      />

      <p className="text-gray-700 mb-4">
        Your subscription has been activated now and will expire on{" "}
        <strong>{getExpiryDate(date, validity)}</strong>. Enjoy your subscription!
      </p>

      <h5 className="font-semibold text-lg mb-3">Purchase Details</h5>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <ul className="space-y-3">
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Connects</span>
            <strong className="text-gray-900">{connectCount}</strong>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600">Start Date</span>
            <strong className="text-gray-900">{dateFormat(date.toString())}</strong>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-gray-600">End Date</span>
            <strong className="text-gray-900">{getExpiryDate(date, validity)}</strong>
          </li>
          <li className="flex justify-between items-center border-t pt-3 mt-3">
            <span className="text-gray-600">Total Price</span>
            <strong className="text-gray-900 text-lg">${totalPayable}</strong>
          </li>
        </ul>
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/user/dashboard">
          <Button type="primary" size="large">
            Go to Dashboard
          </Button>
        </Link>
        <Link href="/connect">
          <Button size="large">
            Buy More Connects
          </Button>
        </Link>
      </div>
    </Card>
  );
}

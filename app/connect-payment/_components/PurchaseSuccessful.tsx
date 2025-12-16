"use client";
import { Card, Button, Result } from "antd";
import Link from "next/link";

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
}

export default function PurchaseSuccessful({ packageData }: { packageData: PackageData }) {
  return (
    <Card className="p-8 text-center">
      <Result
        status="success"
        title="Purchase Successful\!"
        subTitle={`You have purchased ${packageData.connect_count} connects.`}
        extra={[
          <Link key="dashboard" href="/user/dashboard">
            <Button type="primary">Go to Dashboard</Button>
          </Link>
        ]}
      />
    </Card>
  );
}

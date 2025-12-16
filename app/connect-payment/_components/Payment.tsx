"use client";
import { Card, Button } from "antd";

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
}

interface PaymentProps {
  packageData: PackageData;
  onNext: (data: PackageData) => void;
  onBack: () => void;
}

export default function Payment({ packageData, onNext, onBack }: PaymentProps) {
  return (
    <Card className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>
      <p className="text-gray-500 mb-4">Complete your payment</p>
      <div className="flex gap-4 justify-center">
        <Button onClick={onBack}>Back</Button>
        <Button type="primary" onClick={() => onNext(packageData)}>Pay Now</Button>
      </div>
    </Card>
  );
}

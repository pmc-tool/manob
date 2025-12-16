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

export default function BuyConnects({ onNext }: { onNext: (data: PackageData) => void }) {
  return (
    <Card className="p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Buy Connects</h2>
      <p className="text-gray-500 mb-4">Select a package to continue</p>
      <Button type="primary" onClick={() => onNext({ id: "1", connect_count: 10, price: 9.99, tax: 0, discount: 0, total_payable: 9.99, validity: 30 })}>
        Continue
      </Button>
    </Card>
  );
}

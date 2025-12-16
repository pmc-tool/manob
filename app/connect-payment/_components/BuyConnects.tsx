"use client";
import { Card, Select, Checkbox, Button, Skeleton } from "antd";
import { ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGetConnectQuery } from "@/state/services/user.service";
import { useGetAvailableConnectQuery } from "@/state/services/checkout-service/checkout.service";
import { getExpiryDate } from "@/utils/dateFormat";

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
}

interface BuyConnectsProps {
  onNext: (data: PackageData) => void;
}

// Mock data for development
const mockConnectPackages = [
  { id: "pkg-1", connect_count: 10, price: 9.99, tax: 0, discount: 0, total_payable: 9.99, validity: 30 },
  { id: "pkg-2", connect_count: 25, price: 22.99, tax: 0, discount: 3, total_payable: 19.99, validity: 30 },
  { id: "pkg-3", connect_count: 50, price: 39.99, tax: 0, discount: 5, total_payable: 34.99, validity: 60 },
  { id: "pkg-4", connect_count: 100, price: 69.99, tax: 0, discount: 10, total_payable: 59.99, validity: 90 },
];

export default function BuyConnects({ onNext }: BuyConnectsProps) {
  const [selectedData, setSelectedData] = useState<PackageData | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const { data: connectInfo, isLoading: connectLoading } = useGetConnectQuery();
  const { data: apiPackages, isLoading: packagesLoading } = useGetAvailableConnectQuery();

  // Use mock data if API returns no data
  const availableConnects = apiPackages && apiPackages.length > 0 ? apiPackages : mockConnectPackages;
  const connectsBalance = connectInfo?.available_connect || 0;

  useEffect(() => {
    if (availableConnects?.length > 0 && !selectedData) {
      setSelectedData(availableConnects[0]);
    }
  }, [availableConnects, selectedData]);

  const handleConnectSelect = (value: string) => {
    const selectedOption = availableConnects?.find((option: PackageData) => option.id === value);
    if (selectedOption) {
      setSelectedData(selectedOption);
    }
  };

  const newBalance = connectsBalance + (selectedData?.connect_count || 0);
  const date = new Date();

  const handleSubmit = () => {
    if (!termsAccepted) {
      setError("Please accept the terms and conditions");
      return;
    }
    if (!selectedData) {
      setError("Please select a package");
      return;
    }
    setError("");
    onNext(selectedData);
  };

  if (connectLoading || packagesLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <ExternalLink size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-1 relative">
            <span className="bg-white pr-3 relative z-10">Buy Connects</span>
            <span className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-px bg-gray-200 -z-0" />
          </h3>
          <p className="text-gray-500">
            Purchase Connects to apply for more jobs, unlock opportunities, and grow your freelance career.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-gray-50">
        <div className="space-y-5">
          {/* Available Connects */}
          <div>
            <div className="font-semibold mb-1">Your Available Connects</div>
            <div className="text-gray-500 flex items-center gap-2">
              <Zap size={16} className="text-yellow-500" />
              {connectsBalance}
            </div>
          </div>

          {/* Package Select */}
          <div>
            <div className="font-semibold mb-2">Select the amount to buy</div>
            <Select
              size="large"
              className="w-full max-w-md"
              value={selectedData?.id}
              onChange={handleConnectSelect}
              options={availableConnects.map((option: PackageData) => ({
                value: option.id,
                label: `${option.connect_count} connects for $${option.total_payable}`,
              }))}
            />
          </div>

          {/* Account Charged */}
          <div>
            <div className="font-semibold mb-1">Your account will be charged</div>
            <div className="text-gray-500">
              ${selectedData?.total_payable || 0} <span className="text-sm">(Included Tax)</span>
            </div>
          </div>

          {/* New Balance */}
          <div>
            <div className="font-semibold mb-1">Your new Connects balance will be</div>
            <div className="text-gray-500 flex items-center gap-2">
              <Zap size={16} className="text-green-500" />
              {newBalance}
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <div className="font-semibold mb-1">These Connects will expire on</div>
            <div className="text-gray-900 font-medium">
              {getExpiryDate(date, selectedData?.validity || 30)}
            </div>
          </div>

          {/* Terms Checkbox */}
          <div>
            <Checkbox
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked);
                if (e.target.checked) setError("");
              }}
            >
              By continuing, you agree to our{" "}
              <Link href="/term-of-service" className="text-primary hover:underline">
                terms and conditions
              </Link>
            </Checkbox>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Submit Button */}
          <Button type="primary" size="large" onClick={handleSubmit}>
            Buy Now
          </Button>
        </div>
      </Card>
    </div>
  );
}

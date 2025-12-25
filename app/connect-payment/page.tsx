// Connect Payment Page - 3-Step Checkout Wizard
'use client';

import { useState } from 'react';
import { Steps } from 'antd';
import { Zap, CreditCard, CheckCircle } from 'lucide-react';
import BuyConnects from './_components/BuyConnects';
import Payment from './_components/Payment';
import PurchaseSuccessful from './_components/PurchaseSuccessful';

const steps = [
  { title: 'Buy Connects', icon: <Zap size={16} /> },
  { title: 'Payment Method', icon: <CreditCard size={16} /> },
  { title: 'Purchase Successful', icon: <CheckCircle size={16} /> },
];

interface PackageData {
  id: string;
  connect_count: number;
  price: number;
  tax: number;
  discount: number;
  total_payable: number;
  validity: number;
  subscription_meta?: {
    connect_count: number;
    validity: number;
    total_payable: number;
  };
}

export default function ConnectPaymentPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);

  const handlePackageSelect = (packageData: PackageData) => {
    setSelectedPackage(packageData);
    setCurrentStep(1);
  };

  const handlePaymentComplete = (orderData: PackageData) => {
    setSelectedPackage(orderData);
    setCurrentStep(2);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            title: step.title,
            icon: (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-green-500 text-white'
                  : index === currentStep
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index < currentStep ? <CheckCircle size={16} /> : step.icon}
              </div>
            ),
          }))}
        />
      </div>

      {/* Step Content */}
      <div className="stepper-content">
        {currentStep === 0 && (
          <BuyConnects onNext={handlePackageSelect} />
        )}

        {currentStep === 1 && selectedPackage && (
          <Payment
            packageData={selectedPackage}
            onNext={handlePaymentComplete}
            onBack={() => setCurrentStep(0)}
          />
        )}

        {currentStep === 2 && selectedPackage && (
          <PurchaseSuccessful packageData={selectedPackage} />
        )}
      </div>
    </div>
  );
}

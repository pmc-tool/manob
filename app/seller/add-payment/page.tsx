"use client";

import { useState } from "react";
import { Card, Steps } from "antd";
import { Info, CreditCard, CheckCircle } from "lucide-react";
import GeneralInformationForm from "./_components/GeneralInformationForm";
import PaymentMethodForm from "./_components/PaymentMethodForm";

const steps = [
  {
    title: "General Information",
    description: "Personal or business details",
    icon: Info,
  },
  {
    title: "Payout Method",
    description: "Bank account details",
    icon: CreditCard,
  },
];

export default function AddPaymentPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNextStep = () => {
    setCurrentStep(1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(0);
  };

  return (
    <section className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Add Payout Method</h1>
          <p className="text-gray-500 mt-1">
            Set up your payment method to receive payouts from your earnings
          </p>
        </div>

        {/* Stepper */}
        <Card className="mb-6">
          <Steps
            current={currentStep}
            items={steps.map((step, index) => ({
              title: step.title,
              subTitle: step.description,
              icon: (
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    index < currentStep
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle size={20} />
                  ) : (
                    <step.icon size={20} />
                  )}
                </div>
              ),
            }))}
          />
        </Card>

        {/* Form Content */}
        <Card>
          {currentStep === 0 && (
            <GeneralInformationForm handleNextStep={handleNextStep} />
          )}
          {currentStep === 1 && (
            <PaymentMethodForm handlePreviousStep={handlePreviousStep} />
          )}
        </Card>
      </div>
    </section>
  );
}

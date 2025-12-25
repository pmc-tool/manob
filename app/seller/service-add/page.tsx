"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "antd";
import { ChevronRight, HelpCircle } from "lucide-react";
import Link from "next/link";
import OverviewForm from "./_components/OverviewForm";
import PricingForm from "./_components/PricingForm";
import DescriptionFaqForm from "./_components/DescriptionFaqForm";
import GalleryForm from "./_components/GalleryForm";

const steps = [
  { id: "overview", label: "Overview" },
  { id: "pricing", label: "Pricing" },
  { id: "description", label: "Description & FAQs" },
  { id: "gallery", label: "Gallery & Publish" },
];

export interface ServiceDraft {
  id?: string;
  service_title?: string;
  service_category_id?: number;
  service_subcategory_id?: number;
  search_tags?: string[];
  service_meta?: any[];
  is_offer_packages?: boolean;
  basic?: PackageData;
  standard?: PackageData;
  premium?: PackageData;
  description?: string;
  faqs?: FaqItem[];
  order_requirements?: RequirementItem[];
  thumbnail?: number;
  gallery?: number[];
  thumbnail_video?: number;
}

export interface PackageData {
  title: string;
  short_description: string;
  price: number;
  delivery_time: number;
  attributes: { key: string; value: any }[];
}

export interface FaqItem {
  que: string;
  description: string;
}

export interface RequirementItem {
  type: "FREE_TEXT" | "CHECKBOX" | "FILE";
  title: string;
  name: string;
  is_required: boolean;
  values?: string[];
}

export default function ServiceAddPage() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [currentStep, setCurrentStep] = useState(0);
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft>({});

  useEffect(() => {
    if (editId) {
      // Load service data for editing
    }
  }, [editId]);

  const handleNextStep = (data: Partial<ServiceDraft>) => {
    setServiceDraft((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const updateDraft = (data: Partial<ServiceDraft>) => {
    setServiceDraft((prev) => ({ ...prev, ...data }));
  };

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-xl font-medium text-gray-900 pb-3 mb-5 border-b-2 border-gray-200">
          {editId ? "Edit Service" : "Create a Service"}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-9">
            {/* Stepper */}
            <div className="flex items-center gap-1 pb-4 mb-6 border-b border-gray-200 overflow-x-auto">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <button
                    type="button"
                    className={`flex items-center gap-2 px-2 py-1 text-sm font-semibold whitespace-nowrap transition-colors ${
                      index === currentStep
                        ? "text-gray-900"
                        : index < currentStep
                        ? "text-primary"
                        : "text-gray-400"
                    }`}
                    onClick={() => {
                      if (index < currentStep) setCurrentStep(index);
                    }}
                    disabled={index > currentStep}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm text-white transition-colors ${
                        index < currentStep
                          ? "bg-primary"
                          : index === currentStep
                          ? "bg-gray-900"
                          : "bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight
                      size={16}
                      className="mx-2 text-gray-300 flex-shrink-0"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div>
              {currentStep === 0 && (
                <OverviewForm
                  draft={serviceDraft}
                  onNext={handleNextStep}
                  updateDraft={updateDraft}
                  editId={editId}
                />
              )}
              {currentStep === 1 && (
                <PricingForm
                  draft={serviceDraft}
                  onNext={handleNextStep}
                  onBack={handlePreviousStep}
                  updateDraft={updateDraft}
                />
              )}
              {currentStep === 2 && (
                <DescriptionFaqForm
                  draft={serviceDraft}
                  onNext={handleNextStep}
                  onBack={handlePreviousStep}
                  updateDraft={updateDraft}
                />
              )}
              {currentStep === 3 && (
                <GalleryForm
                  draft={serviceDraft}
                  onBack={handlePreviousStep}
                  updateDraft={updateDraft}
                />
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3">
            <Card className="shadow-sm rounded-2xl sticky top-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-3">
                Trouble Uploading?
              </h5>
              <p className="text-sm text-gray-600 mb-4">
                Some users have experienced problems uploading. We've compiled a{" "}
                <Link href="/faqs" className="text-primary hover:underline">
                  list of things to check first
                </Link>{" "}
                which might be of help. We're always working on improving our
                uploading infrastructure - but if you continue to experience
                problems please contact support.
              </p>

              <div className="pt-4 border-t border-gray-100">
                <h6 className="font-medium text-sm text-gray-900 mb-2">
                  Tips for Success
                </h6>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li>• Use clear, descriptive titles</li>
                  <li>• Add high-quality images (785×450px)</li>
                  <li>• Set competitive pricing</li>
                  <li>• Write detailed descriptions</li>
                  <li>• Include FAQs to help buyers</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

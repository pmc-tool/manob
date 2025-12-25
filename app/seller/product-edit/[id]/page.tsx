"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, Spin, Alert } from "antd";
import { ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import OverviewForm from "../_components/OverviewForm";
import CategoryTagsForm from "../_components/CategoryTagsForm";
import GalleryUploadForm from "../_components/GalleryUploadForm";
import PricingPublishForm from "../_components/PricingPublishForm";

const steps = [
  { id: "overview", label: "Overview" },
  { id: "category", label: "Category & Tags" },
  { id: "gallery", label: "Gallery" },
  { id: "pricing", label: "Pricing" },
];

// Mock product info for development
const mockProductInfo = {
  id: "mock-product-1",
  product_name: "",
  short_description: "",
  full_description: "",
  key_feature_one: "",
  key_feature_two: "",
  key_feature_three: "",
  primary_category: 1,
  secondary_category: 11,
  category_tree: "1-11|Graphics & Design-Logo Design",
};

// Mock product attributes
const mockProductAttr = {
  is_guterberg_enable: true,
  is_highres_enable: true,
  is_widget_enable: true,
  is_column_enable: true,
  is_layout_enable: true,
  attributes: [
    {
      type_id: 1,
      type_name: "Compatible Browsers",
      attributes: [
        { id: 101, display_text: "Chrome" },
        { id: 102, display_text: "Firefox" },
        { id: 103, display_text: "Safari" },
        { id: 104, display_text: "Edge" },
      ],
    },
    {
      type_id: 2,
      type_name: "Compatible With",
      attributes: [
        { id: 201, display_text: "React" },
        { id: 202, display_text: "Vue" },
        { id: 203, display_text: "Angular" },
        { id: 204, display_text: "Next.js" },
      ],
    },
  ],
};

// Mock category data
const mockCategoryData = {
  title: "Graphics & Design",
  buyer_fee: 5,
  extended_buyer_fee: 50,
};

export default function ProductEditPage() {
  const params = useParams();
  const productId = params.id as string;

  const [currentStep, setCurrentStep] = useState(0);

  // Use mock data for development
  const productInfo = mockProductInfo;
  const productLoading = false;
  const productError = null;
  const productAttr = mockProductAttr;
  const categoryData = mockCategoryData;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (productLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Spin size="large" />
            <span className="ml-4 text-gray-500">Loading product...</span>
          </div>
        </div>
      </section>
    );
  }

  if (productError) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <Alert
            type="error"
            message="Error"
            description="Failed to load product. Please try again."
            showIcon
          />
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-xl font-medium text-gray-900 pb-3 mb-5 border-b-2 border-gray-200">
          Upload an Item
          {productInfo?.product_name && (
            <span className="text-gray-500 font-normal text-base ml-2">
              - {productInfo.product_name}
            </span>
          )}
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
                      {index < currentStep ? (
                        <CheckCircle size={14} />
                      ) : (
                        index + 1
                      )}
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
                  productId={productId}
                  productInfo={productInfo}
                  onNext={handleNext}
                />
              )}
              {currentStep === 1 && (
                <CategoryTagsForm
                  productId={productId}
                  productAttr={productAttr}
                  onNext={handleNext}
                  onBack={handlePrevious}
                />
              )}
              {currentStep === 2 && (
                <GalleryUploadForm
                  productId={productId}
                  onNext={handleNext}
                  onBack={handlePrevious}
                />
              )}
              {currentStep === 3 && (
                <PricingPublishForm
                  productId={productId}
                  categoryData={categoryData}
                  onBack={handlePrevious}
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
                which might be of help.
              </p>

              <div className="pt-4 border-t border-gray-100">
                <h6 className="font-medium text-sm text-gray-900 mb-2">
                  Current Step Tips
                </h6>
                {currentStep === 0 && (
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li>• Use a clear, descriptive product name</li>
                    <li>• Select the most appropriate category</li>
                    <li>• Write a compelling short description</li>
                    <li>• Add key features to highlight benefits</li>
                  </ul>
                )}
                {currentStep === 1 && (
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li>• Select all relevant attributes</li>
                    <li>• Provide a working demo URL</li>
                    <li>• Include documentation link</li>
                    <li>• Add relevant tags for better searchability</li>
                  </ul>
                )}
                {currentStep === 2 && (
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li>• Thumbnail must be 785×400px</li>
                    <li>• Use high-quality screenshots</li>
                    <li>• Main file should be a ZIP archive</li>
                    <li>• Maximum file size: 200MB</li>
                  </ul>
                )}
                {currentStep === 3 && (
                  <ul className="text-xs text-gray-500 space-y-2">
                    <li>• Research competitive pricing</li>
                    <li>• Set both regular and extended license prices</li>
                    <li>• Write a helpful message for reviewers</li>
                    <li>• Confirm asset ownership before submitting</li>
                  </ul>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Spin } from "antd";
import { ChevronRight, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

const steps = [
  { id: "overview", label: "Overview" },
  { id: "category", label: "Category & Tags" },
  { id: "gallery", label: "Gallery" },
  { id: "pricing", label: "Pricing" },
];

export default function ProductAddPage() {
  const router = useRouter();

  useEffect(() => {
    // In mock mode, generate a random ID and redirect to edit page
    const mockProductId = `new-${Date.now()}`;
    router.replace(`/seller/product-edit/${mockProductId}`);
  }, [router]);

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <h2 className="text-xl font-medium text-gray-900 pb-3 mb-5 border-b-2 border-gray-200">
          Upload an Item
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
                    className="flex items-center gap-2 px-2 py-1 text-sm font-semibold whitespace-nowrap text-gray-400"
                    disabled
                  >
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm text-white bg-gray-300">
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

            {/* Loading State */}
            <Card className="text-center py-16">
              <Spin size="large" />
              <p className="mt-4 text-gray-600">Creating your product draft...</p>
              <p className="text-sm text-gray-400 mt-2">
                You'll be redirected to the editor shortly
              </p>
            </Card>
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
                  Upload Checklist
                </h6>
                <ul className="text-xs text-gray-500 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>Clear product name and description</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>Select appropriate category</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>Thumbnail image (785×400px)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>Main ZIP file with all assets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-gray-300 mt-0.5 flex-shrink-0" />
                    <span>Set competitive pricing</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { sellerPurposeOptions, sellerFaqItems } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";
import { PmcButton, SecondaryButton } from "@/components/ui/pmc-button";

function Accordion({ items }: { items: { que: string; description: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={styles.accordion}>
      {items.map((item, index) => (
        <div key={index} className={styles.accordionItem}>
          <button
            type="button"
            className={styles.accordionButton}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span>{item.que}</span>
            <ChevronDown
              size={18}
              className={`${styles.accordionIcon} ${openIndex === index ? styles.open : ""}`}
            />
          </button>
          {openIndex === index && (
            <div className={styles.accordionContent}>{item.description}</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SellFormPrompt() {
  const { nextStep, prevStep, setSellerPurpose, sellerPurpose } = useSellerWizard();
  const [selectedProducts, setSelectedProducts] = useState<string[]>(sellerPurpose);
  const [isSaving, setIsSaving] = useState(false);
  const [selectionError, setSelectionError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const toggleSelection = (key: string) => {
    setSelectedProducts((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleStartSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      setSelectionError(true);
      return;
    }

    if (!termsAccepted) {
      return;
    }

    setSelectionError(false);
    setIsSaving(true);

    // Save selected purposes
    setSellerPurpose(selectedProducts);

    setTimeout(() => {
      nextStep();
      setIsSaving(false);
    }, 500);
  };

  return (
    <form onSubmit={handleStartSetup}>
      <div className="flex items-center">
        <div className="hidden lg:block lg:w-5/12 2xl:w-1/3">
          <div
            className={`flex items-start h-screen justify-center flex-col ${styles.imageContainer}`}
          >
            <div className="mb-4">
              <h3 className={`font-semibold ${styles.faqTitle}`} style={{ fontSize: "2rem" }}>
                Frequently Asked
                <br /> Questions from New Sellers
              </h3>
              <p className="text-gray-500" style={{ fontSize: "14px" }}>
                This FAQ section helps new sellers quickly find answers to
                common questions about starting, selling, and managing their
                products. It&apos;s designed to guide beginners through essential
                steps for a smooth and successful selling experience.
              </p>
            </div>
            <Accordion items={sellerFaqItems} />
          </div>
        </div>
        {/* Form Panel */}
        <div className={`${styles.formContent} w-full lg:w-7/12 2xl:w-2/3`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-lg mx-auto">
              <div className="mb-4">
                <h2 className="font-bold">What do you want to sell?</h2>
                <p className="text-gray-500">
                  Ready to start selling on manob.ai? Whether you&apos;re a
                  freelancer, designer, or developer, we&apos;ve got you covered.
                </p>
              </div>

              <div>
                {selectionError && (
                  <div className="text-red-500 font-medium mb-2">
                    Please select at least one option.
                  </div>
                )}

                {sellerPurposeOptions.map((option) => (
                  <label
                    key={option.key}
                    className={`flex items-center p-3 w-full border rounded bg-white mb-3 cursor-pointer relative ${
                      selectedProducts.includes(option.key)
                        ? "border-green-500 bg-green-50"
                        : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-3 accent-primary cursor-pointer"
                      checked={selectedProducts.includes(option.key)}
                      onChange={() => toggleSelection(option.key)}
                    />
                    <div>
                      <span className="block font-medium">
                        {option.title}
                      </span>
                      <span className="block text-gray-500" style={{ fontSize: "14px" }}>
                        {option.description}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
              <em className="block mb-3 text-gray-600" style={{ fontSize: "14px" }}>
                Maximize your earning potential by combining both services and
                digital products. Offer your skills to clients while also
                building assets that sell repeatedly.
              </em>

              <div className="flex items-center gap-2 mb-3">
                <input
                  className="w-4 h-4 accent-primary cursor-pointer"
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <label className="text-sm" htmlFor="terms">
                  I agree with the manob.ai{" "}
                  <Link
                    className="font-semibold underline text-primary"
                    href="/terms"
                  >
                    terms and conditions
                  </Link>
                </label>
              </div>
              <div className={`flex gap-2 ${styles.btnContainer}`}>
                <SecondaryButton
                  onClick={prevStep}
                  disabled={isSaving}
                >
                  Back
                </SecondaryButton>
                <PmcButton
                  variant="primary"
                  htmlType="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Continuing..." : "Continue"}
                </PmcButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

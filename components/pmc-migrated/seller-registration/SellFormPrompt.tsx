"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { sellerPurposeOptions, sellerFaqItems } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";

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
      <div className="row align-items-center g-0">
        <div className="col-12 col-lg-5 col-xxl-4 d-none d-lg-block">
          <div
            className={`d-flex align-items-start vh-100 justify-content-center flex-column ${styles.imageContainer}`}
          >
            <div className="mb-4">
              <h3 className={`fw-semibold ${styles.faqTitle}`} style={{ fontSize: "2rem" }}>
                Frequently Asked
                <br /> Questions from New Sellers
              </h3>
              <p className="text-muted" style={{ fontSize: "14px" }}>
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
        <div className={`${styles.formContent} col-12 col-lg-7 col-xxl-8`}>
          <div className="container-lg">
            <div className="row">
              <div className="col-md-10 col-xl-8 col-xxl-6 offset-md-1 offset-xl-2">
                <div className="mb-4">
                  <h2 className="fw-bold">What do you want to sell?</h2>
                  <p className="text-muted">
                    Ready to start selling on manob.ai? Whether you&apos;re a
                    freelancer, designer, or developer, we&apos;ve got you covered.
                  </p>
                </div>

                <div>
                  {selectionError && (
                    <div className="text-danger fw-medium mb-2">
                      Please select at least one option.
                    </div>
                  )}

                  {sellerPurposeOptions.map((option) => (
                    <label
                      key={option.key}
                      className={`d-flex align-items-center p-3 w-100 border rounded bg-white mb-3 cursor-pointer position-relative ${
                        selectedProducts.includes(option.key)
                          ? "border-success bg-light"
                          : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <input
                        type="checkbox"
                        className="form-check-input me-3 ms-0"
                        checked={selectedProducts.includes(option.key)}
                        onChange={() => toggleSelection(option.key)}
                      />
                      <div>
                        <span className="d-block fw-medium">
                          {option.title}
                        </span>
                        <span className="d-block text-muted" style={{ fontSize: "14px" }}>
                          {option.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                <em className="d-block mb-3 text-secondary" style={{ fontSize: "14px" }}>
                  Maximize your earning potential by combining both services and
                  digital products. Offer your skills to clients while also
                  building assets that sell repeatedly.
                </em>

                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label className="form-check-label" htmlFor="terms">
                    I agree with the manob.ai{" "}
                    <Link
                      className="fw-semibold text-decoration-underline text-primary"
                      href="/terms"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
                <div className={`d-flex gap-2 ${styles.btnContainer}`}>
                  <button
                    type="button"
                    onClick={prevStep}
                    className={styles.btnDark}
                    disabled={isSaving}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={styles.btnThm}
                    disabled={isSaving}
                  >
                    {isSaving ? "Continuing..." : "Continue"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

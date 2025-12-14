"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { Category } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";

interface ChooseCategoriesProps {
  categories: Category[];
}

export default function ChooseCategories({ categories }: ChooseCategoriesProps) {
  const { nextStep, prevStep, selectedCategories, setSelectedCategories } = useSellerWizard();
  const [isSaving, setIsSaving] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [localSelectedCategories, setLocalSelectedCategories] = useState<string[]>(
    selectedCategories.map(String)
  );
  const [selectedData, setSelectedData] = useState<Category[]>([]);

  useEffect(() => {
    const selectedOptions = categories.filter((option) =>
      localSelectedCategories.includes(String(option.id))
    );
    setSelectedData(selectedOptions);
  }, [localSelectedCategories, categories]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    if (
      selected &&
      !localSelectedCategories.includes(selected) &&
      selected !== "Select category"
    ) {
      setLocalSelectedCategories([...localSelectedCategories, selected]);
    }
  };

  const handleRemove = (categoryId: number) => {
    setLocalSelectedCategories(
      localSelectedCategories.filter((item) => +item !== categoryId)
    );
  };

  const handleStartSetup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (localSelectedCategories.length === 0) {
      setCategoryError("Please select minimum one category.");
      return;
    }

    setCategoryError(null);
    setIsSaving(true);

    // Save selected categories
    setSelectedCategories(localSelectedCategories.map(Number));

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
            className={`d-flex align-items-center vh-100 justify-content-center flex-column ${styles.imageContainer}`}
          >
            <img
              className="img-fluid"
              src="/images/become-seller/freelancerbenefit.png"
              alt="Overview Hero"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
        <div className={`${styles.formContent} col-12 col-lg-7 col-xxl-8`}>
          <div className="container-lg">
            <div className="row">
              <div className="col-md-10 col-xl-8 col-xxl-6 offset-md-1 offset-xl-2">
                <div className="mb-4">
                  <h2 className="fw-bold">Choose Your Favorite Categories</h2>
                  <p className="text-muted">
                    Ready to start selling on manob.ai? Here are answers to
                    some common questions. Whether you&apos;re a freelancer,
                    designer, or developer, we&apos;ve got you covered. Find out how
                    easy it is to set up your account.
                  </p>
                </div>
                {/* make price */}
                <div className="mb-4">
                  <h5 className="fw-bold">Make your own price</h5>
                  <p className="text-muted">
                    Pricing your items appropriately will help them sell.{" "}
                    <Link
                      className="fw-semibold text-decoration-underline text-primary"
                      href="/help"
                    >
                      Check out our article on best practices and things to
                      avoid.
                    </Link>
                  </p>
                </div>

                <div className="mb-2">
                  <label className="form-label fw-medium mb-1" style={{ fontSize: "14px" }}>
                    Select Multiple Category <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <select className="form-select" onChange={handleSelect} defaultValue="">
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  {categoryError && (
                    <div className="text-danger fw-medium mt-1" style={{ fontSize: "14px" }}>
                      {categoryError}
                    </div>
                  )}
                </div>
                {selectedData.length > 0 && (
                  <div className="border rounded p-3 mt-3">
                    <div className="d-flex flex-wrap gap-2">
                      {selectedData.map((category) => (
                        <span
                          key={category.id}
                          className="badge bg-primary d-inline-flex align-items-center"
                          style={{ padding: "0.5rem 0.75rem" }}
                        >
                          {category.title}
                          <button
                            type="button"
                            className="btn-close btn-close-white btn-sm ms-2"
                            aria-label="Remove"
                            onClick={() => handleRemove(category.id)}
                            style={{ fontSize: "0.6rem" }}
                          ></button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <ul className="d-flex flex-column gap-2 list-unstyled mt-4">
                  <li>
                    <span className="me-2">▶</span>Boost chances of getting
                    hired or selling
                  </li>
                  <li>
                    <span className="me-2">▶</span>Match With the Right Buyers
                  </li>
                  <li>
                    <span className="me-2">▶</span>Get more relevant order from
                    clients
                  </li>
                  <li>
                    <span className="me-2">▶</span>Make it easier for clients to
                    hire you
                  </li>
                </ul>
                <div className={`d-flex gap-2 ${styles.btnContainer}`}>
                  <button
                    type="button"
                    onClick={prevStep}
                    className={styles.btnDark}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className={styles.btnThm}
                    disabled={isSaving}
                  >
                    {isSaving ? "Continuing..." : "Add Skills"}
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

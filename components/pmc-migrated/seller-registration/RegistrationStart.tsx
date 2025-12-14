"use client";

import { useState } from "react";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { registrationSteps } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";

export default function RegistrationStart() {
  const [isSaving, setIsSaving] = useState(false);
  const { nextStep } = useSellerWizard();

  const handleStartSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

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
              src="/images/become-seller/overviewhero.png"
              alt="Overview Hero"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
        <div className={`${styles.formContent} col-12 col-lg-7 col-xxl-8`}>
          <div className="container-lg">
            <div className="row">
              <div className="col-md-10 col-xl-8 col-xxl-6 offset-md-1 offset-xl-2">
                <h1 className={`fw-bold mb-5 ${styles.headerTitle}`}>
                  Start Earning In Just
                  <br className="d-none d-lg-block" /> A Few Steps
                </h1>
                <div className="d-flex flex-column gap-4">
                  {registrationSteps.map((item) => (
                    <div className="d-flex gap-3" key={item.title}>
                      <div className="flex-shrink-0">
                        <img src={item.url} alt="" height={46} />
                      </div>
                      <div>
                        <h5 className="fw-semibold mb-1" style={{ fontSize: "17px" }}>
                          {item.title}
                        </h5>
                        <p className="mb-0 text-muted lh-base" style={{ fontSize: "14px" }}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={`d-flex gap-2 ${styles.btnContainer}`}>
                  <button
                    type="submit"
                    className={styles.btnThm}
                    disabled={isSaving}
                  >
                    {isSaving ? "Continuing..." : "Start Setup"}
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

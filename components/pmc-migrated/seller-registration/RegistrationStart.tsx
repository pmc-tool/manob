"use client";

import { useState } from "react";
import { useSellerWizard } from "@/context/SellerWizardContext";
import { registrationSteps } from "@/lib/mocks/seller.mock";
import styles from "./SellerRegistration.module.css";
import { PmcButton } from "@/components/ui/pmc-button";

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
      <div className="flex items-center">
        <div className="hidden lg:block lg:w-5/12 2xl:w-1/3">
          <div
            className={`flex items-center h-screen justify-center flex-col ${styles.imageContainer}`}
          >
            <img
              className="max-w-full"
              src="/images/become-seller/overviewhero.png"
              alt="Overview Hero"
            />
          </div>
        </div>
        <div className={`${styles.formContent} w-full lg:w-7/12 2xl:w-2/3`}>
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-lg mx-auto">
              <h1 className={`font-bold mb-5 ${styles.headerTitle}`}>
                Start Earning In Just
                <br className="hidden lg:block" /> A Few Steps
              </h1>
              <div className="flex flex-col gap-4">
                {registrationSteps.map((item) => (
                  <div className="flex gap-3" key={item.title}>
                    <div className="flex-shrink-0">
                      <img src={item.url} alt="" height={46} />
                    </div>
                    <div>
                      <h5 className="font-semibold mb-1 text-[17px]">
                        {item.title}
                      </h5>
                      <p className="mb-0 text-gray-500 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className={`flex gap-2 ${styles.btnContainer}`}>
                <PmcButton
                  variant="primary"
                  htmlType="submit"
                  disabled={isSaving}
                >
                  {isSaving ? "Continuing..." : "Start Setup"}
                </PmcButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

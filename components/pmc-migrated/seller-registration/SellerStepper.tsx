"use client";

import React from "react";
import { useSellerWizard } from "@/context/SellerWizardContext";
import styles from "./SellerRegistration.module.css";

interface Step {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
}

export default function SellerStepper({ steps }: StepperProps) {
  const { currentStep } = useSellerWizard();

  return (
    <div className={styles.stepper}>
      <div className={styles.stepperContentWrapper}>
        {steps.map((step, index) => {
          let stepClass = "";
          if (index === currentStep) stepClass = styles.stepCurrent;
          else if (index < currentStep) stepClass = styles.stepPrev;
          else if (index > currentStep) stepClass = styles.stepNext;

          return (
            <div
              key={step.id}
              id={step.id}
              className={`${styles.stepperContent} ${stepClass}`}
            >
              {step.content}
            </div>
          );
        })}
      </div>

      <div
        className="fixed bottom-0 w-full shadow-lg bg-white justify-center items-center hidden lg:flex"
        role="tablist"
        style={{ zIndex: 100 }}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`${styles.stepItem} py-3 ${
              index < currentStep ? styles.crossed : ""
            }`}
            data-target={`#${step.id}`}
          >
            <button
              type="button"
              className={`flex items-center bg-transparent border-0 font-bold justify-center whitespace-nowrap text-sm ${
                styles.stepTrigger
              } ${index === currentStep ? styles.active : ""}`}
              role="tab"
              aria-controls={step.id}
              id={`${step.id}-trigger`}
            >
              <span
                className={`rounded-none ${styles.bordersWidth} ${
                  index <= currentStep
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }`}
              ></span>
              <span
                className={`flex items-center justify-center rounded-full text-white ${styles.stepperCircle}`}
              >
                {index + 1}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

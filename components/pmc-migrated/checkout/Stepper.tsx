// Stepper - migrated from PMC (matching original design exactly)
"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import styles from "./Stepper.module.css";

type Step = {
  id: string;
  label: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
  setCurrentStep?: (step: number) => void;
};

const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  setCurrentStep,
}) => {
  return (
    <div
      className="align-items-center border-bottom d-flex mb-3 mb-md-4 pb-3 pb-md-4 stepper-header table-responsive"
      role="tablist"
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div
            className={`${styles.stepItem} ${
              index < currentStep ? styles.crossed : ""
            }`}
            data-target={`#${step.id}`}
          >
            <button
              type="button"
              className={`align-items-center bg-transparent border-0 d-flex fw-bold fz14 justify-content-center text-nowrap gap-2 ${
                styles.stepTrigger
              } ${index === currentStep ? styles.active : ""}`}
              role="tab"
              aria-controls={step.id}
              id={`${step.id}-trigger`}
            >
              <span
                className={`align-items-center d-flex justify-content-center rounded-circle text-white ${styles.stepperCircle}`}
              >
                {index + 1}
              </span>
              <span className="stepper-label">{step.label}</span>
            </button>
          </div>
          {index < steps.length - 1 && (
            <div className={`flex-shrink-0 ${styles.line}`}>
              <ChevronRight size={16} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

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
      className="flex items-center border-b mb-3 md:mb-4 pb-3 md:pb-4 overflow-x-auto"
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
              className={`flex items-center bg-transparent border-0 font-bold text-sm justify-center whitespace-nowrap gap-2 ${
                styles.stepTrigger
              } ${index === currentStep ? styles.active : ""}`}
              role="tab"
              aria-controls={step.id}
              id={`${step.id}-trigger`}
            >
              <span
                className={`flex items-center justify-center rounded-full text-white ${styles.stepperCircle}`}
              >
                {index + 1}
              </span>
              <span className="hidden md:inline">{step.label}</span>
            </button>
          </div>
          {index < steps.length - 1 && (
            <div className={`shrink-0 ${styles.line}`}>
              <ChevronRight size={16} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;

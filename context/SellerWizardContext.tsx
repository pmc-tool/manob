"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SellerWizardContextType {
  currentStep: number;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  sellerPurpose: string[];
  setSellerPurpose: (purpose: string[]) => void;
  selectedCategories: number[];
  setSelectedCategories: (categories: number[]) => void;
  selectedSkills: { id: number; skill_name: string }[];
  setSelectedSkills: (skills: { id: number; skill_name: string }[]) => void;
  resetWizard: () => void;
}

const SellerWizardContext = createContext<SellerWizardContextType | undefined>(
  undefined
);

export function SellerWizardProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [sellerPurpose, setSellerPurpose] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<
    { id: number; skill_name: string }[]
  >([]);

  const setStep = (step: number) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setSellerPurpose([]);
    setSelectedCategories([]);
    setSelectedSkills([]);
  };

  return (
    <SellerWizardContext.Provider
      value={{
        currentStep,
        setStep,
        nextStep,
        prevStep,
        sellerPurpose,
        setSellerPurpose,
        selectedCategories,
        setSelectedCategories,
        selectedSkills,
        setSelectedSkills,
        resetWizard,
      }}
    >
      {children}
    </SellerWizardContext.Provider>
  );
}

export function useSellerWizard() {
  const context = useContext(SellerWizardContext);
  if (context === undefined) {
    throw new Error(
      "useSellerWizard must be used within a SellerWizardProvider"
    );
  }
  return context;
}

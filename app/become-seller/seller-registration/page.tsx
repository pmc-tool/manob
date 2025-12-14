"use client";

import {
  SellerStepper,
  RegistrationStart,
  SellFormPrompt,
  ChooseCategories,
  Skills,
  SellerHeader,
} from "@/components/pmc-migrated/seller-registration";
import { SellerWizardProvider } from "@/context/SellerWizardContext";
import { mockCategories, mockSkills } from "@/lib/mocks/seller.mock";

export default function SellerRegistration() {
  const steps = [
    {
      id: "registrationStart",
      label: "",
      content: <RegistrationStart />,
    },
    {
      id: "sellerFromPrompt",
      label: "",
      content: <SellFormPrompt />,
    },
    {
      id: "chooseCategories",
      label: "",
      content: <ChooseCategories categories={mockCategories} />,
    },
    {
      id: "sellerSkills",
      label: "",
      content: <Skills skills={mockSkills} />,
    },
  ];

  return (
    <SellerWizardProvider>
      <SellerHeader />
      <SellerStepper steps={steps} />
    </SellerWizardProvider>
  );
}

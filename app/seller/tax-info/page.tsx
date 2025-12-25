"use client";

import { Card, Tabs } from "antd";
import { FileText, User, Building2 } from "lucide-react";
import UsCitizenForm from "./_components/UsCitizenForm";
import NotUsCitizenIndividualForm from "./_components/NotUsCitizenIndividualForm";
import NotUsCitizenCorporationForm from "./_components/NotUsCitizenCorporationForm";

const tabItems = [
  {
    key: "us-citizen",
    label: (
      <span className="flex items-center gap-2">
        <User size={16} />
        I am a US Citizen
      </span>
    ),
    children: <UsCitizenForm />,
  },
  {
    key: "non-us-individual",
    label: (
      <span className="flex items-center gap-2">
        <FileText size={16} />
        Not a US Citizen (Individual)
      </span>
    ),
    children: <NotUsCitizenIndividualForm />,
  },
  {
    key: "non-us-corporation",
    label: (
      <span className="flex items-center gap-2">
        <Building2 size={16} />
        Not a US Citizen (Corporation)
      </span>
    ),
    children: <NotUsCitizenCorporationForm />,
  },
];

export default function SellerTaxInformationPage() {
  return (
    <section className="p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-900">Tax Information</h1>
          <p className="text-gray-500 mt-1">
            Complete your tax information for compliance purposes
          </p>
        </div>

        {/* Tax Forms Tabs */}
        <Card>
          <Tabs
            defaultActiveKey="us-citizen"
            items={tabItems}
            className="tax-info-tabs"
          />
        </Card>
      </div>
    </section>
  );
}

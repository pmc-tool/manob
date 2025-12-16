// BillingModal - migrated from PMC
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Countries from "@/lib/data/countries.json";
import { PmcInput } from "@/components/ui/pmc-input";
import { PmcSelect } from "@/components/ui/pmc-select";
import { PmcTextArea } from "@/components/ui/pmc-input";
import { PmcButton, SecondaryButton } from "@/components/ui/pmc-button";

interface IBillingInfo {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  address_one: string;
  address_two: string;
  city: string;
  country: string;
  zip_code: string;
  notes: string;
}

interface BillingModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSubmit: (data: IBillingInfo) => void;
  isUpdate: boolean;
  initialData?: IBillingInfo | null;
}

const defaultFormData: IBillingInfo = {
  first_name: "",
  last_name: "",
  email: "",
  address_one: "",
  address_two: "",
  city: "",
  country: "",
  zip_code: "",
  notes: "",
};

export default function BillingModal({
  isModalOpen,
  onClose,
  onSubmit,
  isUpdate,
  initialData,
}: BillingModalProps) {
  const [formData, setFormData] = useState<IBillingInfo>(defaultFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof IBillingInfo, string>>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isModalOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof IBillingInfo]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof IBillingInfo, string>> = {};

    if (!formData.first_name.trim()) newErrors.first_name = "This field is required";
    if (!formData.last_name.trim()) newErrors.last_name = "This field is required";
    if (!formData.email.trim()) newErrors.email = "This field is required";
    if (!formData.address_one.trim()) newErrors.address_one = "This field is required";
    if (!formData.country.trim()) newErrors.country = "This field is required";
    if (!formData.city.trim()) newErrors.city = "This field is required";
    if (!formData.zip_code.trim()) newErrors.zip_code = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({ ...formData, id: initialData?.id || `billing-${Date.now()}` });
      onClose();
    }
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-lg font-semibold">
            {isUpdate ? "Update Billing Details" : "Add Billing Details"}
          </h5>
          <button
            type="button"
            className="p-1 hover:bg-gray-100 rounded"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <form id="billingForm" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  First Name <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="text"
                  name="first_name"
                  placeholder="Enter your name here"
                  value={formData.first_name}
                  onChange={handleChange}
                />
                {errors.first_name && (
                  <span className="text-red-500 text-sm">{errors.first_name}</span>
                )}
              </div>
              <div className="col-span-1">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="text"
                  name="last_name"
                  placeholder="Enter your name here"
                  value={formData.last_name}
                  onChange={handleChange}
                />
                {errors.last_name && (
                  <span className="text-red-500 text-sm">{errors.last_name}</span>
                )}
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Address 1 <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="text"
                  name="address_one"
                  placeholder="Enter your address here"
                  value={formData.address_one}
                  onChange={handleChange}
                />
                {errors.address_one && (
                  <span className="text-red-500 text-sm">{errors.address_one}</span>
                )}
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Address 2
                </label>
                <PmcInput
                  type="text"
                  name="address_two"
                  placeholder="Enter your address here"
                  value={formData.address_two}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Country / Region <span className="text-red-500">*</span>
                </label>
                <PmcSelect
                  value={formData.country}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, country: value as string }));
                    if (errors.country) {
                      setErrors((prev) => ({ ...prev, country: "" }));
                    }
                  }}
                  placeholder="Select"
                  options={Countries?.map((country) => ({
                    value: country.name,
                    label: country.name,
                  })) || []}
                />
                {errors.country && (
                  <span className="text-red-500 text-sm">{errors.country}</span>
                )}
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Town / City <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="text"
                  name="city"
                  placeholder="Town / City"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <span className="text-red-500 text-sm">{errors.city}</span>
                )}
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Zip code <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="text"
                  name="zip_code"
                  placeholder="Enter your zip code"
                  value={formData.zip_code}
                  onChange={handleChange}
                />
                {errors.zip_code && (
                  <span className="text-red-500 text-sm">{errors.zip_code}</span>
                )}
              </div>
              <div className="col-span-2">
                <label className="block font-medium text-gray-900 mb-1 text-sm">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <PmcInput
                  type="email"
                  name="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>
              <div className="col-span-2">
                <div className="mb-3">
                  <h5 className="font-semibold mb-2">Additional information</h5>
                  <label className="block font-medium text-gray-900 mb-1 text-sm">
                    Order Notes (optional)
                  </label>
                  <PmcTextArea
                    rows={4}
                    name="notes"
                    placeholder="Description"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t">
          <SecondaryButton onClick={onClose}>
            Cancel
          </SecondaryButton>
          <PmcButton
            variant="primary"
            htmlType="submit"
            form="billingForm"
          >
            {isUpdate ? "Update" : "Save"}
          </PmcButton>
        </div>
      </div>
    </div>
  );
}

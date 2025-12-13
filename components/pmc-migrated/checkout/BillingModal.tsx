// BillingModal - migrated from PMC
"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Countries from "@/lib/data/countries.json";

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
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {isUpdate ? "Update Billing Details" : "Add Billing Details"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form id="billingForm" onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="first_name"
                    placeholder="Enter your name here"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <span className="text-danger fz14">{errors.first_name}</span>
                  )}
                </div>
                <div className="col-6">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="last_name"
                    placeholder="Enter your name here"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <span className="text-danger fz14">{errors.last_name}</span>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Address 1
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address_one"
                    placeholder="Enter your address here"
                    value={formData.address_one}
                    onChange={handleChange}
                  />
                  {errors.address_one && (
                    <span className="text-danger fz14">{errors.address_one}</span>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14">
                    Address 2
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="address_two"
                    placeholder="Enter your address here"
                    value={formData.address_two}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Country / Region
                  </label>
                  <select
                    className="form-select"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="">Select</option>
                    {Countries?.map((country) => (
                      <option key={country.name} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <span className="text-danger fz14">{errors.country}</span>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Town / City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    placeholder="Town / City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {errors.city && (
                    <span className="text-danger fz14">{errors.city}</span>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Zip code
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="zip_code"
                    placeholder="Enter your zip code"
                    value={formData.zip_code}
                    onChange={handleChange}
                  />
                  {errors.zip_code && (
                    <span className="text-danger fz14">{errors.zip_code}</span>
                  )}
                </div>
                <div className="col-12">
                  <label className="form-label fw-medium dark-color mb-1 fz14 required">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <span className="text-danger fz14">{errors.email}</span>
                  )}
                </div>
                <div className="col-12">
                  <div className="mb-3">
                    <h5>Additional information</h5>
                    <label className="form-label fw-medium dark-color mb-1 fz14">
                      Order Notes (optional)
                    </label>
                    <textarea
                      cols={30}
                      rows={4}
                      className="form-control"
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="billingForm"
              className="ud-btn btn-thm"
            >
              {isUpdate ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

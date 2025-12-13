'use client';

import { Check } from 'lucide-react';

interface PackageAttribute {
  key: string;
  value: boolean | string | null;
}

interface PackageDetailsProps {
  title: string;
  packageInfo: {
    delivery_time?: number;
    attributes?: PackageAttribute[];
  };
  service_title?: string;
  package_title?: string;
}

export default function PackageDetails({
  title,
  packageInfo,
  service_title,
  package_title,
}: PackageDetailsProps) {
  return (
    <div className="package-details-section">
      <h5 className="package-details-title">{title}</h5>
      <ul className="package-details-list">
        {service_title && (
          <li className="package-details-item">
            <span className="package-details-label">Service Name:</span>
            <span className="package-details-value">{service_title}</span>
          </li>
        )}

        {package_title && (
          <li className="package-details-item">
            <span className="package-details-label">Package:</span>
            <span className="package-details-value">{package_title}</span>
          </li>
        )}

        <li className="package-details-item">
          <span className="package-details-label">Delivery Days:</span>
          <span className="package-details-value">{packageInfo?.delivery_time} Days</span>
        </li>

        {packageInfo?.attributes?.map((attribute, i) => {
          if (attribute?.value === null || attribute?.value !== false) {
            return (
              <li key={i} className="package-details-attribute">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="capitalize">
                  {attribute?.key.replaceAll('_', ' ')}
                </span>
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

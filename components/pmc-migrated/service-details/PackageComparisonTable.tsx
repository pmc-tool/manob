'use client';

import { useEffect, useState } from 'react';
import ComparisonTbody from './ComparisonTbody';

interface PackageAttribute {
  key: string;
  value: string | number | boolean | null;
}

interface PackageInfo {
  title?: string;
  short_description?: string;
  price: number;
  discounted_price?: number;
  attributes?: PackageAttribute[];
}

interface PackagesInfo {
  basic?: PackageInfo;
  standard?: PackageInfo;
  premium?: PackageInfo;
}

interface PackageTab {
  id: 'basic' | 'standard' | 'premium';
  title: string;
}

interface PackageComparisonTableProps {
  tabs: PackageTab[];
  packagesInfo: PackagesInfo;
}

type ComparisonData = {
  [key: string]: {
    basic: string | number | boolean;
    standard: string | number | boolean;
    premium: string | number | boolean;
  };
};

export default function PackageComparisonTable({
  tabs,
  packagesInfo,
}: PackageComparisonTableProps) {
  const [packages, setPackages] = useState<PackagesInfo>({});
  const [packagesTabs, setPackagesTabs] = useState<PackageTab[]>([]);
  const [comparisonInfo, setComparisonInfo] = useState<ComparisonData>({});

  const getAttributeValue = (
    attributes: PackageAttribute[] | undefined,
    key: string
  ): string | number | boolean => {
    const attr = attributes?.find((a) => a.key === key);
    if (!attr) return 'NotProvided';
    if (attr.value === null || attr.value === false) return 'NotProvided';
    return attr.value;
  };

  useEffect(() => {
    if (packagesInfo) {
      const uniqueKeys = new Set<string>();

      // Collect all unique keys from all packages
      Object.values(packagesInfo).forEach((pkg: PackageInfo | undefined) =>
        pkg?.attributes?.forEach((attr: PackageAttribute) =>
          uniqueKeys.add(attr.key)
        )
      );

      // Map keys to values for each package
      const comparisonData: ComparisonData = {};
      uniqueKeys.forEach((key) => {
        comparisonData[key] = {
          basic: getAttributeValue(packagesInfo?.basic?.attributes, key),
          standard: getAttributeValue(packagesInfo?.standard?.attributes, key),
          premium: getAttributeValue(packagesInfo?.premium?.attributes, key),
        };
      });

      setComparisonInfo(comparisonData);
      setPackages(packagesInfo);
      setPackagesTabs(tabs);
    }
  }, [tabs, packagesInfo]);

  if (!packagesTabs.length) return null;

  return (
    <div id="comparePackages" className="package-comparison-table">
      <h4 className="fz18 font-semibold mb-4">Compare Packages</h4>
      <div className="table-responsive border rounded-lg overflow-hidden">
        <table className="comparison-table">
          <thead className="comparison-thead">
            <tr>
              <td className="comparison-empty-cell"></td>
              {packagesTabs.map((item, index) => {
                const data = packages[item.id];
                return (
                  <td key={index} className="comparison-header-cell">
                    <div className="comparison-price">
                      {data?.discounted_price && data.discounted_price < data.price ? (
                        <>
                          <span className="comparison-old-price">${data.price}</span>
                          <span className="comparison-current-price">${data.discounted_price}</span>
                        </>
                      ) : (
                        <span className="comparison-current-price">${data?.price}</span>
                      )}
                    </div>
                    <div className="comparison-package-title">{item.title}</div>
                    <div className="comparison-description">{data?.short_description}</div>
                  </td>
                );
              })}
            </tr>
          </thead>
          <ComparisonTbody
            comparisonData={comparisonInfo}
            packagesTabs={packagesTabs.length}
          />
        </table>
      </div>
    </div>
  );
}

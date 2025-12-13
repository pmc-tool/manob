// Item Attributes component (matching original PMC design)
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProductAttribute {
  attribute_type_title: string;
  attribute_title: string;
}

interface ItemAttributesProps {
  updatedAt: string;
  createdAt: string;
  productAttributes: ProductAttribute[];
  isGutenberg?: boolean;
  highResolution?: boolean;
  columns?: string;
  layout?: string;
  tags?: string[];
  documentation?: boolean;
}

const formatDate = (isoDate: string) => {
  if (isoDate) {
    const formattedDate = new Date(isoDate).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return formattedDate;
  }
  return '';
};

export default function ItemAttributes({
  updatedAt,
  createdAt,
  productAttributes = [],
  isGutenberg,
  highResolution,
  columns,
  layout,
  tags = [],
  documentation = false,
}: ItemAttributesProps) {
  const [attributeObj, setAttributeObj] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (productAttributes && productAttributes.length > 0) {
      const attributes = productAttributes.reduce((acc: Record<string, string[]>, item) => {
        if (!acc[item.attribute_type_title]) {
          acc[item.attribute_type_title] = [item.attribute_title];
        } else {
          acc[item.attribute_type_title].push(item.attribute_title);
        }
        return acc;
      }, {});
      setAttributeObj(attributes);
    }
  }, [productAttributes]);

  return (
    <div className="mb-4 p-3 sm:p-4 relative rounded-lg shadow bg-white item-attributes">
      <table className="fz14 w-full mb-0">
        <tbody>
          <tr className="border-b border-gray-100">
            <th className="py-2.5 pr-4 text-left text-gray-600 font-medium w-2/5">Last Update</th>
            <td className="py-2.5">
              <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Published</th>
            <td className="py-2.5">
              <span>{formatDate(createdAt)}</span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Gutenberg Optimized</th>
            <td className="py-2.5">
              <span className="text-primary">{isGutenberg ? 'Yes' : 'No'}</span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">High Resolution</th>
            <td className="py-2.5">
              <span>{highResolution ? 'Yes' : 'No'}</span>
            </td>
          </tr>
          <tr className="border-b border-gray-100">
            <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Widget Ready</th>
            <td className="py-2.5">
              <span className="text-primary">Yes</span>
            </td>
          </tr>

          {/* Dynamic attributes */}
          {Object.entries(attributeObj).length > 0 &&
            Object.entries(attributeObj).map(([key, values], index) => (
              <tr key={index} className="border-b border-gray-100">
                <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">{key}</th>
                <td className="py-2.5">
                  {values.map((item, idx) => (
                    <span key={idx}>
                      <Link
                        href={`/product-list?attributes=${item.trim()}`}
                        className="text-primary"
                        title={item}
                      >
                        {idx === values.length - 1 ? item : `${item}, `}
                      </Link>
                    </span>
                  ))}
                </td>
              </tr>
            ))}

          {columns && (
            <tr className="border-b border-gray-100">
              <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Columns</th>
              <td className="py-2.5">
                <span>{columns}</span>
              </td>
            </tr>
          )}
          {documentation && (
            <tr className="border-b border-gray-100">
              <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Documentation</th>
              <td className="py-2.5">
                <span className="text-primary">Well Documented</span>
              </td>
            </tr>
          )}
          {layout && (
            <tr className="border-b border-gray-100">
              <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Layout</th>
              <td className="py-2.5">
                <span>{layout}</span>
              </td>
            </tr>
          )}
          {tags && tags.length > 0 && (
            <tr>
              <th className="py-2.5 pr-4 text-left text-gray-600 font-medium">Tags</th>
              <td className="py-2.5">
                {tags.map((tag, index) => (
                  <span key={index}>
                    <Link
                      href={`/search-result/products?q=${tag.trim()}`}
                      className="text-primary"
                      title={tag}
                    >
                      {index === tags.length - 1 ? tag : `${tag}, `}
                    </Link>
                  </span>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { Check, X } from 'lucide-react';

type ComparisonData = {
  [key: string]: {
    basic: string | number | boolean;
    standard: string | number | boolean;
    premium: string | number | boolean;
  };
};

interface ComparisonTbodyProps {
  comparisonData: ComparisonData;
  packagesTabs: number;
}

export default function ComparisonTbody({
  comparisonData,
  packagesTabs,
}: ComparisonTbodyProps) {
  const checkedIcon = <Check className="h-5 w-5 text-primary" />;
  const crossMark = <X className="h-5 w-5 text-gray-400" />;

  const renderValue = (value: string | number | boolean) => {
    if (value === 'NotProvided') return crossMark;
    if (value === true) return checkedIcon;
    return value;
  };

  return (
    <tbody className="comparison-tbody">
      {Object.entries(comparisonData).map(([key, values]) => (
        <tr key={key}>
          <th className="comparison-attr-name">{key.replaceAll('_', ' ')}</th>
          <td className="comparison-value">{renderValue(values.basic)}</td>
          {packagesTabs > 1 && (
            <>
              <td className="comparison-value">{renderValue(values.standard)}</td>
              <td className="comparison-value">{renderValue(values.premium)}</td>
            </>
          )}
        </tr>
      ))}
    </tbody>
  );
}

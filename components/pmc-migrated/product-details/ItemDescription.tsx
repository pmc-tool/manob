// Item Description component with expandable content (matching original PMC design)
'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ItemDescriptionProps {
  shortDescription?: string;
  fullDescription: string;
}

export default function ItemDescription({ shortDescription, fullDescription }: ItemDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [cleanedDescription, setCleanedDescription] = useState<string>('');

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  // Utility to decode HTML entities
  const decodeHTMLEntities = (str: string) => {
    if (typeof window === 'undefined') return str;
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  useEffect(() => {
    const cleanHtmlContent = (html: string): string => {
      if (!html) return '';
      const decoded = decodeHTMLEntities(html);
      const parser = new DOMParser();
      const doc = parser.parseFromString(decoded, 'text/html');

      // Remove empty tags like <p><br/></p>
      const cleaned = doc.body.innerHTML.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '').trim();

      return cleaned;
    };

    const sanitizedDescription = cleanHtmlContent(fullDescription);
    setCleanedDescription(sanitizedDescription);
  }, [fullDescription]);

  return (
    <>
      <div
        className={`item-description mt-4 prose prose-sm max-w-none ${
          isExpanded ? '' : 'lg:max-h-none max-h-[400px] overflow-hidden'
        }`}
      >
        {shortDescription && <p className="text-gray-600 mb-4 text-[15px]">{shortDescription}</p>}

        {/* Render decoded HTML */}
        <div
          className="[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1 [&_p]:mb-4 [&_p]:text-[15px]"
          dangerouslySetInnerHTML={{ __html: cleanedDescription }}
        />
      </div>

      {/* Mobile toggle button */}
      <div className="lg:hidden mt-4 item-description-toggle">
        <button
          type="button"
          onClick={toggleContent}
          className="flex items-center justify-center gap-1 w-full text-primary font-semibold bg-transparent border-0 p-0"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>
    </>
  );
}

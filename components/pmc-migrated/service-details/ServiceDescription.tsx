// Service Description component (matching original PMC design)
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceDescriptionProps {
  shortDescription: string;
  fullDescription: string;
}

export default function ServiceDescription({
  shortDescription,
  fullDescription,
}: ServiceDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 992);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="service-description mb-6">
      {/* Short Description */}
      <div className="mb-4">
        <p className="text-gray-700 fz16 leading-relaxed">{shortDescription}</p>
      </div>

      {/* Full Description */}
      <div
        className={`item-description ${isMobile && !isExpanded ? 'item-description__mobile' : ''} ${
          isExpanded ? 'is-expanded' : ''
        }`}
      >
        <div
          className="prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: fullDescription }}
        />
      </div>

      {/* Mobile Expand/Collapse Button */}
      {isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-primary font-medium fz14 hover:underline"
        >
          {isExpanded ? (
            <>
              Show Less
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Read More
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

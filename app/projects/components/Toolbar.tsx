"use client";

import { Copy, Download } from "lucide-react";

type Props = {
  onCopy?: () => void;
  onDownload?: () => void;
};

export function Toolbar({ onCopy, onDownload }: Props) {
  return (
    <>
      {/* Small breadcrumb-like bar */}
      <div className="flex items-center justify-between px-3 py-1 text-[#6b7280] text-xs bg-gray-100">
        <span>hooks › use-mobile.ts</span>

        <div className="flex items-center gap-1">
          {/* Copy Code */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded h-7 w-7 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onCopy}
          >
            <Copy size={14} />
          </button>

          {/* Download Code */}

          <button
            type="button"
            className="inline-flex items-center justify-center rounded h-7 w-7 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={onDownload}
          >
            <Download size={14} />
          </button>
          <span>55 lines · 1 KB</span>
        </div>
      </div>
    </>
  );
}

'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { PulseApp } from '@/lib/mocks/pulse.mock';

interface AppListItemProps {
  app: PulseApp;
  showBorder?: boolean;
}

export function AppListItem({ app, showBorder = true }: AppListItemProps) {
  return (
    <Link href={`/market-2/${app.slug}`}>
      <div
        className={`flex items-center justify-between gap-2 py-3 hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2 ${
          showBorder ? 'border-b border-gray-200 lg:border-b-0' : ''
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${app.iconGradient} rounded-lg shrink-0`}
          />
          <div className="min-w-0">
            <h3 className="text-sm font-normal text-gray-900 truncate">
              {app.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">{app.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Heart size={16} className="text-gray-900" strokeWidth={1.5} />
          <span className="text-xs text-gray-900">{app.likes}</span>
        </div>
      </div>
    </Link>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { PulseApp } from '@/lib/mocks/pulse.mock';

interface AppCardProps {
  app: PulseApp;
}

export function AppCard({ app }: AppCardProps) {
  return (
    <Link href={`/market-2/${app.slug}`}>
      <article className="group cursor-pointer">
        <div className="aspect-video border border-gray-200 rounded-xl overflow-hidden mb-3 relative">
          <Image
            src={app.image}
            alt={app.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
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
      </article>
    </Link>
  );
}

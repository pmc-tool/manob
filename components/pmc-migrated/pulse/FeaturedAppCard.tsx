'use client';

import { Button } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import type { PulseApp } from '@/lib/mocks/pulse.mock';

interface FeaturedAppCardProps {
  app: PulseApp;
}

export function FeaturedAppCard({ app }: FeaturedAppCardProps) {
  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      <div className="aspect-video relative">
        <Image
          src={app.image}
          alt={app.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-3">
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
        <Link href={`/market-2/${app.slug}`}>
          <Button
            type="primary"
            size="small"
            className="!rounded-xl !text-xs !font-medium !px-4"
          >
            Visit project
          </Button>
        </Link>
      </div>
    </article>
  );
}

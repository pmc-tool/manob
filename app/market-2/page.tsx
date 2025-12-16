'use client';

import { FeaturedAppCard, AppCard, AppListItem } from '@/components/pmc-migrated/pulse';
import {
  featuredApps,
  builderApps,
  communityApps,
  entertainmentApps,
} from '@/lib/mocks/pulse.mock';

export default function PulseLandingPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Featured Apps Section */}
      <section className="mb-12 lg:mb-16">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Featured apps</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {featuredApps.map((app) => (
            <FeaturedAppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Apps for Builders Section */}
      <section className="mb-12 lg:mb-16">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Apps for builders</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builderApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>

      {/* Apps Loved by Community Section */}
      <section className="mb-12 lg:mb-16">
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Apps loved by the community
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
          {communityApps.map((app, index) => (
            <AppListItem
              key={app.id}
              app={app}
              showBorder={index < communityApps.length - 1}
            />
          ))}
        </div>
      </section>

      {/* Personal Apps & Entertainment Section */}
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-6">
          Personal apps & entertainment
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entertainmentApps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </section>
    </div>
  );
}

// Why Choose manob.ai section
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const tabs = [
  {
    id: 'dev-marketplace',
    label: 'Dev-Only Marketplace',
    number: '01',
    heading: 'Dev-Only Marketplace',
    description:
      'No random gigs. No "design my logo" requests. Every buyer on manob.ai is looking for real development work—code, scripts, services. Your skills are the product here.',
    cta: 'Try Packmycode',
    img: '/images/become-seller/dev-only.png',
  },
  {
    id: 'products-services',
    label: 'Products + Services Together',
    number: '02',
    heading: 'Products + Services Together',
    description:
      'Sell a React component library AND offer customization services. Most platforms force you to choose. We let you do both from one profile.',
    cta: 'Try Packmycode',
    img: '/images/become-seller/marketplace.png',
  },
  {
    id: 'fair-visibility',
    label: 'Fair Visibility',
    number: '03',
    heading: 'Fair Visibility',
    description:
      "New sellers get exposure too. Our system rotates so you're not competing only on reviews. Quality work gets noticed, not seniority.",
    cta: 'Learn More',
    img: '/images/become-seller/fair.png',
  },
  {
    id: 'fees',
    label: 'Transparent Fees',
    number: '04',
    heading: 'Transparent Fees',
    description:
      'No hidden charges, no surprise deductions. You know exactly what you earn on every sale. Early sellers get an even better rate.',
    cta: 'Learn More',
    img: '/images/become-seller/transparent-fees.png',
  },
];

export default function WhyChooseSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Why Developers Choose manob.ai
        </h3>
        <p className="text-center text-gray-500 mb-8 text-lg">
          Designed for developers seeking trustworthy clients, real projects, and fast payouts.
        </p>

        {/* Tab Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveIndex(idx)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeIndex === idx
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-100 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 border-2 border-gray-900 rounded-lg font-bold mb-4">
                  {tabs[activeIndex].number}
                </div>
                <h3 className="text-2xl font-bold">{tabs[activeIndex].heading}</h3>
              </div>
              <p className="text-gray-600 mb-4">{tabs[activeIndex].description}</p>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center text-gray-900 font-medium hover:underline"
              >
                ↪ {tabs[activeIndex].cta}
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Image
                src={tabs[activeIndex].img}
                alt={tabs[activeIndex].heading}
                width={400}
                height={300}
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

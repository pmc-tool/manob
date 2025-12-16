// How selling on manob.ai works section
'use client';

import Image from 'next/image';
import { CurrencyIcon, FeedIcon, StarIcon, UserIcon } from './BecomeSellerSvg';

const steps = [
  {
    number: '01',
    title: 'Create your free seller account',
    desc: 'Sign up in under 2 minutes. No credit card required, no approval process. Start building your profile immediately.',
    icon: UserIcon,
  },
  {
    number: '02',
    title: 'Set up your profile and list products/services',
    desc: 'Add your skills, portfolio, and pricing. List digital products, development services, or both.',
    icon: FeedIcon,
  },
  {
    number: '03',
    title: 'Get discovered',
    desc: 'Buyers find you through search, skill tags, and job posts. Our matching system connects you with relevant opportunities.',
    icon: StarIcon,
  },
  {
    number: '04',
    title: 'Deliver work and withdraw earnings',
    desc: 'Complete orders, collect reviews, and withdraw your earnings. Rinse and repeat.',
    icon: CurrencyIcon,
  },
];

export default function PackmycodeWork() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">How selling on manob.ai works</h2>
        <p className="text-gray-500">
          Start your journey, publish offerings, gain visibility, deliver tasks, and grow your
          income.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Image */}
        <div className="relative">
          <Image
            src="/images/become-seller/become-seller-h.png"
            alt="How it works"
            width={500}
            height={400}
            className="rounded-mdxl"
          />
          {/* Stats Overlay */}
          <div className="absolute bottom-4 left-0 right-0 mx-4 lg:mx-0 lg:left-auto lg:-right-4">
            <div className="bg-gray-100 rounded-xl p-4 shadow-lg">
              <div className="text-sm font-medium mb-2 bg-gray-200 inline-block px-3 py-1 rounded-t-lg">
                Monthly Achievement
              </div>
              <div className="flex gap-6 bg-gray-200 p-4 rounded-lg rounded-tl-none">
                <div className="text-center">
                  <div className="text-2xl font-bold">12k+</div>
                  <div className="text-xs text-gray-600">New Sellers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24k+</div>
                  <div className="text-xs text-gray-600">New Buyers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">90%</div>
                  <div className="text-xs text-gray-600">Get Hiring Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Steps */}
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex gap-4 p-4 bg-gray-100 rounded-xl"
            >
              <div className="flex-shrink-0">
                <div className="w-9 h-9 border-2 border-gray-900 rounded-lg flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
              </div>
              <div className="flex-1">
                <h5 className="font-semibold mb-1">{step.title}</h5>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
              <div className="flex-shrink-0 self-center">
                <step.icon />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

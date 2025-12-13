// Ready to Earn CTA section
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function ReadyToEarn() {
  return (
    <div
      className="bg-emerald-600 py-16 md:py-12"
      style={{
        backgroundImage: 'url(/images/white-lines.webp)',
        backgroundSize: 'contain',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
              Ready to turn your code into income?
            </h2>
            <p className="text-white/90 mb-6">
              Join as an early seller and lock in 10% commission for your first 12 months. No
              monthly fees. Built for developers.
            </p>
            <div className="flex gap-3 mt-8">
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Get Started - It&apos;s Free
              </Link>
            </div>
            <p className="text-white/75 mt-4 text-sm">
              * Exclusive tech services and products, only on PackMyCode
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <Image
              src="/images/become-seller/readytoearn.png"
              alt="Ready to earn"
              width={400}
              height={300}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

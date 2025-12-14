// Become Seller Page - Main component
'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Accordion from './Accordion';
import WhyChooseSection from './WhyChoosePackMyCode';
import SellSection from './SellSection';
import ToolsSection from './ToolsSection';
import PackmycodeWork from './PackmycodeWork';
import ReadyToEarn from './ReadyToEarn';

// Dynamically import Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Import animation data
import animationData from '@/lib/animations/final.json';

const faqs = [
  {
    que: 'Do I need to pay to join as a seller?',
    description:
      'No. There is no monthly fee to become a seller on manob.ai. You only pay a commission when you make a sale.',
  },
  {
    que: 'Can I sell both products and services from the same account?',
    description:
      "Yes. That's what makes manob.ai different. List digital products (code, templates, plugins) and offer development services (custom work, bug fixes, consulting) all from one profile.",
  },
  {
    que: 'What is the commission and how does the 10% early-seller offer work?',
    description:
      "If you sign up now, you lock in a 10% commission rate for your first 12 months. After that, standard platform fees apply. We'll always communicate fee changes clearly in advance.",
  },
  {
    que: 'Can I sell code I already list on other marketplaces?',
    description:
      "Yes, as long as you own the rights and aren't violating exclusivity agreements with other platforms. Many sellers list the same products across multiple marketplaces.",
  },
  {
    que: 'What kind of projects do buyers usually post here?',
    description:
      'Buyers on manob.ai are looking for development work: custom web apps, mobile development, bug fixes, API integrations, code customizations, and ready-made solutions they can deploy.',
  },
  {
    que: 'Is there any review or rating system for sellers?',
    description:
      "Yes. Buyers can leave reviews after completed orders. Your rating builds over time and helps you stand out. But we also give new sellers visibility so you're not starting from zero.",
  },
  {
    que: 'Can I work with buyers from any country?',
    description:
      'Yes. manob.ai is a global marketplace. You can work with buyers worldwide, though payout options may vary by region.',
  },
  {
    que: 'How do payouts work?',
    description:
      'Once an order is completed and the clearance period passes, funds are available for withdrawal. Payout methods and minimum thresholds are displayed in your seller dashboard.',
  },
];

export default function BecomeSellerPage() {
  return (
    <>
      {/* Hero Section */}
      <div
        className="bg-gray-50 py-12 lg:py-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Column - Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight tracking-tight">
                Turn your code and skills into real income
              </h1>
              <p className="text-gray-600 text-lg mb-6">
                Sell source code, themes, scripts, and development services in one place. No
                juggling multiple platforms. One account, two earning streams.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/auth/sign-in"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Become a Seller
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Browse Marketplace
                </Link>
              </div>
            </div>

            {/* Right Column - Lottie Animation */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-lg">
                <Lottie animationData={animationData} loop={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <WhyChooseSection />
      <SellSection />
      <ToolsSection />
      <PackmycodeWork />

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Frequently Asked Questions</h3>
          <p className="text-gray-500">
            Need help with something? Here are our most frequently asked questions.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqs} />
        </div>
      </section>

      {/* CTA Section */}
      <ReadyToEarn />
    </>
  );
}

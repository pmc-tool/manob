// What You Can Sell section
'use client';

import Image from 'next/image';

const items = [
  {
    id: '01',
    title: 'Code & Scripts',
    desc: 'Utility scripts, automation tools, algorithms, and reusable code snippets that save developers time.',
    img: '/images/become-seller/seller1.png',
  },
  {
    id: '02',
    title: 'Themes & Templates',
    desc: 'Website themes, landing page templates, admin dashboards, and UI kits for popular frameworks.',
    img: '/images/become-seller/seller2.png',
  },
  {
    id: '03',
    title: 'Plugins & Add-Ons',
    desc: 'Extensions for CMS platforms, IDE plugins, browser extensions, and framework add-ons.',
    img: '/images/become-seller/seller3.png',
  },
  {
    id: '04',
    title: 'Projects & SaaS Starters',
    desc: 'Complete applications, SaaS boilerplates, mobile app templates, and production-ready starter kits.',
    img: '/images/become-seller/seller4.png',
  },
];

export default function SellSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            What You Can Sell On manob.ai
          </h2>
          <p className="text-gray-600">
            Sell everything from reusable code, templates, and plugins to full projects and SaaS
            starters giving creators a powerful marketplace to share, monetize, and grow their
            digital products.
          </p>
        </div>

        {/* Right Side - Timeline */}
        <div className="lg:col-span-3 relative">
          {/* Vertical Line */}
          <div className="absolute left-7 top-0 w-0.5 h-full bg-red-500 hidden md:block" />

          {/* Steps */}
          {items.map((item) => (
            <div key={item.id} className="flex items-start relative mb-8 md:mb-12">
              {/* Number Badge */}
              <div className="flex-shrink-0 w-14 h-11 bg-white rounded-lg flex items-center justify-center border-none z-10">
                <span className="text-2xl font-bold text-gray-900">{item.id}</span>
              </div>

              {/* Content */}
              <div className="ml-4 flex-1">
                <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>

              {/* Image */}
              <div className="hidden lg:block ml-auto">
                <Image
                  src={item.img}
                  width={300}
                  height={200}
                  alt={item.title}
                  className="rounded-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

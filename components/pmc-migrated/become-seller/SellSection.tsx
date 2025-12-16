// What You Can Sell section
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export default function SellSection() {
  const leftItems = items.slice(0, 2);
  const rightItems = items.slice(2, 4);

  return (
    <section className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          What You Can Sell On manob.ai
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-600"
        >
          Sell everything from reusable code, templates, and plugins to full projects and SaaS
          starters giving creators a powerful marketplace to share, monetize, and grow their
          digital products.
        </motion.p>
      </div>

      {/* 2x2 Grid Layout */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {leftItems.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-red-500">{item.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <Image
                  src={item.img}
                  width={120}
                  height={80}
                  alt={item.title}
                  className="rounded-xl object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {rightItems.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-red-500">{item.id}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-lg font-bold mb-1">{item.title}</h5>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
              <div className="hidden sm:block flex-shrink-0">
                <Image
                  src={item.img}
                  width={120}
                  height={80}
                  alt={item.title}
                  className="rounded-xl object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

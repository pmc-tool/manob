// Footer component - Reusable site footer
import Link from 'next/link';

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  columns?: FooterColumn[];
  dark?: boolean;
}

const defaultColumns: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', href: '#features' },
      { label: 'Code packs', href: '#templates' },
      { label: 'Pricing', href: '#cta' },
      { label: 'Managed delivery', href: '#services' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Security', href: '/security' },
      { label: 'Case studies', href: '/case-studies' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About manob.ai', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
    ],
  },
];

export default function Footer({ columns = defaultColumns, dark = false }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className={`py-12 border-t ${
        dark
          ? 'bg-gray-900 text-gray-300 border-gray-800'
          : 'bg-[#fafafa] text-gray-600 border-gray-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {columns.map((column) => (
            <div key={column.title}>
              <h4
                className={`font-semibold mb-4 ${
                  dark ? 'text-white' : 'text-gray-900'
                }`}
              >
                {column.title}
              </h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors ${
                        dark
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            dark ? 'border-gray-800' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-semibold ${
                dark ? 'text-white' : 'text-gray-900'
              }`}
            >
              manob.ai
            </span>
            <span
              className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Human + AI build workspace
            </span>
          </div>
          <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
            &copy; {currentYear} manob.ai. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

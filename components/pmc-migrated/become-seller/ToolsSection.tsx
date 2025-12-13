// Tools That Make Selling Easier section
'use client';

const data = [
  {
    number: '01',
    title: 'All Client Messages In One Place',
    desc: 'Keep every conversation organized in one centralized inbox, reducing missed messages and eliminating scattered communication channels.',
  },
  {
    number: '02',
    title: 'Track Every Project Step With Ease',
    desc: 'Monitor deadlines, milestones, and deliverables smoothly to keep all your ongoing projects organized and running efficiently.',
  },
  {
    number: '03',
    title: 'Deliver Project Files Securely And Easily',
    desc: 'Share final files safely with automatic download links, ensuring buyers receive their products without delays or confusion.',
  },
  {
    number: '04',
    title: 'Understand Performance Through Simple Analytics',
    desc: 'Track views, clicks, and orders to analyze what attracts buyers and improve your selling strategy effectively.',
  },
];

export default function ToolsSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Tools That Make Selling Easier</h2>
        <p className="text-gray-500">
          Designed for developers seeking trustworthy clients, real projects, and fast payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map((item) => (
          <div
            key={item.number}
            className="flex items-start gap-4 p-6 bg-gray-100 rounded-xl"
          >
            <div className="flex-shrink-0">
              <div className="w-9 h-9 border-2 border-gray-900 rounded-lg flex items-center justify-center font-bold">
                {item.number}
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-2">{item.title}</h5>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

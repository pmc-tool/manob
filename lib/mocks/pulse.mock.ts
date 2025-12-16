export interface PulseApp {
  id: string;
  name: string;
  tagline: string;
  image: string;
  iconGradient: string;
  likes: number;
  slug: string;
}

export const featuredApps: PulseApp[] = [
  {
    id: 'feat-1',
    name: 'Attendflow',
    tagline: 'Event marketing made simple',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    iconGradient: 'from-violet-500 to-purple-600',
    likes: 378,
    slug: 'attendflow',
  },
  {
    id: 'feat-2',
    name: 'Pilates Circle by Cult',
    tagline: 'Move, full circle.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    iconGradient: 'from-rose-400 to-pink-500',
    likes: 245,
    slug: 'pilates-circle',
  },
];

export const builderApps: PulseApp[] = [
  {
    id: 'build-1',
    name: 'Iconstack',
    tagline: '50,000+ Free SVG Icons',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&q=80',
    iconGradient: 'from-blue-500 to-cyan-400',
    likes: 336,
    slug: 'iconstack',
  },
  {
    id: 'build-2',
    name: 'Opux AI',
    tagline: 'Every successful app starts here',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    iconGradient: 'from-emerald-500 to-teal-400',
    likes: 211,
    slug: 'opux-ai',
  },
  {
    id: 'build-3',
    name: 'Bannerman.io',
    tagline: 'Create Stunning Logos with AI',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80',
    iconGradient: 'from-orange-500 to-amber-400',
    likes: 81,
    slug: 'bannerman',
  },
];

export const communityApps: PulseApp[] = [
  {
    id: 'comm-1',
    name: 'Attendflow',
    tagline: 'Event marketing made simple',
    image: '',
    iconGradient: 'from-violet-500 to-purple-600',
    likes: 378,
    slug: 'attendflow',
  },
  {
    id: 'comm-2',
    name: 'ExamAi',
    tagline: 'Create, grade, and analyze exams with AI',
    image: '',
    iconGradient: 'from-indigo-500 to-blue-600',
    likes: 346,
    slug: 'exam-ai',
  },
  {
    id: 'comm-3',
    name: 'Iconstack',
    tagline: '50,000+ Free SVG Icons',
    image: '',
    iconGradient: 'from-blue-500 to-cyan-400',
    likes: 336,
    slug: 'iconstack',
  },
  {
    id: 'comm-4',
    name: 'Narva',
    tagline: 'Design, reimagined.',
    image: '',
    iconGradient: 'from-slate-700 to-slate-900',
    likes: 224,
    slug: 'narva',
  },
  {
    id: 'comm-5',
    name: 'Opux AI',
    tagline: 'Every successful app starts here',
    image: '',
    iconGradient: 'from-emerald-500 to-teal-400',
    likes: 211,
    slug: 'opux-ai',
  },
  {
    id: 'comm-6',
    name: 'Creativable',
    tagline: 'All-in-one CRM, AI Assistant, teams',
    image: '',
    iconGradient: 'from-fuchsia-500 to-pink-500',
    likes: 210,
    slug: 'creativable',
  },
  {
    id: 'comm-7',
    name: 'NeuroTunes AI',
    tagline: 'Music engineered to power focus',
    image: '',
    iconGradient: 'from-purple-600 to-violet-700',
    likes: 205,
    slug: 'neurotunes-ai',
  },
  {
    id: 'comm-8',
    name: 'Createspace',
    tagline: 'AI Media Made Simple',
    image: '',
    iconGradient: 'from-sky-500 to-blue-600',
    likes: 109,
    slug: 'createspace',
  },
];

export const entertainmentApps: PulseApp[] = [
  {
    id: 'ent-1',
    name: 'ExamAi',
    tagline: 'Create, grade, and analyze exams with AI',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
    iconGradient: 'from-indigo-500 to-blue-600',
    likes: 346,
    slug: 'exam-ai',
  },
  {
    id: 'ent-2',
    name: 'Narva',
    tagline: 'Design, reimagined.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80',
    iconGradient: 'from-slate-700 to-slate-900',
    likes: 224,
    slug: 'narva',
  },
  {
    id: 'ent-3',
    name: 'NeuroTunes AI',
    tagline: 'Music engineered to power focus',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80',
    iconGradient: 'from-purple-600 to-violet-700',
    likes: 205,
    slug: 'neurotunes-ai',
  },
  {
    id: 'ent-4',
    name: 'Creativable',
    tagline: 'All-in-one CRM, AI Assistant, teams',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    iconGradient: 'from-fuchsia-500 to-pink-500',
    likes: 210,
    slug: 'creativable',
  },
  {
    id: 'ent-5',
    name: 'Createspace',
    tagline: 'AI Media Made Simple',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    iconGradient: 'from-sky-500 to-blue-600',
    likes: 109,
    slug: 'createspace',
  },
  {
    id: 'ent-6',
    name: 'Flowstate',
    tagline: 'Productivity meets mindfulness',
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80',
    iconGradient: 'from-teal-500 to-green-400',
    likes: 187,
    slug: 'flowstate',
  },
  {
    id: 'ent-7',
    name: 'Pixelcraft',
    tagline: 'Design tools for everyone',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    iconGradient: 'from-pink-500 to-rose-400',
    likes: 156,
    slug: 'pixelcraft',
  },
  {
    id: 'ent-8',
    name: 'Soundwave',
    tagline: 'Your personal podcast studio',
    image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80',
    iconGradient: 'from-amber-500 to-orange-400',
    likes: 134,
    slug: 'soundwave',
  },
  {
    id: 'ent-9',
    name: 'Memorybox',
    tagline: 'Capture moments that matter',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    iconGradient: 'from-red-500 to-pink-500',
    likes: 98,
    slug: 'memorybox',
  },
];

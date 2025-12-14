// CONTRACT: GET /home/popular-categories
// Response structure: { data: Category[] }
// MOCK: This mock data matches the exact manob.ai API response structure

export interface Category {
  id: number;
  slug: string;
  title: string;
  web_icon: string;
}

// MOCK: Sample categories for development/layout validation
export const mockCategories: Category[] = [
  {
    id: 1,
    slug: 'web-development',
    title: 'Web Development',
    web_icon: 'categories/web-development.png',
  },
  {
    id: 2,
    slug: 'mobile-development',
    title: 'Mobile Development',
    web_icon: 'categories/mobile-development.png',
  },
  {
    id: 3,
    slug: 'ui-ux-design',
    title: 'UI/UX Design',
    web_icon: 'categories/ui-ux-design.png',
  },
  {
    id: 4,
    slug: 'data-science',
    title: 'Data Science',
    web_icon: 'categories/data-science.png',
  },
  {
    id: 5,
    slug: 'devops',
    title: 'DevOps & Cloud',
    web_icon: 'categories/devops.png',
  },
  {
    id: 6,
    slug: 'ai-machine-learning',
    title: 'AI & Machine Learning',
    web_icon: 'categories/ai-ml.png',
  },
  {
    id: 7,
    slug: 'blockchain',
    title: 'Blockchain',
    web_icon: 'categories/blockchain.png',
  },
  {
    id: 8,
    slug: 'game-development',
    title: 'Game Development',
    web_icon: 'categories/game-dev.png',
  },
];

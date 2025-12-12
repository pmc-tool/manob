// MOCK: Forum data types and mock data for discussion functionality

export interface ForumUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
}

export interface ForumQuestion {
  id: string;
  title: string;
  body: string;
  creator_meta: ForumUser;
  total_comments: number;
  views: number;
  total_likes: number;
  is_pinned: boolean;
  is_featured: boolean;
  is_solved: boolean;
  created_at: string;
  updated_at: string;
  total_posts?: number;
  total_solution?: number;
  is_pin_req?: boolean;
}

export interface ForumComment {
  id: string;
  forum_id: string;
  body: string;
  creator_meta: ForumUser;
  total_likes: number;
  is_liked?: boolean;
  is_disliked?: boolean;
  is_right_answer: boolean;
  created_at: string;
  updated_at?: string;
  solved_at?: string;
}

export interface ForumContributor {
  first_name: string;
  last_name: string;
  profile_image: string;
  total_contributed: number;
}

export interface ForumPagination {
  current_page: number;
  total_pages: number;
  total_items: number;
  per_page: number;
}

// MOCK: Current logged in user
export const mockForumCurrentUser: ForumUser = {
  id: 'user-1',
  first_name: 'John',
  last_name: 'Doe',
  profile_image: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// MOCK: Top contributors
export const mockTopContributors: ForumContributor[] = [
  {
    first_name: 'Alice',
    last_name: 'Johnson',
    profile_image: 'https://randomuser.me/api/portraits/women/1.jpg',
    total_contributed: 156,
  },
  {
    first_name: 'Bob',
    last_name: 'Smith',
    profile_image: 'https://randomuser.me/api/portraits/men/2.jpg',
    total_contributed: 134,
  },
  {
    first_name: 'Emma',
    last_name: 'Wilson',
    profile_image: 'https://randomuser.me/api/portraits/women/2.jpg',
    total_contributed: 98,
  },
  {
    first_name: 'James',
    last_name: 'Brown',
    profile_image: 'https://randomuser.me/api/portraits/men/3.jpg',
    total_contributed: 87,
  },
];

// MOCK: Forum questions
export const mockForumQuestions: ForumQuestion[] = [
  {
    id: 'q-1',
    title: 'How to implement authentication in Next.js 14 with App Router?',
    body: '<p>I\'m trying to implement authentication in my Next.js 14 application using the App Router. I\'ve been looking at various solutions like NextAuth.js but I\'m not sure about the best approach.</p><p>What\'s the recommended way to handle authentication with the new App Router architecture?</p>',
    creator_meta: {
      id: 'user-2',
      first_name: 'Alice',
      last_name: 'Johnson',
      profile_image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    total_comments: 12,
    views: 1250,
    total_likes: 45,
    is_pinned: true,
    is_featured: true,
    is_solved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    total_posts: 156,
    total_solution: 23,
  },
  {
    id: 'q-2',
    title: 'Best practices for state management in React 2024?',
    body: '<p>With all the options available today (Redux, Zustand, Jotai, React Query, etc.), what\'s the best approach for state management in a medium-sized React application?</p><p>I need to handle both server state and client state.</p>',
    creator_meta: {
      id: 'user-3',
      first_name: 'Bob',
      last_name: 'Smith',
      profile_image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    total_comments: 8,
    views: 890,
    total_likes: 32,
    is_pinned: false,
    is_featured: true,
    is_solved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    total_posts: 134,
    total_solution: 18,
  },
  {
    id: 'q-3',
    title: 'TypeScript generics - when and how to use them effectively?',
    body: '<p>I understand basic TypeScript types but I\'m struggling with generics. Can someone explain when to use generics and provide some practical examples?</p><pre class="ql-syntax" spellcheck="false"><code>function example<T>(arg: T): T {\n  return arg;\n}</code></pre>',
    creator_meta: {
      id: 'user-4',
      first_name: 'Emma',
      last_name: 'Wilson',
      profile_image: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    total_comments: 15,
    views: 2100,
    total_likes: 67,
    is_pinned: true,
    is_featured: false,
    is_solved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    total_posts: 98,
    total_solution: 12,
  },
  {
    id: 'q-4',
    title: 'How to optimize bundle size in a Next.js application?',
    body: '<p>My Next.js app bundle size is getting too large. What are the best techniques to reduce bundle size and improve loading performance?</p>',
    creator_meta: {
      id: 'user-5',
      first_name: 'James',
      last_name: 'Brown',
      profile_image: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    total_comments: 6,
    views: 450,
    total_likes: 18,
    is_pinned: false,
    is_featured: false,
    is_solved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    total_posts: 87,
    total_solution: 9,
  },
  {
    id: 'q-5',
    title: 'Tailwind CSS vs CSS Modules - which should I use?',
    body: '<p>Starting a new project and trying to decide between Tailwind CSS and CSS Modules. What are the pros and cons of each approach?</p>',
    creator_meta: {
      id: 'user-6',
      first_name: 'Sarah',
      last_name: 'Davis',
      profile_image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    total_comments: 20,
    views: 3200,
    total_likes: 89,
    is_pinned: false,
    is_featured: true,
    is_solved: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
    total_posts: 45,
    total_solution: 5,
  },
  {
    id: 'q-6',
    title: 'React Server Components - when to use them?',
    body: '<p>I\'m confused about when to use Server Components vs Client Components in Next.js 14. Can someone explain the decision criteria?</p>',
    creator_meta: {
      id: 'user-7',
      first_name: 'Michael',
      last_name: 'Chen',
      profile_image: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    total_comments: 4,
    views: 320,
    total_likes: 12,
    is_pinned: false,
    is_featured: false,
    is_solved: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    total_posts: 23,
    total_solution: 2,
  },
];

// MOCK: Comments/Answers for questions
export const mockForumComments: Record<string, ForumComment[]> = {
  'q-1': [
    {
      id: 'c-1',
      forum_id: 'q-1',
      body: '<p>The best approach for authentication in Next.js 14 with App Router is to use <strong>NextAuth.js v5</strong> (Auth.js). Here\'s a basic setup:</p><pre class="ql-syntax" spellcheck="false"><code>// auth.ts\nimport NextAuth from "next-auth"\nimport GitHub from "next-auth/providers/github"\n\nexport const { handlers, auth } = NextAuth({\n  providers: [GitHub],\n})</code></pre><p>You can then use the <code>auth()</code> function in your Server Components to check authentication status.</p>',
      creator_meta: {
        id: 'user-3',
        first_name: 'Bob',
        last_name: 'Smith',
        profile_image: 'https://randomuser.me/api/portraits/men/2.jpg',
      },
      total_likes: 23,
      is_liked: true,
      is_right_answer: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      solved_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'c-2',
      forum_id: 'q-1',
      body: '<p>You can also consider using Clerk or Supabase Auth if you want a managed solution. They both have excellent Next.js integrations.</p>',
      creator_meta: {
        id: 'user-4',
        first_name: 'Emma',
        last_name: 'Wilson',
        profile_image: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      total_likes: 15,
      is_right_answer: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    },
    {
      id: 'c-3',
      forum_id: 'q-1',
      body: '<p>Thanks for both suggestions! I went with NextAuth.js and it\'s working great.</p>',
      creator_meta: {
        id: 'user-2',
        first_name: 'Alice',
        last_name: 'Johnson',
        profile_image: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      total_likes: 5,
      is_right_answer: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    },
  ],
  'q-2': [
    {
      id: 'c-4',
      forum_id: 'q-2',
      body: '<p>For a medium-sized app, I recommend this combination:</p><ul><li><strong>React Query (TanStack Query)</strong> for server state</li><li><strong>Zustand</strong> for client state</li></ul><p>This gives you the best of both worlds - React Query handles caching, refetching, and server state beautifully, while Zustand provides a simple, lightweight solution for client state.</p>',
      creator_meta: {
        id: 'user-5',
        first_name: 'James',
        last_name: 'Brown',
        profile_image: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      total_likes: 18,
      is_right_answer: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
  ],
  'q-3': [
    {
      id: 'c-5',
      forum_id: 'q-3',
      body: '<p>Generics are useful when you want to create reusable components or functions that work with multiple types. Here are some practical examples:</p><pre class="ql-syntax" spellcheck="false"><code>// Generic function\nfunction getFirst<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\n\n// Generic interface\ninterface Response<T> {\n  data: T;\n  status: number;\n}\n\n// Usage\nconst first = getFirst([1, 2, 3]); // number\nconst response: Response<User> = { data: user, status: 200 };</code></pre>',
      creator_meta: {
        id: 'user-2',
        first_name: 'Alice',
        last_name: 'Johnson',
        profile_image: 'https://randomuser.me/api/portraits/women/1.jpg',
      },
      total_likes: 45,
      is_liked: true,
      is_right_answer: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      solved_at: new Date(Date.now() - 1000 * 60 * 60 * 90).toISOString(),
    },
  ],
};

// MOCK: Top voted questions
export const mockTopQuestions: { id: string; title: string }[] = [
  { id: 'q-5', title: 'Tailwind CSS vs CSS Modules - which should I use?' },
  { id: 'q-3', title: 'TypeScript generics - when and how to use them effectively?' },
  { id: 'q-1', title: 'How to implement authentication in Next.js 14 with App Router?' },
  { id: 'q-2', title: 'Best practices for state management in React 2024?' },
];

// Forum tabs configuration
export const forumTabs = [
  { label: 'Recent', filter: 'recent' },
  { label: 'Unanswered', filter: 'unanswered' },
  { label: 'Unsolved', filter: 'unsolved' },
  { label: 'Solved', filter: 'solved' },
  { label: 'Pinned', filter: 'pinned' },
];

// Helper function to format numbers
export const formatNumber = (num: number): string => {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(num);
};

// Helper function to filter questions
export const filterQuestions = (
  questions: ForumQuestion[],
  filter: string,
  searchTerm?: string
): ForumQuestion[] => {
  let filtered = [...questions];

  // Apply search filter
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (q) =>
        q.title.toLowerCase().includes(term) ||
        q.body.toLowerCase().includes(term)
    );
  }

  // Apply tab filter
  switch (filter) {
    case 'unanswered':
      filtered = filtered.filter((q) => q.total_comments === 0);
      break;
    case 'unsolved':
      filtered = filtered.filter((q) => !q.is_solved);
      break;
    case 'solved':
      filtered = filtered.filter((q) => q.is_solved);
      break;
    case 'pinned':
      filtered = filtered.filter((q) => q.is_pinned);
      break;
    default:
      // 'recent' - sort by date
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return filtered;
};

// Helper function to sort questions
export const sortQuestions = (
  questions: ForumQuestion[],
  sortBy: string
): ForumQuestion[] => {
  const sorted = [...questions];

  switch (sortBy) {
    case 'likes':
      sorted.sort((a, b) => b.total_likes - a.total_likes);
      break;
    case 'views':
      sorted.sort((a, b) => b.views - a.views);
      break;
    default:
      // DESC - most recent first
      sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return sorted;
};

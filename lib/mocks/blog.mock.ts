// Blog Mock Data for PMC Engine

export interface BlogAuthor {
  first_name: string;
  last_name: string;
  user_name?: string;
  profile_image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description?: string;
  cover_image: string;
  created_at: string;
  updated_at: string;
  user_meta: BlogAuthor;
  tags: string;
}

export interface BlogPagination {
  total_count: number;
  total_pages: number;
  current_page: number;
  per_page: number;
}

export const mockBlogTags = [
  'Development',
  'Design',
  'Freelancing',
  'Business',
  'Tutorial',
  'Tips & Tricks',
];

// Sample HTML content for blog post details
const sampleBlogContent = `
<p>In today's competitive digital marketplace, building a successful freelance career requires more than just technical skills. It demands a strategic approach to positioning yourself, finding clients, and delivering exceptional value.</p>

<h2>Getting Started with Freelancing</h2>
<p>The first step in your freelance journey is to identify your niche. What are you exceptionally good at? What problems can you solve better than most people? Once you've identified your strengths, you can begin to build a portfolio that showcases your best work.</p>

<h3>Building Your Portfolio</h3>
<p>Your portfolio is your most powerful marketing tool. It should demonstrate not just what you can do, but the results you've achieved for clients. Include case studies that show the problem, your approach, and the outcome.</p>

<blockquote>
The best freelancers don't just complete tasks—they solve problems and create value for their clients.
</blockquote>

<h2>Finding Your First Clients</h2>
<p>Many new freelancers struggle to find their first clients. Here are some proven strategies:</p>
<ul>
  <li>Leverage your existing network—friends, former colleagues, and industry contacts</li>
  <li>Create valuable content that demonstrates your expertise</li>
  <li>Participate in online communities where your potential clients hang out</li>
  <li>Consider starting with freelance platforms to build reviews and experience</li>
</ul>

<h3>Networking Effectively</h3>
<p>Networking isn't just about collecting contacts—it's about building genuine relationships. Focus on providing value to others, and opportunities will naturally follow.</p>

<h2>Setting Your Rates</h2>
<p>One of the biggest challenges freelancers face is pricing their services. Many new freelancers undercharge because they lack confidence or fear losing clients.</p>

<p>Remember: your rates should reflect the value you provide, not just the time you spend. Consider factors like:</p>
<ul>
  <li>Your level of expertise and experience</li>
  <li>The complexity of the project</li>
  <li>The value your work creates for the client</li>
  <li>Market rates for similar services</li>
</ul>

<h2>Delivering Exceptional Work</h2>
<p>The key to long-term success in freelancing is delivering work that exceeds expectations. This means:</p>
<ul>
  <li>Clear communication throughout the project</li>
  <li>Meeting (or beating) deadlines</li>
  <li>Paying attention to details</li>
  <li>Being responsive to feedback</li>
</ul>

<h3>Managing Client Relationships</h3>
<p>Strong client relationships lead to repeat business and referrals. Always be professional, responsive, and focused on delivering value.</p>

<h2>Conclusion</h2>
<p>Building a successful freelance career takes time and effort, but the rewards—flexibility, autonomy, and the ability to do work you love—are well worth it. Start with a clear strategy, focus on delivering exceptional value, and continuously improve your skills and processes.</p>
`;

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'How to Build a Successful Freelance Career in 2024',
    slug: 'how-to-build-successful-freelance-career-2024',
    short_description:
      'Discover the essential strategies and tips for building a thriving freelance career in today\'s competitive digital marketplace. Learn from industry experts and successful freelancers.',
    description: sampleBlogContent,
    cover_image: '/images/sample1.jpg',
    created_at: '2024-12-10T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z',
    user_meta: {
      first_name: 'John',
      last_name: 'Doe',
      profile_image: '/images/team/team-1.jpg',
    },
    tags: 'Freelancing,Business',
  },
  {
    id: '2',
    title: 'Top 10 JavaScript Frameworks for Modern Web Development',
    slug: 'top-10-javascript-frameworks-modern-web-development',
    short_description:
      'Explore the most popular JavaScript frameworks that are shaping modern web development. From React to Vue, find the right tool for your next project.',
    description: sampleBlogContent,
    cover_image: '/images/sample2.jpg',
    created_at: '2024-12-08T14:30:00Z',
    updated_at: '2024-12-08T14:30:00Z',
    user_meta: {
      first_name: 'Jane',
      last_name: 'Smith',
      profile_image: '/images/team/team-2.jpg',
    },
    tags: 'Development,Tutorial',
  },
  {
    id: '3',
    title: 'UI/UX Design Trends That Will Dominate 2025',
    slug: 'ui-ux-design-trends-2025',
    short_description:
      'Stay ahead of the curve with these emerging UI/UX design trends. Learn how to create stunning user experiences that captivate and convert.',
    description: sampleBlogContent,
    cover_image: '/images/sample3.jpg',
    created_at: '2024-12-05T09:15:00Z',
    updated_at: '2024-12-05T09:15:00Z',
    user_meta: {
      first_name: 'Mike',
      last_name: 'Johnson',
      profile_image: '/images/team/team-3.jpg',
    },
    tags: 'Design,Tips & Tricks',
  },
  {
    id: '4',
    title: 'The Complete Guide to Selling Digital Products Online',
    slug: 'complete-guide-selling-digital-products-online',
    short_description:
      'Everything you need to know about creating, marketing, and selling digital products. Turn your expertise into a profitable online business.',
    description: sampleBlogContent,
    cover_image: '/images/prompt1.jpg',
    created_at: '2024-12-03T16:45:00Z',
    updated_at: '2024-12-03T16:45:00Z',
    user_meta: {
      first_name: 'Sarah',
      last_name: 'Wilson',
      profile_image: '/images/team/team-1.jpg',
    },
    tags: 'Business,Tutorial',
  },
  {
    id: '5',
    title: 'Mastering React: Advanced Patterns and Best Practices',
    slug: 'mastering-react-advanced-patterns-best-practices',
    short_description:
      'Take your React skills to the next level with advanced patterns, performance optimization techniques, and industry best practices.',
    description: sampleBlogContent,
    cover_image: '/images/prompt2.jpg',
    created_at: '2024-12-01T11:20:00Z',
    updated_at: '2024-12-01T11:20:00Z',
    user_meta: {
      first_name: 'David',
      last_name: 'Brown',
      profile_image: '/images/team/team-2.jpg',
    },
    tags: 'Development,Tutorial',
  },
  {
    id: '6',
    title: 'Building Your Personal Brand as a Developer',
    slug: 'building-personal-brand-developer',
    short_description:
      'Learn how to establish a strong personal brand that sets you apart in the competitive tech industry. Tips from successful developers.',
    description: sampleBlogContent,
    cover_image: '/images/prompt3.jpg',
    created_at: '2024-11-28T08:00:00Z',
    updated_at: '2024-11-28T08:00:00Z',
    user_meta: {
      first_name: 'Emily',
      last_name: 'Davis',
      profile_image: '/images/team/team-3.jpg',
    },
    tags: 'Freelancing,Tips & Tricks',
  },
  {
    id: '7',
    title: 'The Future of AI in Web Development',
    slug: 'future-of-ai-web-development',
    short_description:
      'Explore how artificial intelligence is transforming web development. From code generation to design automation, discover what\'s next.',
    description: sampleBlogContent,
    cover_image: '/images/sample1.jpg',
    created_at: '2024-11-25T13:30:00Z',
    updated_at: '2024-11-25T13:30:00Z',
    user_meta: {
      first_name: 'Chris',
      last_name: 'Miller',
      profile_image: '/images/team/team-1.jpg',
    },
    tags: 'Development,Business',
  },
  {
    id: '8',
    title: 'Creating Accessible Websites: A Comprehensive Guide',
    slug: 'creating-accessible-websites-comprehensive-guide',
    short_description:
      'Make your websites accessible to everyone. Learn the principles of web accessibility and how to implement them effectively.',
    description: sampleBlogContent,
    cover_image: '/images/sample2.jpg',
    created_at: '2024-11-22T10:45:00Z',
    updated_at: '2024-11-22T10:45:00Z',
    user_meta: {
      first_name: 'Lisa',
      last_name: 'Anderson',
      profile_image: '/images/team/team-2.jpg',
    },
    tags: 'Design,Development',
  },
  {
    id: '9',
    title: 'Pricing Strategies for Freelance Developers',
    slug: 'pricing-strategies-freelance-developers',
    short_description:
      'Stop undervaluing your work. Learn effective pricing strategies that help you earn what you deserve as a freelance developer.',
    description: sampleBlogContent,
    cover_image: '/images/sample3.jpg',
    created_at: '2024-11-20T15:00:00Z',
    updated_at: '2024-11-20T15:00:00Z',
    user_meta: {
      first_name: 'Tom',
      last_name: 'Taylor',
      profile_image: '/images/team/team-3.jpg',
    },
    tags: 'Freelancing,Business',
  },
  {
    id: '10',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    slug: 'css-grid-vs-flexbox-when-to-use-which',
    short_description:
      'Understand the differences between CSS Grid and Flexbox, and learn when to use each layout system for optimal results.',
    description: sampleBlogContent,
    cover_image: '/images/prompt1.jpg',
    created_at: '2024-11-18T09:30:00Z',
    updated_at: '2024-11-18T09:30:00Z',
    user_meta: {
      first_name: 'Anna',
      last_name: 'White',
      profile_image: '/images/team/team-1.jpg',
    },
    tags: 'Development,Tutorial',
  },
];

export const mockBlogPagination: BlogPagination = {
  total_count: mockBlogPosts.length,
  total_pages: 1,
  current_page: 1,
  per_page: 10,
};

// Helper function to format date
export function formatBlogDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper to filter blogs by tag
export function filterBlogsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  if (!tag) return posts;
  return posts.filter((post) => post.tags.split(',').includes(tag));
}

// Helper to search blogs
export function searchBlogs(posts: BlogPost[], query: string): BlogPost[] {
  if (!query) return posts;
  const lowerQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.short_description.toLowerCase().includes(lowerQuery)
  );
}

// Helper to get a single blog post by slug
export function getBlogBySlug(slug: string): BlogPost | undefined {
  return mockBlogPosts.find((post) => post.slug === slug);
}

// Helper to get related posts (excluding current post)
export function getRelatedPosts(currentId: string, limit: number = 4): BlogPost[] {
  return mockBlogPosts.filter((post) => post.id !== currentId).slice(0, limit);
}

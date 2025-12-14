// Mock data for seller registration wizard

export interface Category {
  id: number;
  title: string;
  web_icon: string;
}

export interface Skill {
  id: number;
  name: string;
  skill_name: string;
}

export const mockCategories: Category[] = [
  { id: 1, title: "Web Development", web_icon: "/images/become-seller/categories.png" },
  { id: 2, title: "Mobile Development", web_icon: "/images/become-seller/categories.png" },
  { id: 3, title: "UI/UX Design", web_icon: "/images/become-seller/categories.png" },
  { id: 4, title: "Graphic Design", web_icon: "/images/become-seller/categories.png" },
  { id: 5, title: "WordPress", web_icon: "/images/become-seller/categories.png" },
  { id: 6, title: "E-commerce", web_icon: "/images/become-seller/categories.png" },
  { id: 7, title: "Game Development", web_icon: "/images/become-seller/categories.png" },
  { id: 8, title: "Data Science", web_icon: "/images/become-seller/categories.png" },
  { id: 9, title: "DevOps", web_icon: "/images/become-seller/categories.png" },
  { id: 10, title: "Cloud Services", web_icon: "/images/become-seller/categories.png" },
  { id: 11, title: "API Development", web_icon: "/images/become-seller/categories.png" },
  { id: 12, title: "Database Design", web_icon: "/images/become-seller/categories.png" },
];

export const mockSkills: Skill[] = [
  { id: 1, name: "React", skill_name: "React" },
  { id: 2, name: "JavaScript", skill_name: "JavaScript" },
  { id: 3, name: "TypeScript", skill_name: "TypeScript" },
  { id: 4, name: "Node.js", skill_name: "Node.js" },
  { id: 5, name: "Python", skill_name: "Python" },
  { id: 6, name: "CSS", skill_name: "CSS" },
  { id: 7, name: "HTML", skill_name: "HTML" },
  { id: 8, name: "Vue.js", skill_name: "Vue.js" },
  { id: 9, name: "Angular", skill_name: "Angular" },
  { id: 10, name: "Next.js", skill_name: "Next.js" },
  { id: 11, name: "Express.js", skill_name: "Express.js" },
  { id: 12, name: "MongoDB", skill_name: "MongoDB" },
  { id: 13, name: "PostgreSQL", skill_name: "PostgreSQL" },
  { id: 14, name: "MySQL", skill_name: "MySQL" },
  { id: 15, name: "GraphQL", skill_name: "GraphQL" },
  { id: 16, name: "REST API", skill_name: "REST API" },
  { id: 17, name: "Docker", skill_name: "Docker" },
  { id: 18, name: "Kubernetes", skill_name: "Kubernetes" },
  { id: 19, name: "AWS", skill_name: "AWS" },
  { id: 20, name: "Google Cloud", skill_name: "Google Cloud" },
  { id: 21, name: "Azure", skill_name: "Azure" },
  { id: 22, name: "Git", skill_name: "Git" },
  { id: 23, name: "CI/CD", skill_name: "CI/CD" },
  { id: 24, name: "Testing", skill_name: "Testing" },
  { id: 25, name: "Tailwind CSS", skill_name: "Tailwind CSS" },
  { id: 26, name: "Bootstrap", skill_name: "Bootstrap" },
  { id: 27, name: "Material UI", skill_name: "Material UI" },
  { id: 28, name: "Ant Design", skill_name: "Ant Design" },
  { id: 29, name: "Figma", skill_name: "Figma" },
  { id: 30, name: "Adobe XD", skill_name: "Adobe XD" },
  { id: 31, name: "Photoshop", skill_name: "Photoshop" },
  { id: 32, name: "Illustrator", skill_name: "Illustrator" },
  { id: 33, name: "WordPress", skill_name: "WordPress" },
  { id: 34, name: "Shopify", skill_name: "Shopify" },
  { id: 35, name: "WooCommerce", skill_name: "WooCommerce" },
  { id: 36, name: "PHP", skill_name: "PHP" },
  { id: 37, name: "Laravel", skill_name: "Laravel" },
  { id: 38, name: "Django", skill_name: "Django" },
  { id: 39, name: "Flask", skill_name: "Flask" },
  { id: 40, name: "Ruby on Rails", skill_name: "Ruby on Rails" },
  { id: 41, name: "Java", skill_name: "Java" },
  { id: 42, name: "Spring Boot", skill_name: "Spring Boot" },
  { id: 43, name: "C++", skill_name: "C++" },
  { id: 44, name: "C#", skill_name: "C#" },
  { id: 45, name: ".NET", skill_name: ".NET" },
  { id: 46, name: "Swift", skill_name: "Swift" },
  { id: 47, name: "Kotlin", skill_name: "Kotlin" },
  { id: 48, name: "React Native", skill_name: "React Native" },
  { id: 49, name: "Flutter", skill_name: "Flutter" },
  { id: 50, name: "Firebase", skill_name: "Firebase" },
];

export const sellerPurposeOptions = [
  {
    key: "product",
    title: "I want to sell Products",
    description: "List templates, themes, plugins, and other downloadable items",
  },
  {
    key: "freelance",
    title: "Offer Freelance Services",
    description: "Provide services like design, development, and more",
  },
  {
    key: "jobs",
    title: "Bid on Jobs",
    description: "Apply for live jobs posted by clients win projects with your proposal.",
  },
  {
    key: "all",
    title: "Do All of the Above",
    description: "Maximize your reach by offering both products and services, and bidding on jobs.",
  },
];

export const registrationSteps = [
  {
    title: "Set Up Your Profile",
    description: "Complete your profile with tax info, billing details, and payout method to start selling securely and get paid without delays.",
    url: "/images/become-seller/profile.png",
  },
  {
    title: "Create Your Services or Products",
    description: "Showcase your freelance services or digital products to reach your ideal clients and start generating income from your skills.",
    url: "/images/become-seller/product.png",
  },
  {
    title: "Publish & Get Discovered",
    description: "Go live on the marketplace and get found by clients searching your category",
    url: "/images/become-seller/discovered.png",
  },
  {
    title: "Deliver & Earn",
    description: "Complete the order and get paid instantly after client confirmation.",
    url: "/images/become-seller/earn.png",
  },
];

export const sellerFaqItems = [
  {
    que: "What happens after I submit my product?",
    description: "Your product will go through a quick review to ensure it meets quality standards before going live",
  },
  {
    que: "What kind of products can I sell?",
    description: "You can sell digital products like UI kits, code snippets, templates, themes, illustrations, and more—anything downloadable and valuable to creators or developers",
  },
  {
    que: "Is there any approval process to sell?",
    description: "Once you submit your product, it's reviewed to ensure it meets manob.ai's quality standards and content guidelines before going live.",
  },
  {
    que: "How do clients find my services?",
    description: "Clients can discover your services through search results, category pages, or featured listings on the marketplace. Optimizing your title, tags, and description helps improve visibility.",
  },
  {
    que: "Are there any fees?",
    description: "Yes, manob.ai charges a small commission on each sale. You can view the exact fee structure in your seller dashboard or the platform's pricing policy.",
  },
];

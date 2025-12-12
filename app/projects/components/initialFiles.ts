// initialFiles.ts

export type FileContent = {
  path: string;
  name: string;
  content: string;
};

const initialFiles: FileContent[] = [
  {
    path: "/app/page.tsx",
    name: "page.tsx",
    content: `import { useState, useMemo } from 'react';
import { mockBlogPosts } from '@/data/mockBlogPosts';
import { BlogPost } from '@/types/blog';
import { BlogHeader } from '@/components/BlogHeader';
import { BlogPostCard } from '@/components/BlogPostCard';
import { BlogPostDetail } from '@/components/BlogPostDetail';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const filteredPosts = useMemo(() => {
    return mockBlogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory && post.status === 'published';
    });
  }, [searchQuery, selectedCategory]);

  if (selectedPost) {
    return <BlogPostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <BlogHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <main className="container mx-auto px-4 py-8">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
`,
  },

  {
    path: "/components/Header.tsx",
    name: "Header.tsx",
    content: `import React from "react";

export function Header() {
  return (
    <header className="h-14 border-b flex items-center px-4 bg-white">
      <h1 className="text-lg font-semibold">Demo Header</h1>
    </header>
  );
}
`,
  },

  {
    path: "/components/Footer.tsx",
    name: "Footer.tsx",
    content: `import React from "react";

export function Footer() {
  return (
    <footer className="h-12 border-t flex items-center justify-center text-sm text-gray-500">
      © 2025 Demo App
    </footer>
  );
}
`,
  },

  {
    path: "/hooks/use-mobile.ts",
    name: "use-mobile.ts",
    content: `"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 1280;

export function useMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth < MOBILE_BREAKPOINT : false
  );

  React.useEffect(() => {
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener("resize", onChange);
    onChange();
    return () => window.removeEventListener("resize", onChange);
  }, []);

  return isMobile;
}
`,
  },

  {
    path: "/hooks/use-toast.ts",
    name: "use-toast.ts",
    content: `export const useToast = () => ({
  show: (msg: string) => alert(msg),
});
`,
  },

  {
    path: "/utils/format.ts",
    name: "format.ts",
    content: `export function formatCurrency(amount: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}
`,
  },

  {
    path: "/context/UserContext.tsx",
    name: "UserContext.tsx",
    content: `"use client";
import React, { createContext, useContext, useState } from "react";

type User = { name: string; role: string };

const UserContext = createContext<User | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>({ name: "Naeem", role: "Admin" });
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const useUser = () => useContext(UserContext);
`,
  },

  {
    path: "/styles/global.css",
    name: "global.css",
    content: `body {
  margin: 0;
  font-family: system-ui, sans-serif;
  background: #f7f7f7;
}
`,
  },

  {
    path: "/data/menu.json",
    name: "menu.json",
    content: `{
  "items": [
    { "label": "Home", "path": "/" },
    { "label": "Services", "path": "/services" },
    { "label": "About", "path": "/about" },
    { "label": "Contact", "path": "/contact" }
  ]
}
`,
  },

  {
    path: "/api/user.ts",
    name: "user.ts",
    content: `export function getUser() {
  return {
    id: 1,
    name: "John Doe",
    email: "john@example.com"
  };
}

export function getPermissions() {
  return ["read", "write", "update"];
}
`,
  },

  {
    path: "/package.json",
    name: "package.json",
    content: `{
  "name": "big-demo-project",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "18.2.0",
    "next": "14.0.0",
    "typescript": "5.3.2"
  }
}
`,
  },

  {
    path: "/README.md",
    name: "README.md",
    content: `# Demo Project

This is a sample project used inside your custom code editor preview panel.

## Features
- Code editor with tabs
- File explorer
- Live preview
- Resizable sidebar

Enjoy building!
`,
  },
];

export default initialFiles;

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogPost, fetchRelatedPosts } from '@/lib/api/blog';
import ShareArticle from './ShareArticle';
import Newsletter from './Newsletter';
import RelatedPosts from './RelatedPosts';

type TOCItem = { id: string; text: string; level: string };

const generatePostDataWithIds = (html: string): string => {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('h2, h3').forEach((heading, index) => {
    const id =
      heading.textContent?.replace(/\s+/g, '-').toLowerCase() ||
      `heading-${index}`;
    heading.id = id;
  });

  return doc.body.innerHTML;
};

const processHTMLContent = (html: string): string => {
  if (typeof window === 'undefined') return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove <p><br></p>
  doc.querySelectorAll('p').forEach((p) => {
    if (p.innerHTML.trim() === '<br>') {
      p.remove();
    }
  });

  // Wrap <iframe> in .ratio .ratio-16x9
  doc.querySelectorAll('iframe').forEach((iframe) => {
    const wrapper = doc.createElement('div');
    wrapper.className = 'aspect-video';
    iframe.parentNode?.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
  });

  return doc.body.innerHTML.trim();
};

interface BlogDetailsProps {
  singlePostData: BlogPost | null;
}

export default function BlogDetails({ singlePostData }: BlogDetailsProps) {
  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [postData, setPostData] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const router = useRouter();

  // Load related posts
  useEffect(() => {
    async function loadRelatedPosts() {
      if (!singlePostData) return;

      setLoadingRelated(true);
      try {
        const apiRelated = await fetchRelatedPosts(
          singlePostData.id,
          singlePostData.tags,
          4
        );
        setRelatedPosts(apiRelated);
      } catch (error) {
        console.error('Failed to load related posts:', error);
        setRelatedPosts([]);
      } finally {
        setLoadingRelated(false);
      }
    }

    loadRelatedPosts();
  }, [singlePostData]);

  useEffect(() => {
    if (!singlePostData) {
      router.push('/404');
      return;
    }

    if (!singlePostData.description) return;

    const postDataWithIds = generatePostDataWithIds(singlePostData.description);
    const cleanedHtml = processHTMLContent(postDataWithIds);
    setPostData(cleanedHtml);

    const parser = new DOMParser();
    const doc = parser.parseFromString(postDataWithIds, 'text/html');
    const headings = doc.querySelectorAll('h2, h3');

    const toc = Array.from(headings).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: heading.tagName.toLowerCase(),
    }));

    setTableOfContents(toc);
  }, [singlePostData, router]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      let currentId: string | null = null;

      for (const item of tableOfContents) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = item.id;
        }
      }

      setActiveId(currentId);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tableOfContents]);

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!singlePostData) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-gray-600">Loading article...</span>
      </div>
    );
  }

  return (
    <>
      <section className="pt-6">
        <div className="container mx-auto px-4">
          <div className="mb-4">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              <ArrowLeft size={18} /> Back To Articles
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 xl:col-span-9 articles-content">
              <div className="mb-6">
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-semibold mb-4">
                    {singlePostData.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      <Image
                        src={singlePostData.user_meta.profile_image || '/images/avatar-placeholder.png'}
                        height={32}
                        width={32}
                        className="rounded-full object-cover"
                        alt={`${singlePostData.user_meta.first_name} ${singlePostData.user_meta.last_name}`}
                      />
                    </div>
                    <div className="flex-1">
                      <div>
                        <span className="text-gray-500 italic">By</span>{' '}
                        <span className="font-medium">
                          {singlePostData.user_meta.first_name}{' '}
                          {singlePostData.user_meta.last_name}
                        </span>{' '}
                        <span className="text-gray-500 italic">on</span>{' '}
                        <span className="font-medium">
                          {new Date(singlePostData.created_at).toDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Cover Image */}
                <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={singlePostData.cover_image || '/images/placeholder-blog.jpg'}
                    alt={singlePostData.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              {/* Article Content */}
              <div
                className="article-description text-base leading-relaxed prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: postData || '' }}
              />
              {/* Tags */}
              {singlePostData.tags && (
                <div className="flex flex-wrap items-center gap-2 mt-8 mb-4">
                  <div className="font-medium">Tags:</div>
                  {singlePostData.tags.split(',').map((tag) => {
                    const cleanTag = tag.trim().replace(/^#/, '');
                    return (
                      <Link
                        href={`/blog?tag=${cleanTag}`}
                        key={tag}
                        className="bg-gray-100 text-sm px-3 py-2 font-medium rounded-full shadow-sm hover:bg-gray-200 transition-colors"
                      >
                        {cleanTag}
                      </Link>
                    );
                  })}
                </div>
              )}
              {/* Mobile Share & Newsletter */}
              <ShareArticle className="lg:hidden" />
              <Newsletter className="lg:hidden" />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 xl:col-span-3 hidden lg:block articles-sidebar">
              <div className="sticky top-20">
                {tableOfContents.length > 0 && (
                  <div className="mb-8">
                    <h6 className="mb-3 text-lg font-semibold">On this page</h6>
                    <nav className="table-of-contents">
                      <ul className="list-none p-0 m-0">
                        {tableOfContents.map((item) => (
                          <li
                            key={item.id}
                            className={item.level === 'h3' ? 'toc-subheading' : ''}
                          >
                            <button
                              onClick={() => scrollToElement(item.id)}
                              className={`toc-link ${activeId === item.id ? 'active' : ''}`}
                            >
                              {item.text}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
                <ShareArticle />
                <Newsletter />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {!loadingRelated && relatedPosts.length > 0 && (
        <RelatedPosts
          title="Related Posts"
          subTitle="Discover more content you'll love—check out these related posts tailored just for your interests."
          posts={relatedPosts}
        />
      )}
    </>
  );
}

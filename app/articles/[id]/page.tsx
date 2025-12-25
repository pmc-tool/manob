"use client";
import { Card, Button, Avatar, Skeleton, Form, Input, message, Tooltip } from "antd";
import { ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Share2, Link as LinkIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetSingleBlogQuery, useLikeMutation } from "@/state/services/blog/blog.service";
import { useSubmitEmailForNewsletterMutation } from "@/state/services/home-service/home.service";

// Mock data for development
const mockArticle = {
  id: "art-001",
  slug: "how-to-create-account",
  title: "How to create an account on PackMyCode",
  short_description: "A complete guide to creating and setting up your PackMyCode account.",
  description: `
    <h2>Getting Started with PackMyCode</h2>
    <p>Creating an account on PackMyCode is quick and easy. Follow these simple steps to get started with our marketplace.</p>

    <h2>Step 1: Visit the Sign Up Page</h2>
    <p>Navigate to the PackMyCode website and click on the "Sign Up" button located in the top right corner of the page. You'll be taken to our registration form.</p>

    <h3>Required Information</h3>
    <p>You'll need to provide the following information:</p>
    <ul>
      <li>Your email address</li>
      <li>A strong password</li>
      <li>Your full name</li>
    </ul>

    <h2>Step 2: Verify Your Email</h2>
    <p>After submitting the registration form, you'll receive a verification email. Click the link in the email to verify your account.</p>

    <h3>Didn't Receive the Email?</h3>
    <p>If you don't receive the verification email within a few minutes, check your spam folder. You can also request a new verification email from the login page.</p>

    <h2>Step 3: Complete Your Profile</h2>
    <p>Once verified, log in and complete your profile. Add a profile picture and fill in your bio to help other users get to know you.</p>

    <h2>You're All Set!</h2>
    <p>Congratulations! You can now browse the marketplace, purchase products, and even become a seller. Explore our categories and find the perfect digital assets for your projects.</p>
  `,
  cover_image: null,
  total_likes: 45,
  total_dislikes: 3,
  is_liked: false,
  blog_type: "SUPPORT",
  user_meta: {
    first_name: "Support",
    last_name: "Team",
    profile_image: null,
  },
  created_at: "2024-12-10T10:30:00Z",
  category_title: "Getting Started",
  category_id: "cat-001",
};

const mockRelatedArticles = [
  { id: "art-002", slug: "navigating-marketplace", title: "Navigating the marketplace" },
  { id: "art-003", slug: "making-first-purchase", title: "Making your first purchase" },
  { id: "art-004", slug: "understanding-licenses", title: "Understanding product licenses" },
];

const mockRecentArticles = [
  { id: "art-005", slug: "payment-methods", title: "Payment methods guide" },
  { id: "art-006", slug: "account-security", title: "Account security tips" },
];

type TOCItem = { id: string; text: string; level: string };

const generatePostDataWithIds = (html: string): string => {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("h2, h3").forEach((heading, index) => {
    const id = heading.textContent?.replace(/\s+/g, "-").toLowerCase() || `heading-${index}`;
    heading.id = id;
  });

  return doc.body.innerHTML;
};

const processHTMLContent = (html: string): string => {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  doc.querySelectorAll("p").forEach((p) => {
    if (p.innerHTML.trim() === "<br>") {
      p.remove();
    }
  });

  doc.querySelectorAll("iframe").forEach((iframe) => {
    const wrapper = doc.createElement("div");
    wrapper.className = "aspect-video";
    iframe.parentNode?.insertBefore(wrapper, iframe);
    wrapper.appendChild(iframe);
  });

  return doc.body.innerHTML.trim();
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [tableOfContents, setTableOfContents] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [postData, setPostData] = useState<string | null>(null);
  const [yesCount, setYesCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [voted, setVoted] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const { data: singleData, isLoading } = useGetSingleBlogQuery(id);
  const [blogLike] = useLikeMutation();
  const [submitNewsletterEmail, { isLoading: newsletterLoading }] = useSubmitEmailForNewsletterMutation();

  // Use mock data if API returns no data
  const article = singleData || mockArticle;
  const relatedArticles = mockRelatedArticles;
  const recentArticles = mockRecentArticles;

  useEffect(() => {
    if (!article && !isLoading) {
      router.push("/404");
      return;
    }

    if (article?.description) {
      const postDataWithIds = generatePostDataWithIds(article.description);
      const cleanedHtml = processHTMLContent(postDataWithIds);
      setPostData(cleanedHtml);

      if (typeof window !== "undefined") {
        const parser = new DOMParser();
        const doc = parser.parseFromString(postDataWithIds, "text/html");
        const headings = doc.querySelectorAll("h2, h3");

        const toc = Array.from(headings).map((heading) => ({
          id: heading.id,
          text: heading.textContent || "",
          level: heading.tagName.toLowerCase(),
        }));

        setTableOfContents(toc);
      }
    }

    setYesCount(article?.total_likes || 0);
    setTotalCount((article?.total_likes || 0) + (article?.total_dislikes || 0));
    setVoted(article?.is_liked || false);
  }, [article, isLoading, router]);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tableOfContents]);

  const handleVote = async (isHelpful: boolean) => {
    const isLoginUser = typeof window !== "undefined" ? window.localStorage.getItem("p_aut") : null;

    if (!isLoginUser) {
      message.warning("Please login to vote");
      return;
    }

    if (!voted) {
      setTotalCount((prev) => prev + 1);
      if (isHelpful) {
        setYesCount((prev) => prev + 1);
      }

      try {
        await blogLike({
          id: article?.id,
          body: { interaction_type: isHelpful ? "LIKE" : "DISLIKE", type: article?.blog_type },
        });
        setVoted(true);
      } catch (error) {
        message.error("Failed to submit vote");
      }
    }
  };

  const handleNewsletterSubmit = async () => {
    if (!newsletterEmail) {
      message.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      message.error("Please enter a valid email address");
      return;
    }

    try {
      await submitNewsletterEmail({ email: newsletterEmail });
      message.success("Thank you! You've successfully subscribed.");
      setNewsletterEmail("");
    } catch (error) {
      message.error("Failed to subscribe. Please try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success("Link copied to clipboard!");
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="pt-4 pb-8">
        <div className="container mx-auto px-4">
          <Skeleton active paragraph={{ rows: 2 }} className="mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Skeleton.Image active className="w-full h-64 mb-6" />
              <Skeleton active paragraph={{ rows: 15 }} />
            </div>
            <div>
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-4 pb-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/help"
            className="inline-flex items-center gap-2 font-semibold text-primary hover:underline"
          >
            <ChevronLeft size={18} /> Back To Topic
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{article?.title}</h1>
              <div className="flex items-center gap-3">
                <Avatar
                  src={
                    article?.user_meta?.profile_image
                      ? `${process.env.NEXT_PUBLIC_S3BUCKET}/${article.user_meta.profile_image}`
                      : undefined
                  }
                  size={36}
                  className="bg-primary"
                >
                  {article?.user_meta?.first_name?.charAt(0)}
                </Avatar>
                <div className="text-sm text-gray-500">
                  <span className="italic">By</span>{" "}
                  <span className="font-medium text-gray-900">
                    {article?.user_meta?.first_name} {article?.user_meta?.last_name}
                  </span>{" "}
                  <span className="italic">on</span>{" "}
                  <span className="font-medium text-gray-900">
                    {new Date(article?.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {article?.cover_image && (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-8">
                <Image
                  src={`${process.env.NEXT_PUBLIC_S3BUCKET}/${article.cover_image}`}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="prose prose-lg max-w-none mb-8
                prose-headings:text-gray-900 prose-headings:font-semibold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-ul:text-gray-600 prose-li:my-1
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: postData || "" }}
            />

            {/* Feedback Section */}
            <Card className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this article helpful?</h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <Button
                  size="large"
                  icon={<ThumbsUp size={18} />}
                  onClick={() => handleVote(true)}
                  disabled={voted}
                  className={voted ? "opacity-50" : ""}
                >
                  Yes
                </Button>
                <Button
                  size="large"
                  type="primary"
                  icon={<ThumbsDown size={18} />}
                  onClick={() => handleVote(false)}
                  disabled={voted}
                  className={voted ? "opacity-50" : ""}
                >
                  No
                </Button>
              </div>
              <p className="text-gray-500">
                {yesCount} out of {totalCount} found this helpful
              </p>
            </Card>

            {/* Share Section (Mobile) */}
            <Card className="lg:hidden mb-8">
              <h4 className="font-semibold text-gray-900 mb-4">Share with others</h4>
              <div className="flex gap-4">
                <Tooltip title="Copy link">
                  <Button icon={<LinkIcon size={18} />} onClick={copyToClipboard} />
                </Tooltip>
                <Tooltip title="Share on LinkedIn">
                  <Button
                    icon={<Share2 size={18} />}
                    onClick={() =>
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                        "_blank"
                      )
                    }
                  />
                </Tooltip>
                <Tooltip title="Share on Twitter">
                  <Button
                    icon={<Share2 size={18} />}
                    onClick={() =>
                      window.open(
                        `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article?.title)}`,
                        "_blank"
                      )
                    }
                  />
                </Tooltip>
              </div>
            </Card>

            {/* Related Articles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Recently viewed articles</h4>
                <div className="space-y-2">
                  {recentArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/articles/${item.slug}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary"
                    >
                      <ChevronRight size={14} />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Related articles</h4>
                <div className="space-y-2">
                  {relatedArticles.map((item) => (
                    <Link
                      key={item.id}
                      href={`/articles/${item.slug}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary"
                    >
                      <ChevronRight size={14} />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-4 space-y-6">
              {/* Table of Contents */}
              {tableOfContents.length > 0 && (
                <Card>
                  <h4 className="font-semibold text-gray-900 mb-4">On this page</h4>
                  <nav>
                    <ul className="space-y-2">
                      {tableOfContents.map((item) => (
                        <li
                          key={item.id}
                          className={item.level === "h3" ? "pl-4" : ""}
                        >
                          <button
                            onClick={() => scrollToSection(item.id)}
                            className={`text-left text-sm transition-colors hover:text-primary ${
                              activeId === item.id
                                ? "text-primary font-medium"
                                : "text-gray-500"
                            }`}
                          >
                            {item.text}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </Card>
              )}

              {/* Share Section */}
              <Card>
                <h4 className="font-semibold text-gray-900 mb-4">Share with others</h4>
                <div className="flex gap-3 border-l-2 border-gray-200 pl-4">
                  <Tooltip title="Copy link">
                    <Button
                      type="text"
                      icon={<LinkIcon size={20} />}
                      onClick={copyToClipboard}
                      className="text-gray-500 hover:text-primary"
                    />
                  </Tooltip>
                  <Tooltip title="Share on LinkedIn">
                    <Button
                      type="text"
                      icon={<Share2 size={20} />}
                      onClick={() =>
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
                          "_blank"
                        )
                      }
                      className="text-gray-500 hover:text-primary"
                    />
                  </Tooltip>
                </div>
              </Card>

              {/* Newsletter */}
              <Card className="bg-primary/5">
                <Image
                  src="/images/support.svg"
                  alt="Newsletter"
                  width={60}
                  height={60}
                  className="mb-4"
                  unoptimized
                />
                <h4 className="font-semibold text-gray-900 mb-2">Sign up for our newsletter!</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Stay updated with the latest news, exclusive offers, and special updates—straight to your inbox!
                </p>
                <div className="space-y-2">
                  <Input
                    placeholder="Your Email"
                    prefix={<Mail size={16} className="text-gray-400" />}
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <Button
                    type="primary"
                    className="w-full"
                    loading={newsletterLoading}
                    onClick={handleNewsletterSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-primary rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                Can't find the answer you're looking for?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Need help? <span className="font-semibold underline">Open a ticket</span> to get expert assistance and quick solutions to your questions with reliable support.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/support-contact">
                  <Button size="large" className="bg-white text-primary font-semibold hover:bg-gray-100">
                    Open a ticket
                  </Button>
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-4">
                * Available exclusively for Pro users with an active license.
              </p>
            </div>
            <div className="hidden md:block">
              <Image
                src="/images/open-ticket.webp"
                alt="Open Ticket"
                width={400}
                height={300}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

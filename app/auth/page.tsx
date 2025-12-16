"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import styles from "./auth.module.css";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoginUser =
    typeof window !== "undefined" ? window.localStorage.getItem("p_aut") : null;
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.id);
  };

  const getButtonText = () => {
    if (selectedOption === "client") {
      return "Join as a Client";
    } else if (selectedOption === "seller") {
      return "Apply as a Seller";
    }
    return "Create Account";
  };

  const getLinkHref = () => {
    if (selectedOption === "client" || selectedOption === "seller") {
      // Store the user type in localStorage for the sign-up page
      if (typeof window !== "undefined") {
        localStorage.setItem("registerer_type", selectedOption);
      }
      return "/auth/sign-up";
    }
    return "#";
  };

  useEffect(() => {
    if (isLoginUser) {
      router.push("/");
    }
  }, [isLoginUser, router]);

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      Cookies.set("re_c", refCode, { expires: 7 });
    }
  }, [searchParams]);

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div className={`flex-grow m-auto ${styles.authInner}`}>
          <div className="auth-header mb-5">
            <h4 className="font-bold text-center mb-0">
              Join as a client or seller
            </h4>
          </div>
          <div className="auth-body">
            <div className="auth-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 justify-items-center max-w-2xl mx-auto">
                <div className="w-full max-w-xs">
                  <div
                    className={`bg-white border relative pl-0 rounded transition-all ${
                      selectedOption === "client" ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="client"
                      name="user-type-radio"
                      className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                      onChange={handleOptionChange}
                    />
                    <label
                      className="block p-3 cursor-pointer"
                      htmlFor="client"
                    >
                      <svg
                        className="mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        role="img"
                        width="24"
                        height="24"
                      >
                        <path
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M19.28 21h-6.9a1.6 1.6 0 01-1.73-1.5v-4a1.6 1.6 0 011.73-1.5h6.9A1.59 1.59 0 0121 15.5v4a1.66 1.66 0 01-1.72 1.5z"
                        />
                        <path
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M16.9 12h-2.15a.65.65 0 00-.72.66V14h3.59v-1.34a.65.65 0 00-.72-.66z"
                        />
                        <line
                          x1="10.65"
                          x2={21}
                          y1="17.29"
                          y2="17.29"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="10.04"
                          cy="5.73"
                          r="2.73"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <path
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 18.45v-.9a7 7 0 017-7h.09a6.73 6.73 0 011.91.27"
                        />
                      </svg>
                      <span className="block font-medium text-[21px] leading-tight text-gray-900">
                        I&apos;m a client, hiring for a project
                      </span>
                    </label>
                  </div>
                </div>
                <div className="w-full max-w-xs">
                  <div
                    className={`bg-white border relative pl-0 rounded transition-all ${
                      selectedOption === "seller" ? "border-primary ring-2 ring-primary/20" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="seller"
                      name="user-type-radio"
                      className="absolute opacity-0 w-full h-full cursor-pointer z-10"
                      onChange={handleOptionChange}
                    />
                    <label
                      className="block p-3 cursor-pointer"
                      htmlFor="seller"
                    >
                      <svg
                        className="mx-2"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        role="img"
                        width="24"
                        height="24"
                      >
                        <polygon
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          points="19.38 21 8.38 21 10 14 21 14 19.38 21"
                        />
                        <circle
                          cx="14.69"
                          cy="17.5"
                          r=".5"
                          fill="var(--icon-color, #001e00)"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <line
                          x1="9.43"
                          x2="5.99"
                          y1={21}
                          y2={21}
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <circle
                          cx="10.04"
                          cy="5.73"
                          r="2.73"
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                        <path
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          stroke="var(--icon-color, #001e00)"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 18.45v-.9a7 7 0 017-7h.09a6.94 6.94 0 013.79 1.12"
                        />
                      </svg>
                      <span className="block font-medium text-[21px] leading-tight text-gray-900">
                        I&apos;m a seller, I will sell my products
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Link href={getLinkHref()}>
              <button
                type="button"
                className={`inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-primary text-white shadow-md hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles.JoinTheMarketplace}`}
                disabled={!selectedOption}
              >
                {getButtonText()}
              </button>
            </Link>
          </div>
          <div className="mt-3 text-center auth-text text-[15px]">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium underline text-primary"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}

"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { ShoppingBag, Store, ArrowRight } from "lucide-react";

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isLoginUser =
    typeof window !== "undefined" ? window.localStorage.getItem("p_aut") : null;
  const [selectedOption, setSelectedOption] = useState<"client" | "seller" | null>(null);

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

  const handleContinue = () => {
    if (selectedOption) {
      if (typeof window !== "undefined") {
        localStorage.setItem("registerer_type", selectedOption);
      }
      router.push("/auth/sign-up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/images/logo-manob-full.svg"
              alt="manob.ai"
              width={140}
              height={40}
              className="mx-auto"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Join manob.ai
            </h1>
            <p className="text-gray-500 text-sm">
              Choose how you want to use our platform
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {/* Client Option */}
            <button
              type="button"
              onClick={() => setSelectedOption("client")}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                selectedOption === "client"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedOption === "client" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <ShoppingBag size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    I&apos;m a buyer
                  </h3>
                  <p className="text-sm text-gray-500">
                    I want to browse and purchase digital products, templates, and services
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedOption === "client" ? "border-black bg-black" : "border-gray-300"
                }`}>
                  {selectedOption === "client" && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>

            {/* Seller Option */}
            <button
              type="button"
              onClick={() => setSelectedOption("seller")}
              className={`w-full p-5 rounded-xl border-2 text-left transition-all ${
                selectedOption === "seller"
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selectedOption === "seller" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  <Store size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    I&apos;m a seller
                  </h3>
                  <p className="text-sm text-gray-500">
                    I want to sell my digital products, templates, or offer services
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  selectedOption === "seller" ? "border-black bg-black" : "border-gray-300"
                }`}>
                  {selectedOption === "seller" && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          </div>

          {/* Continue Button */}
          <button
            type="button"
            onClick={handleContinue}
            disabled={!selectedOption}
            className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {selectedOption === "client" && "Continue as buyer"}
            {selectedOption === "seller" && "Continue as seller"}
            {!selectedOption && "Select an option to continue"}
            {selectedOption && <ArrowRight size={18} />}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-black font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Legal */}
        <p className="mt-8 text-center text-xs text-gray-400">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-gray-600">
            Terms
          </Link>
          {" and "}
          <Link href="/privacy-policy" className="underline hover:text-gray-600">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}

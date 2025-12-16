"use client";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

interface IFormInput {
  email: string;
}

export default function RecoveryPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (inputData: IFormInput) => {
    try {
      setIsLoading(true);
      setError(null);

      // Store email for OTP verification
      if (typeof window !== "undefined") {
        localStorage.setItem("r_email", inputData.email);
        localStorage.setItem("r_ty", "forgotPass");
      }

      // Mock API call - in real app, call forgot password API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Reset link sent to your email");
      reset();
      router.push("/auth/otp-verify/forgot-pass");
    } catch (e: any) {
      setError(e?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Forgot password?
            </h1>
            <p className="text-gray-500 text-sm">
              No worries, we&apos;ll send you reset instructions.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(submit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              <ErrorMessage
                errors={errors}
                name="email"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mt-1">{message}</p>
                )}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>
        </div>

        {/* Legal */}
        <p className="mt-8 text-center text-xs text-gray-400">
          Protected by reCAPTCHA.{" "}
          <Link href="/privacy-policy" className="underline hover:text-gray-600">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-gray-600">
            Terms
          </Link>
        </p>
      </div>
    </div>
  );
}

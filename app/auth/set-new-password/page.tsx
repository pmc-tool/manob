"use client";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  new_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("new_password"), ""], "Passwords must match")
    .required("Please confirm your password"),
});

interface IFormInputs {
  new_password: string;
  confirm_password: string;
}

export default function SetNewPasswordPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const password = watch("new_password") || "";

  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("p_aut") : null;

  useEffect(() => {
    if (isLoginUser) {
      router.push("/");
    }
  }, [isLoginUser, router]);

  const onSubmit = async (inputData: IFormInputs) => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock API call - in real app, call reset password API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clean up
      if (typeof window !== "undefined") {
        localStorage.removeItem("r_tok");
        localStorage.removeItem("r_email");
        localStorage.removeItem("r_ty");
      }

      toast.success("Password reset successfully!");
      router.push("/auth/sign-in");
    } catch (e: any) {
      setError(e?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // Password requirement checks
  const requirements = [
    { label: "Lowercase", met: /[a-z]/.test(password) },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Special", met: /[@$!%*?&]/.test(password) },
    { label: "8+ chars", met: password.length >= 8 },
  ];

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Set new password
            </h1>
            <p className="text-gray-500 text-sm">
              Create a strong password to secure your account
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-12"
                  placeholder="Enter new password"
                  {...register("new_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {/* Password Requirements */}
              {password && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {requirements.map((req) => (
                    <span
                      key={req.label}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        req.met
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {req.met ? <Check size={12} /> : <X size={12} />}
                      {req.label}
                    </span>
                  ))}
                </div>
              )}
              <ErrorMessage
                errors={errors}
                name="new_password"
                render={({ message }) => (
                  <p className="text-red-500 text-sm mt-1">{message}</p>
                )}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all pr-12"
                  placeholder="Confirm new password"
                  {...register("confirm_password")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <ErrorMessage
                errors={errors}
                name="confirm_password"
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
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
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

"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function OTPVerifyPage() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>(new Array(4).fill(null));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);

  const registererEmail = typeof window !== "undefined"
    ? localStorage.getItem("r_email")
    : null;

  const registererType = typeof window !== "undefined"
    ? localStorage.getItem("registerer_type")
    : null;

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  async function verifyOtp() {
    try {
      setIsLoading(true);
      setError(null);

      const otpCode = otp.join("");

      if (otpCode.length !== 4) {
        setError("Please enter a valid 4-digit code");
        return;
      }

      // Mock OTP verification - in real app, call API here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful verification
      if (typeof window !== "undefined") {
        localStorage.setItem("p_aut", "mock-token-12345");
        localStorage.setItem(
          "r_ty",
          registererType?.trim() === "seller" ? "SELLER" : "BUYER"
        );
      }

      // Clean up registration state
      if (typeof window !== "undefined") {
        localStorage.removeItem("r_email");
        localStorage.removeItem("r_ty");
        localStorage.removeItem("registerer_type");
      }

      toast.success("Successfully verified!");

      if (registererType?.trim() === "seller") {
        router.push("/become-seller/seller-registration");
      } else {
        router.push("/");
      }
    } catch (e: any) {
      toast.error(e?.message || "Verification failed");
      setError(e?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all digits entered
      if (value && index === 3 && newOtp.every(digit => digit !== "")) {
        setTimeout(() => verifyOtp(), 100);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
      setTimeout(() => verifyOtp(), 100);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    // Mock resend - in real app, call API here
    toast.success("Code resent to your email");
    setResendTimer(60);
  };

  // Mask email for display
  const maskedEmail = registererEmail
    ? registererEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "your email";

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Check your email
            </h1>
            <p className="text-gray-500 text-sm">
              We sent a verification code to<br />
              <span className="font-medium text-gray-900">{maskedEmail}</span>
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* OTP Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              Enter verification code
            </label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-14 h-14 text-center text-2xl font-semibold border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="button"
            onClick={verifyOtp}
            disabled={isLoading || otp.some(digit => !digit)}
            className="w-full bg-black text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify email"
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Didn&apos;t receive the code?{" "}
              {resendTimer > 0 ? (
                <span className="text-gray-400">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-black font-medium hover:underline"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
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

"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import toast from "react-hot-toast";
import styles from "../auth.module.css";

export default function Page() {
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    new Array(4).fill(null)
  );
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>();

  const registererEmail = typeof window !== "undefined"
    ? localStorage.getItem("r_email")
    : null;

  const registererType = typeof window !== "undefined"
    ? localStorage.getItem("registerer_type")
    : null;

  async function verifyOtp(data: any) {
    try {
      setIsLoading(true);
      setError(null);

      const otpCode = data.o1 + data.o2 + data.o3 + data.o4;

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

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    if (/^\d$/.test(value)) {
      setValue(`o${index + 1}`, value, { shouldValidate: true });
      if (index < inputRefs.current.length - 1) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
      }
    } else {
      event.target.value = "";
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      setValue(`o${index + 1}`, "", { shouldValidate: true });

      if (index > 0) {
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 50);
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pastedData = event.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      pastedData.split("").forEach((char, i) => {
        setValue(`o${i + 1}`, char, { shouldValidate: true });
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = char;
        }
      });

      inputRefs.current[3]?.focus();
    }
  };

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div
          className={`flex-grow m-auto ${styles.authInner} ${styles.authRecoveryForm}`}
        >
          <div className="auth-header mb-5">
            <h4 className="font-bold text-center mb-0">
              Two factor authentication
            </h4>
            <p className="text-sm leading-normal text-center mb-0 mt-4">
              We have sent a code to{" "}
              <span className="font-medium text-gray-900">{registererEmail}</span>
            </p>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit(verifyOtp)}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className={styles.authLabel}>
                  Enter the code we have sent you:
                </label>
                <div className="flex justify-between gap-1 sm:gap-3 mb-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="relative">
                      <input
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center ${styles.authInput}`}
                        {...register(`o${index + 1}`, {
                          required: "Required",
                        })}
                        onChange={(e) => handleInputChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        ref={(el: any) => (inputRefs.current[index] = el)}
                      />
                      <span className={styles.focusBorder}></span>
                      <ErrorMessage
                        errors={errors}
                        name={`o${index + 1}`}
                        render={({ message }) => (
                          <span className="text-red-500 text-sm">{message}</span>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="rounded inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 transition-all w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify and Process"}
              </button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <div className="inline font-semibold text-xs text-body-secondary uppercase">
              Remember your password?{" "}
              <Link href="/auth/sign-in" className={styles.authLink}>
                Log in
              </Link>
            </div>
          </div>
          <div className="mt-3 text-center auth-text text-[13px]">
            Secure Login with reCAPTCHA subject to Google{" "}
            <a target="_blank" href="/terms">
              <span className="underline">Terms</span>
            </a>
            &amp;
            <a target="_blank" href="/privacy-policy">
              <span className="underline">Privacy</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../auth.module.css";

interface IFormInput {
  email: string;
}

export default function Page() {
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

      reset();
      router.push("/auth/otp-verify/forgot-pass");
    } catch (e: any) {
      setError(e?.message || "Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div
          className={`flex-grow m-auto ${styles.authInner} ${styles.authRecoveryForm}`}
        >
          <div className="auth-header mb-5">
            <h4 className="font-bold text-center mb-0">Forgot Password</h4>
            <p className="text-[13px] leading-normal text-center mb-0 mt-4">
              Enter your account&apos;s email and we&apos;ll send you an email to reset
              the password.
            </p>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit(submit)}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className={styles.authLabel}>Email address</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${styles.authInput}`}
                    placeholder="name@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  <span className={styles.focusBorder}></span>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <div className="text-red-500 text-sm">{message}</div>
                  )}
                />
              </div>
              <button
                type="submit"
                className="rounded inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 transition-all w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send email"}
              </button>
            </form>
          </div>
          <div className="mt-3 text-center auth-text text-[13px]">
            Secure Login with reCAPTCHA subject to Google <br />
            <a target="_blank" href="/privacy-policy">
              <span className="underline">
                Privacy & policy
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

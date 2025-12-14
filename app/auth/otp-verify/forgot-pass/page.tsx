"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import styles from "../../auth.module.css";

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

  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("p_aut") : null;

  const registererEmail = typeof window !== "undefined"
    ? localStorage.getItem("r_email")
    : null;

  useEffect(() => {
    if (isLoginUser || !registererEmail) {
      router.push("/");
    }
  }, [isLoginUser, registererEmail, router]);

  async function verifyOtp(data: any) {
    try {
      setIsLoading(true);
      setError(null);

      const otpCode = data.o1 + data.o2 + data.o3 + data.o4;

      // Mock OTP verification - in real app, call API here
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store reset token for password change
      if (typeof window !== "undefined") {
        localStorage.setItem("r_tok", "mock-reset-token-12345");
      }

      router.push("/auth/set-new-password");
    } catch (e: any) {
      setError(e?.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = (event.target as HTMLInputElement).value;
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
    const value = (event.target as HTMLInputElement).value;
    if (event.key === "Backspace") {
      setValue(`o${index + 1}`, "", { shouldValidate: true });

      if (index > 0) {
        setTimeout(() => inputRefs.current[index - 1]?.focus(), 50);
      }
    } else if (/^\d$/.test(value)) {
      setValue(`o${index + 1}`, event.key, { shouldValidate: true });
      if (index < inputRefs.current.length - 1) {
        setTimeout(() => inputRefs.current[index + 1]?.focus(), 50);
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
      <section className={`align-items-center d-flex ${styles.authWrap}`}>
        <div
          className={`flex-grow-1 m-auto ${styles.authInner} ${styles.authRecoveryForm}`}
        >
          <div className="auth-header mb-5">
            <h4 className="fw-bold text-center mb-0">
              Two factor authentication
            </h4>
            <p className="fz14 lh-base text-center mb-0 mt-4">
              We have sent a code to{" "}
              <span className="fw-medium text-dark">{registererEmail}</span>
            </p>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit(verifyOtp)}>
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className={styles.authLabel}>
                  Enter the code we have sent you:
                </label>
                <div className="d-flex justify-content-between gap-1 gap-sm-3 mb-2">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="position-relative">
                      <input
                        type="tel"
                        maxLength={1}
                        pattern="[0-9]*"
                        className={`form-control verification-form text-center ${styles.authInput}`}
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
                          <span className="text-danger fz14">{message}</span>
                        )}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="rounded ud-btn btn-default w-100"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify and Process"}
              </button>
            </form>
          </div>
          <div className="mt-4 text-center">
            <div className="d-inline fw-semibold fz12 text-body-secondary text-uppercase">
              Remember your password?{" "}
              <Link href="/auth/sign-in" className={styles.authLink}>
                Log in
              </Link>
            </div>
          </div>
          <div className="mt-3 text-center auth-text fz13">
            Secure Login with reCAPTCHA subject to Google{" "}
            <a target="_blank" href="/terms">
              <span className="text-decoration-underline">Terms</span>
            </a>
            &amp;
            <a target="_blank" href="/privacy-policy">
              <span className="text-decoration-underline">Privacy</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

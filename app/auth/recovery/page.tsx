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
      <section className={`align-items-center d-flex ${styles.authWrap}`}>
        <div
          className={`flex-grow-1 m-auto ${styles.authInner} ${styles.authRecoveryForm}`}
        >
          <div className="auth-header mb-5">
            <h4 className="fw-bold text-center mb-0">Forgot Password</h4>
            <p className="fz13 lh-base text-center mb-0 mt-4">
              Enter your account&apos;s email and we&apos;ll send you an email to reset
              the password.
            </p>
          </div>
          <div className="auth-body">
            <form onSubmit={handleSubmit(submit)}>
              {error && (
                <div className="alert alert-danger mb-4" role="alert">
                  {error}
                </div>
              )}
              <div className="mb-4">
                <label className={styles.authLabel}>Email address</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className={`form-control ${styles.authInput}`}
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
                    <div className="text-danger fz14">{message}</div>
                  )}
                />
              </div>
              <button
                type="submit"
                className="rounded ud-btn btn-default w-100"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send email"}
              </button>
            </form>
          </div>
          <div className="mt-3 text-center auth-text fz13">
            Secure Login with reCAPTCHA subject to Google <br />
            <a target="_blank" href="/privacy-policy">
              <span className="text-decoration-underline">
                Privacy & policy
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

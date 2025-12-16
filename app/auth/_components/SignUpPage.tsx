"use client";
import { ErrorMessage } from "@hookform/error-message";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as yup from "yup";
import Cookies from "js-cookie";
import styles from "../auth.module.css";

interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
}

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&]/,
      "Password must contain at least one special character"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), ""], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SignUpPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IRegister>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registererType = typeof window !== "undefined"
    ? localStorage.getItem("registerer_type")
    : null;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const refCode = Cookies.get("re_c");

  async function registerAccount(data: IRegister) {
    try {
      setIsLoading(true);
      setError(null);

      // Store email for OTP verification
      if (typeof window !== "undefined") {
        localStorage.setItem("r_email", data.email);
        localStorage.setItem("r_ty", "signUp");
      }

      // Mock registration - in real app, call API here
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Your account has been registered");
      Cookies.remove("re_c");
      router.push("/auth/otp-verify");
    } catch (e: any) {
      toast.error(e?.message || "Registration failed");
      setError(e?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div className={`flex-grow m-auto ${styles.authInner}`}>
          <div className="auth-header mb-5">
            <h4 className="font-bold text-center mb-0">Create Your Account</h4>
            <div className="text-[13px] mt-1 text-center">
              I already have an account{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold underline text-primary"
              >
                Sign in
              </Link>
            </div>
            <p className="text-[13px] leading-normal text-center mb-0 mt-4">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="font-medium underline">
                Terms of Service
              </a>
              <br className="hidden d-sm-block" />
              {" "}and have read and understood the{" "}
              <a href="/privacy-policy" className="font-medium underline">
                Privacy Policy
              </a>
            </p>
          </div>
          <div className="auth-body">
            <div className="align-items-md-center auth-form d-mflex flex-md-row">
              <div className={styles.authFormLeft}>
                <form onSubmit={handleSubmit(registerAccount)}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className={styles.authLabel}>First Name</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${styles.authInput}`}
                        placeholder="Enter First Name"
                        {...register("first_name")}
                      />
                      <span className={styles.focusBorder}></span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="first_name"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={styles.authLabel}>Last Name</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${styles.authInput}`}
                        placeholder="Enter Last Name"
                        {...register("last_name")}
                      />
                      <span className={styles.focusBorder}></span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="last_name"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={styles.authLabel}>Email address</label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${styles.authInput}`}
                        placeholder="name@example.com"
                        {...register("email")}
                      />
                      <span className={styles.focusBorder}></span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={styles.authLabel}>PASSWORD</label>
                    <div className="position-relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${styles.authInput}`}
                        placeholder="Password"
                        autoComplete="off"
                        {...register("password")}
                      />
                      <span className={styles.focusBorder}></span>
                      <span
                        className="end-0 position-absolute top-50 translate-middle-y"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </span>
                    </div>
                    {/* Password requirements */}
                    <div className="mt-2 mb-0 text-[13px] text-secondary">
                      <span
                        style={{
                          color: /[a-z]/.test(watch("password") || "")
                            ? "green"
                            : errors.password
                            ? "#dc3545"
                            : "inherit",
                          fontWeight: /[a-z]/.test(watch("password") || "")
                            ? "bold"
                            : "normal",
                        }}
                      >
                        Lowercase,
                      </span>{" "}
                      <span
                        style={{
                          color: /[A-Z]/.test(watch("password") || "")
                            ? "green"
                            : errors.password
                            ? "#dc3545"
                            : "inherit",
                          fontWeight: /[A-Z]/.test(watch("password") || "")
                            ? "bold"
                            : "normal",
                        }}
                      >
                        Uppercase,
                      </span>{" "}
                      <span
                        style={{
                          color: /\d/.test(watch("password") || "")
                            ? "green"
                            : errors.password
                            ? "#dc3545"
                            : "inherit",
                          fontWeight: /\d/.test(watch("password") || "")
                            ? "bold"
                            : "normal",
                        }}
                      >
                        Number,
                      </span>{" "}
                      <span
                        style={{
                          color: /[@$!%*?&]/.test(watch("password") || "")
                            ? "green"
                            : errors.password
                            ? "#dc3545"
                            : "inherit",
                          fontWeight: /[@$!%*?&]/.test(watch("password") || "")
                            ? "bold"
                            : "normal",
                        }}
                      >
                        Special,
                      </span>{" "}
                      <span
                        style={{
                          color:
                            (watch("password") || "").length >= 8
                              ? "green"
                              : errors.password
                              ? "#dc3545"
                              : "inherit",
                          fontWeight:
                            (watch("password") || "").length >= 8
                              ? "bold"
                              : "normal",
                        }}
                      >
                        8+ chars
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className={styles.authLabel}>
                      CONFIRM PASSWORD
                    </label>
                    <div className="position-relative">
                      <input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${styles.authInput}`}
                        placeholder="Confirm Password"
                        autoComplete="off"
                        {...register("confirm_password")}
                      />
                      <span className={styles.focusBorder}></span>
                      <span
                        className="end-0 position-absolute top-50 translate-middle-y"
                        onClick={toggleConfirmPasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showConfirmPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="confirm_password"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 transition-all w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing up..." : "Sign up"}
                  </button>
                </form>
              </div>
              <div
                className={`items-center flex ${styles.authDevider}`}
              >
                <div className={styles.authDeviderLine} />
                <div className={styles.authDeviderText}>
                  <span>or</span>
                </div>
                <div className={styles.authDeviderLine} />
              </div>
              <div className={`${styles.authFormRight} grid gap-2`}>
                <button className={styles.authBtn} type="button">
                  <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span style={{ flexGrow: 1 }}>Continue with Google</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center auth-text text-[13px]">
            Secure Login with reCAPTCHA subject to Google{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="font-medium underline"
            >
              <br />
              Terms & Privacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

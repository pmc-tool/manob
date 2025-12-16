"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import styles from "../auth.module.css";

interface ILogin {
  username: string;
  password: string;
}

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const { login, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (inputData: ILogin) => {
    try {
      setError(null);
      const success = await login(inputData.username, inputData.password);
      if (success) {
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
        setError("Invalid email or password");
      }
    } catch (e: any) {
      toast.error(e?.message || "Login failed");
      setError(e?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div className={`flex-grow m-auto ${styles.authInner}`}>
          <div className="auth-header mb-5 text-center">
            <h4 className="font-bold text-center mb-0">Log into manob.ai</h4>
            <div className="text-[13px] mt-1">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth"
                className="font-semibold underline text-primary"
              >
                Create an account
              </Link>
            </div>
          </div>
          <div className="auth-body">
            <div className="align-items-md-center auth-form d-mflex flex-md-row">
              <div className={styles.authFormLeft}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      Email address
                    </label>
                    <div className="position-relative">
                      <input
                        type="text"
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${styles.authInput}`}
                        placeholder="name@example.com"
                        {...register("username", {
                          required: "Email field is required!",
                        })}
                      />
                      <span className={styles.focusBorder}></span>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="username"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>

                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      PASSWORD
                    </label>
                    <div className="position-relative">
                      <div className="position-relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${styles.authInput}`}
                          placeholder="Password"
                          autoComplete="off"
                          {...register("password", {
                            required: "Password field is required!",
                          })}
                        />
                        <span className={styles.focusBorder}></span>
                      </div>

                      <span
                        className="end-0 position-absolute top-50 translate-middle-y curp"
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
                    <ErrorMessage
                      errors={errors}
                      name="password"
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
                    {isLoading ? "Logging in..." : "Log in"}
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
          <div className="mt-5 text-center">
            <Link
              className={`inline font-semibold text-xs uppercase ${styles.authLink}`}
              href="/auth/recovery"
            >
              Can&apos;t log in?
            </Link>
          </div>
          <div className="mt-3 text-center auth-text text-[13px]">
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

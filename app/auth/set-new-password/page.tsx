"use client";
import { ErrorMessage } from "@hookform/error-message";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import styles from "../auth.module.css";

const schema = yup.object().shape({
  new_password: yup
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
    .oneOf([yup.ref("new_password"), ""], "Passwords must match")
    .required("Please confirm your password"),
});

interface IFormInputs {
  new_password: string;
  confirm_password: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("p_aut") : null;
  const rToken =
    typeof window !== "undefined" ? localStorage.getItem("r_tok") : "";

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

      router.push("/auth/sign-in");
    } catch (e: any) {
      setError(e?.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <section className={`items-center flex ${styles.authWrap}`}>
        <div className={`flex-grow m-auto ${styles.authInner}`}>
          <div className="auth-header mb-5 text-center">
            <h4 className="font-bold text-center mb-0">Set a new password</h4>
            <div className="text-[13px] mt-1">
              For security, use a strong password with a mix of uppercase,
              lowercase,
              <br /> numbers, and symbols to protect your account.
            </div>
          </div>
          <div className="auth-body">
            <div className="md:items-center justify-center auth-form md:flex md:flex-row">
              <div className={styles.authFormLeft}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      PASSWORD
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          id="new_password"
                          type={showPassword ? "text" : "password"}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${styles.authInput}`}
                          placeholder="New password"
                          autoComplete="off"
                          {...register("new_password")}
                        />
                        <span className={styles.focusBorder}></span>
                      </div>
                      <span
                        className="end-0 position-absolute top-50 translate-middle-y"
                        onClick={() => setShowPassword(!showPassword)}
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
                      name="new_password"
                      render={({ message }) => (
                        <span className="text-red-500 text-sm">{message}</span>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      Confirm PASSWORD
                    </label>
                    <div className="relative">
                      <div className="relative">
                        <input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12 ${styles.authInput}`}
                          placeholder="Confirm password"
                          autoComplete="off"
                          {...register("confirm_password")}
                        />
                        <span className={styles.focusBorder}></span>
                      </div>

                      <span
                        className="end-0 position-absolute top-50 translate-middle-y"
                        onClick={() =>
                          setConfirmShowPassword(!showConfirmPassword)
                        }
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
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </form>
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
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="font-medium underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

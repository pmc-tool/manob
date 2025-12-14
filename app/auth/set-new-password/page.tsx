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
      <section className={`align-items-center d-flex ${styles.authWrap}`}>
        <div className={`flex-grow-1 m-auto ${styles.authInner}`}>
          <div className="auth-header mb-5 text-center">
            <h4 className="fw-bold text-center mb-0">Set a new password</h4>
            <div className="fz13 mt-1">
              For security, use a strong password with a mix of uppercase,
              lowercase,
              <br /> numbers, and symbols to protect your account.
            </div>
          </div>
          <div className="auth-body">
            <div className="align-items-md-center justify-content-center auth-form d-md-flex flex-md-row">
              <div className={styles.authFormLeft}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {error && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      PASSWORD
                    </label>
                    <div className="position-relative">
                      <div className="position-relative">
                        <input
                          id="new_password"
                          type={showPassword ? "text" : "password"}
                          className={`form-control password ${styles.authInput}`}
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
                        <span className="text-danger fz14">{message}</span>
                      )}
                    />
                  </div>
                  <div className="mb-4">
                    <label className={`${styles.authLabel} required`}>
                      Confirm PASSWORD
                    </label>
                    <div className="position-relative">
                      <div className="position-relative">
                        <input
                          id="confirm_password"
                          type={showConfirmPassword ? "text" : "password"}
                          className={`form-control password ${styles.authInput}`}
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
                        <span className="text-danger fz14">{message}</span>
                      )}
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded ud-btn btn-default w-100"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center auth-text fz13">
            Secure Login with reCAPTCHA subject to Google{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="fw-medium text-decoration-underline"
            >
              <br />
              Terms
            </Link>{" "}
            &amp;{" "}
            <Link
              href="/privacy-policy"
              target="_blank"
              className="fw-medium text-decoration-underline"
            >
              Privacy
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

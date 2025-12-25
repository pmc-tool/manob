import type { Metadata } from "next";
import SignInPage from "../_components/SignInPage";

export const metadata: Metadata = {
  title: "Sign In | manob.ai",
  description:
    "Sign in to your manob.ai account to access your dashboard, purchases, and more.",
  alternates: {
    canonical: "https://manob.ai/auth/sign-in",
  },
};

export default function Page() {
  return <SignInPage />;
}

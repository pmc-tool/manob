import type { Metadata } from "next";
import SignUpPage from "../_components/SignUpPage";

export const metadata: Metadata = {
  title: "Create Account | manob.ai",
  description:
    "Join manob.ai to discover digital products, templates, and services from top creators.",
  alternates: {
    canonical: "https://manob.ai/auth/sign-up",
  },
};

export default function Page() {
  return <SignUpPage />;
}

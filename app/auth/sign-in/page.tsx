import type { Metadata } from "next";
import SignInPage from "../_components/SignInPage";

export const metadata: Metadata = {
  title: "Login or Register at Packmycode | Start Today",
  description:
    "Access your Packmycode account or register for free to start buying, selling, or posting jobs today.",
  alternates: {
    canonical: "https://packmycode.com/auth/sign-in",
  },
};

export default function Page() {
  return <SignInPage />;
}

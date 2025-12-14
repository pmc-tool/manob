import type { Metadata } from "next";
import SignUpPage from "../_components/SignUpPage";

export const metadata: Metadata = {
  title: "Login or Register at Packmycode | Start Today",
  description:
    "Access your Packmycode account or register for free to start buying, selling, or posting jobs today.",
  alternates: {
    canonical: "https://packmycode.com/auth/sign-up",
  },
};

export default function Page() {
  return <SignUpPage />;
}

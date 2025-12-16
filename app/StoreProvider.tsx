"use client";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "../state/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isLoginUser =
    typeof window !== "undefined" ? localStorage.getItem("p_aut") : null;
  // useEffect(() => {
  //   const basePath = window.location.pathname.split("/")[1]; // Extract the first segment of the URL path
  //   const sellingRegExp = /^seller/;
  //   const buyingRegExp = /^user/;
  //   const jobsRegExp = /^job-list/;
  //   const chatRegExp = /^chat/;

  //   if (sellingRegExp.test(basePath)) {
  //     // localStorage.setItem("u_type", "SELLING_MENU");
  //     localStorage.setItem("r_ty", "SELLER");
  //   } else if (buyingRegExp.test(basePath)) {
  //     // localStorage.setItem("u_type", "BUYING_MENU");
  //     localStorage.setItem("r_ty", "BUYER");
  //   }else if(jobsRegExp.test(basePath) || chatRegExp.test(basePath)) {
  //     console.log('no change');
  //   } else {
  //     localStorage.setItem("r_ty", "BUYER");
  //   }
  // }, [pathname, searchParams]);

  useEffect(() => {
    const basePath = window.location.pathname.split("/")[1]; // Extract first URL segment

    const roleMap: Record<string, string> = {
      seller: "SELLER",
      user: "BUYER",
    };
    const regex =
      /^(\/job-list|\/job-details\/.*|\/product-details\/.*|\/service-details\/.*|\/chat|\/help|\/faqs|\/topic-questions\/.*|\/articles\/.*|\/blog|\/blog\/.*|\/support|\/support\/.*|\/contact|\/discussion|\/discussion\/.*|\/profile\/.*|\/referral|\/notifications|\/support-policy|\/support-contact|\/C2M-requests|\/C2SM-requests|\/S2M-requests|\/support-search-result|\/support-search-result\/.*|\/connect|\/connect\/.*|\/connect-payment|\/connect-payment\/.*|\/.*)$/;

    if (isLoginUser) {
      if (roleMap[basePath]) {
        typeof window !== "undefined" &&
          localStorage.setItem("r_ty", roleMap[basePath]);
      } else if (regex.test(basePath)) {
        typeof window !== "undefined" && localStorage.setItem("r_ty", "BUYER");
      }
    }
  }, [pathname, searchParams, isLoginUser]);

  return <Provider store={store}>{children}</Provider>;
}

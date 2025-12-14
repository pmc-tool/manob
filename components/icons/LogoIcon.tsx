"use client";

import Image from "next/image";

export function LogoIcon({ size = 30 }: { size?: number }) {
  return (
    <Image
      src="/images/logo-manob.png"
      alt="manob.ai"
      width={size}
      height={size}
      style={{ objectFit: "contain" }}
    />
  );
}

"use client"

import React from "react"
import clsx from "clsx"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost"
  className?: string
}

export const Button = ({ variant = "ghost", className, children, ...rest }: Props) => {
  const base = "inline-flex items-center justify-center rounded-sm text-sm font-medium"
  const variantClass =
    variant === "primary"
      ? "bg-[#0366d6] text-white hover:bg-[#035fc4]"
      : "bg-white text-[#374151] hover:bg-[#f6f7f9] border border-[#e8eaee]"

  return (
    <button {...rest} className={clsx(base, variantClass, className)}>
      {children}
    </button>
  )
}

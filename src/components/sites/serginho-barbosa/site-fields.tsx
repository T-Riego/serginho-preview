import type { ComponentProps } from "react";
import { clsx } from "clsx";

// Native controls with the size and focus treatment adapted from uiux-base.
export function SiteInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={clsx("sb-field", className)} {...props} />;
}

export function SiteTextarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={clsx("sb-field sb-textarea", className)} {...props} />;
}

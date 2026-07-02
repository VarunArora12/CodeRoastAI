import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        className={cn(
          "flex h-11 w-full rounded-md border border-white/10 bg-black/45 px-4 text-sm text-zinc-100 shadow-inner shadow-black/20 outline-none transition-colors placeholder:text-zinc-500 focus-visible:border-violet-300/40 focus-visible:ring-2 focus-visible:ring-violet-300/30 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

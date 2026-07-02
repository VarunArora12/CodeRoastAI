import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "min-h-[360px] w-full resize-y rounded-md border border-white/10 bg-black/40 px-4 py-4 font-mono text-[13px] leading-6 text-zinc-100 shadow-inner shadow-black/30 outline-none placeholder:text-zinc-500 transition-colors focus:border-violet-300/70 focus:ring-2 focus:ring-violet-300/20 sm:min-h-[420px] sm:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

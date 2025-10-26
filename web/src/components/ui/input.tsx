import * as React from "react";
import { cn } from "@/utils/helpers/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border-[1.5px] bg-white px-3 py-1 text-base text-black shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-9 file:items-center file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        type === "file" &&
          "bg-background items-center border-none p-0 text-sm text-white file:cursor-pointer file:rounded file:border-0 file:bg-gray-200 file:px-4 file:text-sm file:font-semibold file:text-gray-700 hover:file:bg-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

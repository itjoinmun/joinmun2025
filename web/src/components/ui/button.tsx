import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        primary: "bg-red-normal border-none text-primary-foreground shadow-xs hover:bg-red-dark",
        gray: "bg-gray text-white shadow-xs hover:bg-gray/80",
        outline:
          "border border-gray-light bg-background shadow-xs hover:bg-gray-light/20 dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        insideCard: "bg-background/80 text-primary-foreground hover:bg-background shadow-xs",
        gradient:
          "bg-gradient-to-t from-white/20 to-white text-foreground hover:text-red-dark-hover hover:bg-primary-foreground",
        link: "text-white hover:text-white/80",
        ghost: "hover:bg-transparent hover:bg-gray-light/20 dark:hover:bg-accent/50",
        white: "bg-white text-black shadow-xs hover:bg-white/80",
        warning: "bg-gold text-black hover:bg-gold/80",
        warningOutline: "bg-red-dark border border-gold text-gold hover:bg-red-dark-hover",

        // destructive:
        //   "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        //   "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

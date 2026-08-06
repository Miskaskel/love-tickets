import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-label text-xs tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-wine-500 text-cream-100 hover:bg-wine-600 shadow-soft",
        outline: "border border-wine-500/40 text-wine-500 hover:bg-wine-500/5",
        ghost: "text-ink/70 hover:bg-ink/5",
        gold: "bg-gold-500 text-cream-100 hover:bg-gold-600 shadow-gold",
        destructive: "bg-red-700 text-cream-100 hover:bg-red-800",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-[10px]",
        lg: "h-12 px-8",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

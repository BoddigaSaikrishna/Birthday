import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // ── Romantic: frosted glass soft pill ──
        romantic: [
          "relative overflow-hidden",
          "bg-gradient-to-r from-[hsl(330_60%_22%/0.85)] to-[hsl(280_50%_18%/0.85)]",
          "text-[hsl(330_80%_80%)]",
          "border border-[hsl(330_70%_55%/0.35)]",
          "backdrop-blur-md",
          "font-body tracking-widest uppercase text-xs",
          "px-8 py-3",
          "shadow-[0_0_14px_hsl(330_80%_60%/0.35),0_0_30px_hsl(280_60%_55%/0.15)]",
          "hover:shadow-[0_0_22px_hsl(330_80%_65%/0.65),0_0_50px_hsl(280_60%_55%/0.3)]",
          "hover:border-[hsl(330_70%_65%/0.6)]",
          "hover:scale-105 active:scale-95",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-[hsl(330_80%_70%/0.07)] before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%]",
          "before:transition-transform before:duration-700",
        ].join(" "),

        // ── Confession: bold glowing CTA ──
        confession: [
          "relative overflow-hidden",
          "bg-gradient-to-r from-[hsl(330_75%_48%)] via-[hsl(340_80%_55%)] to-[hsl(320_70%_50%)]",
          "text-white font-body tracking-widest uppercase text-sm",
          "border border-[hsl(330_80%_65%/0.4)]",
          "shadow-[0_0_20px_hsl(330_80%_60%/0.5),0_0_50px_hsl(330_80%_50%/0.25)]",
          "hover:shadow-[0_0_32px_hsl(330_80%_65%/0.75),0_0_70px_hsl(330_80%_50%/0.4)]",
          "hover:scale-105 active:scale-95",
          "before:absolute before:inset-0",
          "before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent",
          "before:translate-x-[-100%] hover:before:translate-x-[100%]",
          "before:transition-transform before:duration-700",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
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

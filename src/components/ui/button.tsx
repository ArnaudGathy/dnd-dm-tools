import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive/50 text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      theme: {
        red: "bg-red-500 text-red-50 hover:bg-red-600",
        orange: "bg-orange-500 text-orange-50 hover:bg-orange-600",
        amber: "bg-amber-500 text-amber-50 hover:bg-amber-600",
        yellow: "bg-yellow-500 text-yellow-50 hover:bg-yellow-600",
        lime: "bg-lime-500 text-lime-50 hover:bg-lime-600",
        green: "bg-green-500 text-green-50 hover:bg-green-600",
        emerald: "bg-emerald-500 text-emerald-50 hover:bg-emerald-600",
        teal: "bg-teal-500 text-teal-50 hover:bg-teal-600",
        cyan: "bg-cyan-500 text-cyan-50 hover:bg-cyan-600",
        sky: "bg-sky-500 text-sky-50 hover:bg-sky-600",
        blue: "bg-blue-500 text-blue-50 hover:bg-blue-600",
        indigo: "bg-indigo-500 text-indigo-50 hover:bg-indigo-600",
        violet: "bg-violet-500 text-violet-50 hover:bg-violet-600",
        purple: "bg-purple-500 text-purple-50 hover:bg-purple-600",
        fuchsia: "bg-fuchsia-500 text-fuchsia-50 hover:bg-fuchsia-600",
        pink: "bg-pink-500 text-pink-50 hover:bg-pink-600",
        rose: "bg-rose-500 text-rose-50 hover:bg-rose-600",
        neutral: "bg-neutral-700 text-neutral-50 hover:bg-neutral-600",
        white: "bg-white text-slate-900 hover:bg-slate-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-md px-3",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "p-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, theme, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, theme, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

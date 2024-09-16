import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-blue-500 ",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-hover focus:outline-none focus:ring-4 focus:ring-primary-ring",
        destructive:
          "bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white",
        outline:
          "border border-gray-200 bg-background hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600",
        outline_destructive:
          "border border-red-600 text-red-600 dark:text-red-500 hover:bg-red-700 hover:text-white dark:border-red-500 dark:hover:bg-red-600 dark:hover:text-white",
        secondary:
          "bg-gray-100 hover:bg-gray-100/80 dark:bg-gray-800 dark:hover:bg-gray-800/80",
        ghost:
          "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
        link: "underline-offset-4 hover:underline",
        green:
          "text-white bg-green-500 hover:bg-green-500/90 dark:bg-green-500 dark:hover:bg-green-500/90",
      },
      size: {
        default: "h-10 px-5 py-2.5 me-2 mb-2 rounded-xl font-medium text-sm",
        xs: "h-6 rounded-lg px-2",
        sm: "h-9 rounded-xl px-3",
        lg: "h-11 rounded-xl px-8",
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

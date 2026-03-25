import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-700",
        secondary: "bg-secondary-100 text-secondary-700",
        success: "bg-success-100 text-success-700",
        warning: "bg-warning-100 text-warning-700",
        error: "bg-error-100 text-error-700",
        outline: "border border-border text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span
          className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", {
            "bg-primary-500": variant === "default" || !variant,
            "bg-secondary-500": variant === "secondary",
            "bg-success-500": variant === "success",
            "bg-warning-500": variant === "warning",
            "bg-error-500": variant === "error",
          })}
        />
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

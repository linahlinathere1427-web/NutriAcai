import * as React from "react";
import { cn } from "@/lib/utils";

const NutriCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "glass" | "elevated" | "gradient";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-card gradient-card",
    glass: "glass border border-primary/10",
    elevated: "bg-card shadow-card hover:shadow-lg transition-shadow",
    gradient: "gradient-primary text-primary-foreground",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl p-5 transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
NutriCard.displayName = "NutriCard";

const NutriCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
));
NutriCardHeader.displayName = "NutriCardHeader";

const NutriCardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-display font-bold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
NutriCardTitle.displayName = "NutriCardTitle";

const NutriCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
NutriCardDescription.displayName = "NutriCardDescription";

const NutriCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
NutriCardContent.displayName = "NutriCardContent";

const NutriCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
));
NutriCardFooter.displayName = "NutriCardFooter";

export {
  NutriCard,
  NutriCardHeader,
  NutriCardFooter,
  NutriCardTitle,
  NutriCardDescription,
  NutriCardContent,
};

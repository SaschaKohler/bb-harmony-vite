import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = ({
  className,
  size = "md",
  ...props
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div role="status" {...props}>
      <Loader2
        className={cn(
          "animate-spin text-muted-foreground",
          sizeClasses[size],
          className,
        )}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "border rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

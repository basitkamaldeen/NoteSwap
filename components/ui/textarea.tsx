import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "border rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:border-gray-700",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

import type { ReactNode } from "react";
import { Surface } from "@/components/Surface";
import { cn } from "@/lib/utils";

interface NoticeProps {
  children: ReactNode;
  action: ReactNode;
  className?: string | undefined;
}

// One row at every width, so a stack of notices does not push the page content off a phone screen.
export function Notice({ children, action, className }: NoticeProps) {
  return (
    <Surface
      padding="compact"
      className={cn("flex items-center justify-between gap-4 text-sm", className)}
    >
      <span className="min-w-0 break-words">{children}</span>
      <span className="shrink-0">{action}</span>
    </Surface>
  );
}

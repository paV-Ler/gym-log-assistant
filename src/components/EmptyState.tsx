import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-dashed border-border px-6 py-14 text-center">
      <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-secondary text-primary outline outline-8 outline-secondary/40">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

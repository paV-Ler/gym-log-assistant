import { Button } from "@/components/ui/button";

const STATUS = "py-12 text-center text-sm text-muted-foreground";
const SKELETON = "rounded-lg bg-card animate-pulse motion-reduce:animate-none";
const TILES = ["first", "second", "third", "fourth"];

// The outline of a typical page (a row of tiles and a card), so loading does not shift the layout.
export function LoadingState({ label }: { label: string }) {
  return (
    <div role="status" className="skeleton-delayed space-y-6">
      <span className="sr-only">{label}</span>
      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        {TILES.map((tile) => (
          <div key={tile} className={`${SKELETON} h-24`} />
        ))}
      </div>
      <div className={`${SKELETON} h-64`} />
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className={STATUS}>
      {message}{" "}
      <Button variant="link" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ExerciseSearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
}

export function ExerciseSearchField({
  value,
  onChange,
  autoFocus = false,
}: ExerciseSearchFieldProps) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        autoFocus={autoFocus}
        aria-label="Search exercises"
        placeholder="Search exercises"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-10"
      />
    </div>
  );
}

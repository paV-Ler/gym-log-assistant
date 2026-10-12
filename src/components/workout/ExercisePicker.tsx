import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useExercises } from "@/hooks/useExercises";
import { groupExercises } from "@/lib/workout";
import type { Exercise } from "@/types/domain";
import { ExerciseList } from "./ExerciseList";
import { ExerciseSearchField } from "./ExerciseSearchField";

interface ExercisePickerProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedIds: Set<string>;
  onSelect: (exercise: Exercise) => void;
}

export function ExercisePicker({
  title,
  open,
  onOpenChange,
  addedIds,
  onSelect,
}: ExercisePickerProps) {
  const { data: exercises = [] } = useExercises();
  const [search, setSearch] = useState("");
  const mobile = useIsMobile();
  const groups = groupExercises(exercises, search);

  const handleOpenChange = (next: boolean) => {
    onOpenChange(next);
    if (!next) setSearch("");
  };

  const handleSelect = (exercise: Exercise) => {
    onSelect(exercise);
    setSearch("");
  };

  if (mobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange} shouldScaleBackground={false}>
        <DrawerContent className="mobile-sheet flex flex-col" aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="shrink-0 px-4 pb-3">
            {/* No autofocus: it would open the keyboard over the list. */}
            <ExerciseSearchField value={search} onChange={setSearch} />
          </div>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
            <ExerciseList
              groups={groups}
              addedIds={addedIds}
              onSelect={handleSelect}
              rowClassName="min-h-11"
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ExerciseSearchField value={search} onChange={setSearch} autoFocus />
        <div className="max-h-[55vh] space-y-5 overflow-y-auto pr-1">
          <ExerciseList groups={groups} addedIds={addedIds} onSelect={handleSelect} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

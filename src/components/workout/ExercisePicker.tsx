import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Exercise } from "@/types/domain";
import { ExerciseList } from "./ExerciseList";
import { ExerciseSearchField } from "./ExerciseSearchField";
import { SelectedExercises } from "./SelectedExercises";
import { useExercisePicker } from "./useExercisePicker";

interface ExercisePickerProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addedIds: Set<string>;
  // Several exercises are picked and confirmed together; otherwise one tap picks and closes.
  multiple?: boolean;
  onSelect: (exercises: Exercise[]) => void;
}

export function ExercisePicker({
  title,
  open,
  onOpenChange,
  addedIds,
  multiple = false,
  onSelect,
}: ExercisePickerProps) {
  const picker = useExercisePicker({ multiple, onOpenChange, onSelect });
  const mobile = useIsMobile();
  const selectedIds = multiple ? picker.selectedIds : undefined;
  const selection = multiple && (
    <SelectedExercises exercises={picker.selected} onRemove={picker.remove} onMove={picker.move} />
  );
  const cancel = (
    <Button type="button" variant="outline" onClick={() => picker.changeOpen(false)}>
      Cancel
    </Button>
  );
  const confirm = (
    <Button type="button" disabled={picker.selected.length === 0} onClick={picker.confirm}>
      {picker.confirmLabel}
    </Button>
  );

  if (mobile) {
    return (
      <Drawer open={open} onOpenChange={picker.changeOpen} shouldScaleBackground={false}>
        <DrawerContent className="mobile-sheet flex flex-col" aria-describedby={undefined}>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="shrink-0 space-y-3 px-4 pb-3">
            {/* No autofocus: it would open the keyboard over the list. */}
            <ExerciseSearchField value={picker.search} onChange={picker.setSearch} />
            {selection}
          </div>
          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 pb-4">
            <ExerciseList
              groups={picker.groups}
              addedIds={addedIds}
              selectedIds={selectedIds}
              onSelect={picker.pick}
              rowClassName="min-h-11"
            />
          </div>
          {multiple && (
            <DrawerFooter className="shrink-0 flex-row justify-between border-t border-border">
              {cancel}
              {confirm}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={picker.changeOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ExerciseSearchField value={picker.search} onChange={picker.setSearch} autoFocus />
        {selection}
        <div className="max-h-[50vh] space-y-5 overflow-y-auto pr-1">
          <ExerciseList
            groups={picker.groups}
            addedIds={addedIds}
            selectedIds={selectedIds}
            onSelect={picker.pick}
          />
        </div>
        {multiple && (
          <DialogFooter className="gap-2">
            {cancel}
            {confirm}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

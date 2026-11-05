import { X } from "lucide-react";
import { Hint } from "@/components/Hint";
import { RECORD_ROW, RECORD_TEXT } from "@/components/record-row";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
import type { DraftRecord, SetFieldErrors } from "@/lib/draft";
import {
  REPS_INPUT_MAX_LENGTH,
  SET_REPS_MAX,
  SET_REPS_MIN,
  SET_WEIGHT_MAX_KG,
  WEIGHT_INPUT_MAX_LENGTH,
} from "@/lib/limits";
import { formatNumber } from "@/lib/number";
import { cn } from "@/lib/utils";
import type { DraftSet } from "@/types/domain";
import { weightInputId } from "./set-input-id";

const WEIGHT_STEP_KG = 2.5;

const FIELD_CELL = "py-2 pr-1 md:pr-3";
const MESSAGE_CELL = "pb-2 pr-1 align-top text-xs md:pr-3";

interface SetRowProps {
  index: number;
  set: DraftSet;
  errors: SetFieldErrors | null;
  record: DraftRecord | null;
  onChange: (patch: Partial<DraftSet>) => void;
  onRemove: () => void;
  onRepsEnter?: (() => void) | undefined;
}

export function SetRow({
  index,
  set,
  errors,
  record,
  onChange,
  onRemove,
  onRepsEnter,
}: SetRowProps) {
  const number = index + 1;
  const showRecord = !!record && !errors;
  return (
    <>
      <tr className={cn("border-t border-border", showRecord && RECORD_ROW)}>
        <td
          className={cn(
            "tabular w-5 py-2 pl-1 text-sm md:w-10 md:pl-2",
            showRecord ? RECORD_TEXT : "text-muted-foreground",
          )}
        >
          {number}
        </td>
        <td className={FIELD_CELL}>
          <NumberInput
            id={weightInputId(set.id)}
            aria-label={`Set ${number} weight in kg`}
            aria-invalid={!!errors?.weight}
            min={0}
            max={SET_WEIGHT_MAX_KG}
            step={WEIGHT_STEP_KG}
            maxLength={WEIGHT_INPUT_MAX_LENGTH}
            value={set.weight}
            onValueChange={(weight) => onChange({ weight })}
            className="tabular md:h-9"
          />
        </td>
        <td className={FIELD_CELL}>
          <NumberInput
            aria-label={`Set ${number} reps`}
            aria-invalid={!!errors?.reps}
            min={SET_REPS_MIN}
            max={SET_REPS_MAX}
            step={1}
            maxLength={REPS_INPUT_MAX_LENGTH}
            value={set.reps}
            onValueChange={(reps) => onChange({ reps })}
            onKeyDown={(event) => {
              if (event.key === "Enter" && onRepsEnter) {
                event.preventDefault();
                onRepsEnter();
              }
            }}
            className="tabular md:h-9"
          />
        </td>
        <td className="w-11 py-2 text-right md:w-10">
          <Hint label="Remove set">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Remove set ${number}`}
              onClick={onRemove}
              className="text-muted-foreground hover:text-danger"
            >
              <X />
            </Button>
          </Hint>
        </td>
      </tr>
      {errors && (
        <tr className="text-danger">
          <td />
          <td className={MESSAGE_CELL} role={errors.weight ? "alert" : undefined}>
            {errors.weight}
          </td>
          <td className={MESSAGE_CELL} role={errors.reps ? "alert" : undefined}>
            {errors.reps}
          </td>
          <td />
        </tr>
      )}
      {showRecord && record && (
        <tr className={RECORD_ROW}>
          <td />
          <td colSpan={3} role="status" className="tabular pb-2 text-xs text-muted-foreground">
            <span className={RECORD_TEXT}>New record</span> · est. 1RM{" "}
            {formatNumber(record.estimate)} kg
          </td>
        </tr>
      )}
    </>
  );
}

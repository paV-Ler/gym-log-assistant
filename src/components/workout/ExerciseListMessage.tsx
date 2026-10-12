interface ExerciseListMessageProps {
  role?: "status" | "alert";
  children: string;
}

export function ExerciseListMessage({ role, children }: ExerciseListMessageProps) {
  return (
    <p role={role} className="py-8 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

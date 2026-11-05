// A record set or session, in every table: a tinted row with a coral bar on the left and a coral
// label. Tables that turn into grids on phones also mark the row with `data-record`, so
// `src/styles.css` can draw the bar along the whole row there.
export const RECORD_ROW =
  "bg-accent/60 [&>td:first-child]:shadow-[inset_2px_0_0_var(--color-primary)]";
export const RECORD_TEXT = "font-medium text-primary";

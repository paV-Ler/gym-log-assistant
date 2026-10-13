import { createFileRoute } from "@tanstack/react-router";
import { CalculatorPage } from "@/components/calculator/CalculatorPage";
import { pageMeta } from "@/lib/page-meta";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: pageMeta(
      "1RM Calculator",
      "Estimate your one-rep max with the Epley formula and see a full percentage table.",
    ),
  }),
  component: CalculatorPage,
});

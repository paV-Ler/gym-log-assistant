import { lazy, Suspense } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { LayoutDashboard } from "lucide-react";
import { DemoDataNotice, DemoDataOffer, LoadDemoDataButton } from "@/components/DemoData";
import { EmptyState } from "@/components/EmptyState";
import { Notice } from "@/components/Notice";
import { PageHeader } from "@/components/PageHeader";
import { ErrorState, LoadingState } from "@/components/PageStatus";
import { Button } from "@/components/ui/button";
import { useExercises } from "@/hooks/useExercises";
import { useWorkoutDraft } from "@/hooks/useWorkoutDraft";
import { useWorkouts } from "@/hooks/useWorkouts";
import { trainingCalendar } from "@/lib/calendar";
import {
  muscleGroupSplit,
  RECENT_ITEMS,
  recentPRs,
  weeklyBuckets,
  weeklyStreak,
  workoutsThisMonth,
} from "@/lib/dashboard";
import type { Exercise, Workout, WorkoutDraft } from "@/types/domain";
import { DashboardSection } from "./DashboardSection";
import { MuscleSplit } from "./MuscleSplit";
import { NextWorkoutNotice } from "./NextWorkoutNotice";
import { RecentRecords } from "./RecentRecords";
import { RecentWorkouts } from "./RecentWorkouts";
import { SummaryTiles } from "./SummaryTiles";
import { TrainingCalendar } from "./TrainingCalendar";

// Recharts is heavy and browser-only, so the chart loads on demand on the client.
const WeeklyVolumeChart = lazy(() => import("./WeeklyVolumeChart"));
const chartPlaceholder = <div className="h-64" />;

const TWO_COLUMNS = "grid grid-cols-1 gap-x-6 xl:grid-cols-2";

// Logging a workout is one click away in the sidebar and the bottom bar, so the page adds no button.
const HEADER = <PageHeader title="Dashboard" description="An overview of your recent training" />;

const hasUnfinishedDraft = (draft: WorkoutDraft | null | undefined): boolean =>
  !!draft && (draft.entries.length > 0 || draft.notes.trim() !== "");

function DraftNotice() {
  return (
    <Notice
      action={
        <Button asChild variant="link" className="h-auto p-0">
          <Link to="/">Continue draft</Link>
        </Button>
      }
    >
      <span className="text-muted-foreground">You have an unfinished workout.</span>
    </Notice>
  );
}

interface OverviewProps {
  workouts: Workout[];
  exercises: Exercise[];
}

function Overview({ workouts, exercises }: OverviewProps) {
  const today = new Date();
  const weeks = weeklyBuckets(workouts, today);

  return (
    <>
      <SummaryTiles
        weeks={weeks}
        workoutsThisMonth={workoutsThisMonth(workouts, today)}
        streak={weeklyStreak(workouts, today)}
      />

      <div className={TWO_COLUMNS}>
        <DashboardSection title="Weekly volume" subtitle="Last 8 weeks">
          <ClientOnly fallback={chartPlaceholder}>
            <Suspense fallback={chartPlaceholder}>
              <WeeklyVolumeChart data={weeks} />
            </Suspense>
          </ClientOnly>
        </DashboardSection>

        <DashboardSection title="Muscle group split" subtitle="Sets in the last 30 days">
          <MuscleSplit split={muscleGroupSplit(workouts, exercises, today)} />
        </DashboardSection>
      </div>

      <DashboardSection title="Training calendar" subtitle="Last 12 months">
        <TrainingCalendar calendar={trainingCalendar(workouts, today)} />
      </DashboardSection>

      <div className={TWO_COLUMNS}>
        <DashboardSection title="Recent personal records" subtitle="Best estimated 1RM">
          <RecentRecords records={recentPRs(workouts, exercises)} />
        </DashboardSection>

        <DashboardSection
          title="Recent workouts"
          action={
            <Button asChild variant="link" className="h-auto p-0">
              <Link to="/history">View all</Link>
            </Button>
          }
        >
          <RecentWorkouts workouts={workouts.slice(0, RECENT_ITEMS)} />
        </DashboardSection>
      </div>
      <DemoDataOffer />
    </>
  );
}

export function DashboardPage() {
  const workouts = useWorkouts();
  const exercises = useExercises();
  const draft = useWorkoutDraft();

  if (workouts.isPending || exercises.isPending) {
    return (
      <>
        {HEADER}
        <LoadingState label="Loading dashboard…" />
      </>
    );
  }

  if (workouts.isError || exercises.isError) {
    return (
      <>
        {HEADER}
        <ErrorState
          message="Could not load dashboard."
          onRetry={() => {
            void workouts.refetch();
            void exercises.refetch();
          }}
        />
      </>
    );
  }

  return (
    <>
      {HEADER}
      {/* Phones show the notices as one tight group, with the demo note last. */}
      <div className="mb-6 grid gap-2 empty:hidden md:gap-6">
        <DemoDataNotice />
        <NextWorkoutNotice />
        {hasUnfinishedDraft(draft.data) && <DraftNotice />}
      </div>
      {workouts.data.length === 0 ? (
        <EmptyState
          icon={LayoutDashboard}
          title="No workouts yet"
          description="Your overview will appear here once you log a workout."
        >
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/">Log your first workout</Link>
            </Button>
            <LoadDemoDataButton />
          </div>
        </EmptyState>
      ) : (
        <Overview workouts={workouts.data} exercises={exercises.data} />
      )}
    </>
  );
}

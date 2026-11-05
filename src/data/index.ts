/** Swap repository implementations here without changing consumers. */
export {
  exerciseRepository,
  workoutRepository,
  draftRepository,
  bodyWeightRepository,
  plannedWorkoutRepository,
} from "./local-storage-repositories";
export { StorageWriteError } from "./storage";

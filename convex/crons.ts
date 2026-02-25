import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "cleanup stale sessions",
  { hours: 1 },
  internal.cleanup.deleteStale
);

export default crons;

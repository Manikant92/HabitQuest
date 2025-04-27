
import { PointsState } from "./types";
import { initialTasks, initialRewards, initialStats } from "@/data/initialData";

export const initialPointsState: PointsState = {
  tasks: initialTasks,
  rewards: initialRewards,
  pointHistory: [],
  stats: initialStats
};

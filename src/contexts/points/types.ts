
import { Task, Reward, PointRecord, UserStats } from "@/types/types";

export interface PointsState {
  tasks: Task[];
  rewards: Reward[];
  pointHistory: PointRecord[];
  stats: UserStats;
}

export type PointsAction =
  | { type: "COMPLETE_TASK"; taskId: string }
  | { type: "ADD_TASK"; task: Omit<Task, "id" | "completed" | "createdAt"> & { id?: string } }
  | { type: "REDEEM_REWARD"; rewardId: string }
  | { type: "ADD_REWARD"; reward: Omit<Reward, "id"> & { id?: string } }
  | { type: "LOAD_STATE"; state: Partial<PointsState> }
  | { type: "SYNC_FROM_DB"; dbTasks: any[]; dbRewards: any[] };

export interface PointsContextType {
  tasks: Task[];
  rewards: Reward[];
  pointHistory: PointRecord[];
  stats: UserStats;
  completeTask: (taskId: string) => void;
  addTask: (title: string, points: number, category: string) => void;
  redeemReward: (rewardId: string) => void;
  addReward: (title: string, cost: number, description: string, category: string) => void;
}

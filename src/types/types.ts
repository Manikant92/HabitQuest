
export interface Task {
  id: string;
  title: string;
  points: number;
  category: string;
  completed: boolean;
  createdAt: Date;
}

export interface Reward {
  id: string;
  title: string;
  cost: number;
  category: string;
  description: string;
}

export interface PointRecord {
  id: string;
  amount: number;
  source: string;
  date: Date;
  type: "earned" | "spent";
}

export interface UserStats {
  dailyPoints: number;
  totalPoints: number;
  pointsSpent: number;
  pointsAvailable: number;
  streakDays: number;
  topTask: string;
  tasksCompleted: number;
}

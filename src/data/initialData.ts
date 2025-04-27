
import { Task, Reward, UserStats } from "@/types/types";

export const initialTasks: Task[] = [
  {
    id: "task-1",
    title: "Wake up at 7 AM",
    points: 2,
    category: "morning",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-2",
    title: "10 minutes meditation",
    points: 1,
    category: "morning",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-3",
    title: "Make your bed",
    points: 1,
    category: "morning",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-4",
    title: "Morning run",
    points: 3,
    category: "health",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-5",
    title: "30 minutes focused work",
    points: 2,
    category: "work",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-6",
    title: "Complete a difficult task",
    points: 5,
    category: "work",
    completed: false,
    createdAt: new Date(),
  },
  {
    id: "task-7",
    title: "Help a colleague",
    points: 2,
    category: "work",
    completed: false,
    createdAt: new Date(),
  }
];

export const initialRewards: Reward[] = [
  {
    id: "reward-1",
    title: "1 hour of gaming",
    cost: 15,
    category: "entertainment",
    description: "Enjoy guilt-free gaming time",
  },
  {
    id: "reward-2",
    title: "Social media break",
    cost: 5,
    category: "entertainment",
    description: "15 minutes of social media browsing",
  },
  {
    id: "reward-3",
    title: "Order takeout",
    cost: 25,
    category: "food",
    description: "Treat yourself to your favorite restaurant",
  }
];

export const initialStats: UserStats = {
  dailyPoints: 0,
  totalPoints: 0,
  pointsSpent: 0,
  pointsAvailable: 0,
  streakDays: 0,
  topTask: "",
  tasksCompleted: 0,
};

import { PointsState, PointsAction } from "./types";
import { generateId } from "./utils";
import { supabase } from "@/integrations/supabase/client";
import { PointRecord } from "@/types/types";

// Define valid task and reward categories for Supabase
type TaskCategory = "other" | "morning" | "work" | "health" | "personal";
type RewardCategory = "entertainment" | "social" | "food" | "shopping" | "other";

// Helper function to ensure category is valid for Supabase
const validateTaskCategory = (category: string): TaskCategory => {
  const validCategories: TaskCategory[] = ["other", "morning", "work", "health", "personal"];
  return validCategories.includes(category as TaskCategory) 
    ? (category as TaskCategory) 
    : "other";
};

const validateRewardCategory = (category: string): RewardCategory => {
  const validCategories: RewardCategory[] = ["entertainment", "social", "food", "shopping", "other"];
  return validCategories.includes(category as RewardCategory) 
    ? (category as RewardCategory) 
    : "other";
};

// Helper function to check if a date is today
const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Calculate daily points from point history
const calculateDailyPoints = (pointHistory: PointRecord[]): number => {
  return pointHistory
    .filter(record => isToday(new Date(record.date)) && record.type === "earned")
    .reduce((total, record) => total + record.amount, 0);
};

export const pointsReducer = (state: PointsState, action: PointsAction): PointsState => {
  switch (action.type) {
    case "COMPLETE_TASK": {
      const taskToComplete = state.tasks.find(task => task.id === action.taskId);
      if (!taskToComplete || taskToComplete.completed) return state;

      const updatedTasks = state.tasks.map(task => 
        task.id === action.taskId ? { ...task, completed: true } : task
      );

      const newPointRecord: PointRecord = {
        id: generateId(),
        amount: taskToComplete.points,
        source: taskToComplete.title,
        date: new Date(),
        type: "earned"
      };

      const updatedHistory = [...state.pointHistory, newPointRecord];

      // Check if this is the first task completed today
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const hasCompletedTaskToday = state.pointHistory.some(record => {
        const recordDate = new Date(record.date);
        return (
          recordDate >= todayStart &&
          record.type === "earned" && 
          record.source !== "Daily Streak Bonus"
        );
      });
      
      // Calculate streak
      let streakDays = state.stats.streakDays;
      let streakBonus = 0;
      
      if (!hasCompletedTaskToday) {
        // Check if the last active day was yesterday
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const yesterdayEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
        
        const wasActiveYesterday = state.pointHistory.some(record => {
          const recordDate = new Date(record.date);
          return recordDate >= yesterdayStart && recordDate <= yesterdayEnd;
        });
        
        if (wasActiveYesterday || streakDays === 0) {
          // Continue streak
          streakDays += 1;
          streakBonus = Math.min(10, streakDays); // Cap bonus at 10 points
          
          // Add streak bonus
          updatedHistory.push({
            id: generateId(),
            amount: streakBonus,
            source: "Daily Streak Bonus",
            date: new Date(),
            type: "earned"
          });
        } else {
          // Reset streak
          streakDays = 1;
        }
      }

      // Calculate daily points including the new task and any streak bonus
      const dailyPoints = calculateDailyPoints(updatedHistory);

      const updatedStats = {
        ...state.stats,
        dailyPoints: dailyPoints,
        totalPoints: state.stats.totalPoints + taskToComplete.points + streakBonus,
        pointsAvailable: state.stats.pointsAvailable + taskToComplete.points + streakBonus,
        tasksCompleted: state.stats.tasksCompleted + 1,
        streakDays: streakDays,
        topTask: state.stats.topTask === "" || taskToComplete.points > (state.tasks.find(t => t.title === state.stats.topTask)?.points || 0) 
          ? taskToComplete.title 
          : state.stats.topTask,
      };

      // Update task in database (async)
      const updateTaskInDb = async () => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            await supabase.from('tasks').update({
              is_completed: true,
              completed_at: new Date().toISOString()
            }).eq('id', action.taskId);
            
            await supabase.from('points_history').insert({
              amount: taskToComplete.points,
              description: taskToComplete.title,
              type: 'earned',
              user_id: userData.user.id
            });
            
            if (streakBonus > 0) {
              await supabase.from('points_history').insert({
                amount: streakBonus,
                description: "Daily Streak Bonus",
                type: 'earned',
                user_id: userData.user.id
              });
            }
            
            // Update user profile with new streak and points
            await supabase.from('profiles').update({
              streak_days: streakDays,
              total_points: state.stats.totalPoints + taskToComplete.points + streakBonus
            }).eq('id', userData.user.id);
          }
        } catch (error) {
          console.error("Error updating task in database:", error);
        }
      };
      
      updateTaskInDb();

      return { 
        ...state, 
        tasks: updatedTasks,
        pointHistory: updatedHistory,
        stats: updatedStats
      };
    }

    case "ADD_TASK": {
      const newTask = {
        id: action.task.id || generateId(),
        title: action.task.title,
        points: action.task.points,
        category: action.task.category,
        completed: false,
        createdAt: new Date()
      };
      
      const addTaskToDb = async () => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Ensure the category is valid before inserting
            const validCategory = validateTaskCategory(action.task.category);
            
            await supabase.from('tasks').insert({
              title: newTask.title,
              points: newTask.points,
              category: validCategory,
              user_id: userData.user.id
            });
          }
        } catch (error) {
          console.error("Error adding task to database:", error);
        }
      };
      
      addTaskToDb();

      return { 
        ...state, 
        tasks: [...state.tasks, newTask] 
      };
    }

    case "REDEEM_REWARD": {
      const rewardToRedeem = state.rewards.find(reward => reward.id === action.rewardId);
      if (!rewardToRedeem || state.stats.pointsAvailable < rewardToRedeem.cost) return state;

      // Create a point history record for spent points
      const spentPointsRecord: PointRecord = {
        id: generateId(),
        amount: rewardToRedeem.cost,
        source: rewardToRedeem.title,
        date: new Date(),
        type: "spent"
      };

      // Update point history and stats
      const updatedHistory = [...state.pointHistory, spentPointsRecord];
      
      // Recalculate daily points to ensure consistency
      const dailyPoints = calculateDailyPoints(updatedHistory);
      
      const updatedStats = {
        ...state.stats,
        dailyPoints: dailyPoints,
        pointsSpent: state.stats.pointsSpent + rewardToRedeem.cost,
        pointsAvailable: state.stats.pointsAvailable - rewardToRedeem.cost,
        totalPoints: state.stats.totalPoints  // Total points remain the same
      };

      // Async function to log points usage in database
      const logPointsUsage = async () => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Insert spent points record to points_history
            await supabase.from('points_history').insert({
              amount: rewardToRedeem.cost,
              description: `Redeemed: ${rewardToRedeem.title}`,
              type: 'spent',
              user_id: userData.user.id
            });
            
            // Update user's total points in profile
            await supabase.from('profiles').update({
              total_points: state.stats.totalPoints
            }).eq('id', userData.user.id);
          }
        } catch (error) {
          console.error("Error logging points usage:", error);
        }
      };
      
      // Call the async function
      logPointsUsage();

      return { 
        ...state, 
        pointHistory: updatedHistory,
        stats: updatedStats
      };
    }

    case "ADD_REWARD": {
      const newReward = {
        id: action.reward.id || generateId(),
        title: action.reward.title,
        cost: action.reward.cost,
        description: action.reward.description,
        category: action.reward.category
      };
      
      const addRewardToDb = async () => {
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            // Ensure the category is valid before inserting
            const validCategory = validateRewardCategory(action.reward.category);
            
            await supabase.from('rewards').insert({
              title: newReward.title,
              points_cost: newReward.cost,
              description: newReward.description,
              category: validCategory,
              user_id: userData.user.id
            });
          }
        } catch (error) {
          console.error("Error adding reward to database:", error);
        }
      };
      
      addRewardToDb();

      return { 
        ...state, 
        rewards: [...state.rewards, newReward] 
      };
    }

    case "LOAD_STATE": {
      const mergedState = {
        ...state,
        ...action.state
      };
      
      // Re-calculate daily points when loading state
      if (mergedState.pointHistory) {
        const dailyPoints = calculateDailyPoints(mergedState.pointHistory);
        
        if (mergedState.stats) {
          mergedState.stats = {
            ...mergedState.stats,
            dailyPoints: dailyPoints
          };
        }
      }
      
      return mergedState;
    }
      
    case "SYNC_FROM_DB": {
      const tasks = action.dbTasks.map(dbTask => ({
        id: dbTask.id,
        title: dbTask.title,
        points: dbTask.points,
        category: dbTask.category,
        completed: dbTask.is_completed,
        createdAt: new Date(dbTask.created_at)
      }));
      
      const rewards = action.dbRewards.map(dbReward => ({
        id: dbReward.id,
        title: dbReward.title,
        cost: dbReward.points_cost,
        description: dbReward.description,
        category: dbReward.category
      }));
      
      return {
        ...state,
        tasks,
        rewards
      };
    }

    default:
      return state;
  }
};

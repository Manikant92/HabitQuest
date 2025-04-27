
import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { PointsContextType, PointsState } from "./types";
import { pointsReducer } from "./pointsReducer";
import { initialPointsState } from "./constants";
import { supabase } from "@/integrations/supabase/client";

const PointsContext = createContext<PointsContextType | null>(null);

export const PointsProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(pointsReducer, initialPointsState);

  useEffect(() => {
    // Sync with database when auth state changes
    const fetchUserData = async () => {
      try {
        const { data: authData } = await supabase.auth.getSession();
        
        if (authData.session) {
          const { data: tasks, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (tasksError) throw tasksError;
          
          const { data: rewards, error: rewardsError } = await supabase
            .from('rewards')
            .select('*');
          
          if (rewardsError) throw rewardsError;
          
          if (tasks.length > 0 || rewards.length > 0) {
            dispatch({ type: "SYNC_FROM_DB", dbTasks: tasks || [], dbRewards: rewards || [] });
          }
          
          // Get points history to calculate properly
          const { data: pointHistoryData, error: pointHistoryError } = await supabase
            .from('points_history')
            .select('*')
            .eq('user_id', authData.session.user.id);
            
          if (pointHistoryError) throw pointHistoryError;
          
          // Calculate points from history
          let totalEarned = 0;
          let totalSpent = 0;
          
          if (pointHistoryData) {
            pointHistoryData.forEach((record) => {
              if (record.type === 'earned') {
                totalEarned += record.amount;
              } else if (record.type === 'spent') {
                totalSpent += record.amount;
              }
            });
          }
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('total_points, streak_days')
            .eq('id', authData.session.user.id)
            .single();
          
          if (profile) {
            const availablePoints = profile.total_points - totalSpent;
            
            dispatch({
              type: "LOAD_STATE",
              state: {
                stats: {
                  ...state.stats,
                  totalPoints: profile.total_points,
                  pointsAvailable: availablePoints >= 0 ? availablePoints : 0,
                  pointsSpent: totalSpent,
                  streakDays: profile.streak_days || 0
                }
              }
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data from database:", error);
      }
    };

    fetchUserData();
    
    // Also load from localStorage for fallback
    const savedState = localStorage.getItem("pointsSystem");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        
        // Fix date objects that were stringified
        if (parsedState.pointHistory) {
          parsedState.pointHistory = parsedState.pointHistory.map((record: any) => ({
            ...record,
            date: new Date(record.date)
          }));
        }
        
        if (parsedState.tasks) {
          parsedState.tasks = parsedState.tasks.map((task: any) => ({
            ...task,
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
          }));
        }
        
        dispatch({ type: "LOAD_STATE", state: parsedState });
      } catch (error) {
        console.error("Error loading saved state:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save to localStorage whenever state changes
    localStorage.setItem("pointsSystem", JSON.stringify(state));
  }, [state]);

  const completeTask = (taskId: string) => {
    dispatch({ type: "COMPLETE_TASK", taskId });
  };

  const addTask = (title: string, points: number, category: string) => {
    dispatch({ type: "ADD_TASK", task: { title, points, category } });
  };

  const redeemReward = (rewardId: string) => {
    dispatch({ type: "REDEEM_REWARD", rewardId });
  };

  const addReward = (title: string, cost: number, description: string, category: string) => {
    dispatch({ type: "ADD_REWARD", reward: { title, cost, description, category } });
  };

  return (
    <PointsContext.Provider
      value={{
        tasks: state.tasks,
        rewards: state.rewards,
        pointHistory: state.pointHistory,
        stats: state.stats,
        completeTask,
        addTask,
        redeemReward,
        addReward
      }}
    >
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error("usePoints must be used within a PointsProvider");
  }
  return context;
};

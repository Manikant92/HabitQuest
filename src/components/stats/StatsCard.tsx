
import { useState, useEffect } from "react";
import { UserStats } from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Calendar, Check, Star, TrendingUp, Activity, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePoints } from "@/contexts/points";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface StatsCardProps {
  stats: UserStats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState<string>("");
  const { tasks, pointHistory } = usePoints();
  const { toast } = useToast();
  const [leaderboardUsers, setLeaderboardUsers] = useState<any[]>([]);
  const navigate = useNavigate();
  
  const completedTasks = tasks.filter(task => task.completed);
  const todayCompletedTasks = completedTasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.createdAt);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });
  
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, total_points, streak_days')
        .order('total_points', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setLeaderboardUsers(data || []);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  };
  
  useEffect(() => {
    if (isDialogOpen && (activeDetail === "leaderboard" || activeDetail === "")) {
      fetchLeaderboard();
    }
  }, [isDialogOpen, activeDetail]);
  
  const handleStatClick = (statType: string) => {
    setActiveDetail(statType);
    setIsDialogOpen(true);
  };

  const handleViewFullLeaderboard = () => {
    setIsDialogOpen(false);
    navigate("/leaderboard");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex justify-between items-center">
            <span>Your Progress</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setActiveDetail("");
                setIsDialogOpen(true);
              }}
            >
              View Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              className="stat-card cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleStatClick("daily")}
            >
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-habit-yellow mr-2" />
                <h3 className="text-sm font-medium">Today</h3>
              </div>
              <p className="text-2xl font-bold">{stats.dailyPoints}</p>
              <p className="text-xs text-muted-foreground">Points earned</p>
            </div>
            
            <div 
              className="stat-card cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleStatClick("total")}
            >
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-habit-purple mr-2" />
                <h3 className="text-sm font-medium">Total</h3>
              </div>
              <p className="text-2xl font-bold">{stats.totalPoints}</p>
              <p className="text-xs text-muted-foreground">All-time points</p>
            </div>
            
            <div 
              className="stat-card cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleStatClick("streak")}
            >
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-primary mr-2" />
                <h3 className="text-sm font-medium">Streak</h3>
              </div>
              <p className="text-2xl font-bold">{stats.streakDays}</p>
              <p className="text-xs text-muted-foreground">Consecutive days</p>
            </div>
            
            <div 
              className="stat-card cursor-pointer hover:bg-accent/10 transition-colors"
              onClick={() => handleStatClick("completed")}
            >
              <div className="flex items-center mb-2">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <h3 className="text-sm font-medium">Completed</h3>
              </div>
              <p className="text-2xl font-bold">{stats.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks finished</p>
            </div>
            
            {stats.topTask && (
              <div 
                className="col-span-2 md:col-span-4 stat-card cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => handleStatClick("leaderboard")}
              >
                <div className="flex items-center mb-2">
                  <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                  <h3 className="text-sm font-medium">Leaderboard Position</h3>
                </div>
                <p className="text-lg font-medium flex items-center">
                  Check your ranking among other users
                  <Activity className="ml-2 h-4 w-4 text-primary" />
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              {activeDetail === "daily" && <Star className="h-5 w-5" />}
              {activeDetail === "total" && <TrendingUp className="h-5 w-5" />}
              {activeDetail === "streak" && <Calendar className="h-5 w-5" />}
              {activeDetail === "completed" && <Check className="h-5 w-5" />}
              {activeDetail === "leaderboard" && <Trophy className="h-5 w-5" />}
              {activeDetail === "" && <Star className="h-5 w-5" />}
              
              {activeDetail === "daily" && "Today's Points"}
              {activeDetail === "total" && "Total Points"}
              {activeDetail === "streak" && "Your Streak"}
              {activeDetail === "completed" && "Completed Tasks"}
              {activeDetail === "leaderboard" && "Leaderboard"}
              {activeDetail === "" && "Your Achievements"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Daily Points Detail */}
            {(activeDetail === "daily" || activeDetail === "") && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Today's Points Breakdown</h3>
                {todayCompletedTasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayCompletedTasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell className="text-right">{task.points}</TableCell>
                        </TableRow>
                      ))}
                      {/* Check if there are any streak bonuses for today */}
                      {pointHistory
                        .filter(record => {
                          const recordDate = new Date(record.date);
                          const today = new Date();
                          return (
                            recordDate.getDate() === today.getDate() &&
                            recordDate.getMonth() === today.getMonth() &&
                            recordDate.getFullYear() === today.getFullYear() &&
                            record.source === "Daily Streak Bonus"
                          );
                        })
                        .map(record => (
                          <TableRow key={record.id}>
                            <TableCell>Daily Streak Bonus</TableCell>
                            <TableCell className="text-right">{record.amount}</TableCell>
                          </TableRow>
                        ))
                      }
                      <TableRow>
                        <TableCell className="font-bold">Total</TableCell>
                        <TableCell className="text-right font-bold">{stats.dailyPoints}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No completed quests today</p>
                )}
              </div>
            )}
            
            {/* Total Points Detail */}
            {(activeDetail === "total" || activeDetail === "") && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Points Summary</h3>
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt>Daily Points:</dt>
                        <dd className="font-medium">{stats.dailyPoints}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Total Earned:</dt>
                        <dd className="font-medium">{stats.totalPoints}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Points Spent:</dt>
                        <dd className="font-medium">{stats.pointsSpent}</dd>
                      </div>
                      <div className="flex justify-between border-t pt-2 mt-2">
                        <dt>Available Balance:</dt>
                        <dd className="font-bold">{stats.pointsAvailable}</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Streak Detail */}
            {(activeDetail === "streak" || activeDetail === "") && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Streak Details</h3>
                <Card>
                  <CardContent className="pt-6">
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt>Current Streak:</dt>
                        <dd className="font-medium">{stats.streakDays} days</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Streak Bonus:</dt>
                        <dd className="font-medium">+{Math.min(10, stats.streakDays)} points daily</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Next Streak Milestone:</dt>
                        <dd className="font-medium">{Math.ceil(stats.streakDays / 5) * 5} days</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Milestone Bonus:</dt>
                        <dd className="font-medium">+{Math.ceil(stats.streakDays / 5) * 5} points</dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Completed Tasks Detail */}
            {(activeDetail === "completed" || activeDetail === "") && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Completed Tasks</h3>
                {completedTasks.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedTasks.slice(0, 10).map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>{task.category}</TableCell>
                          <TableCell className="text-right">{task.points}</TableCell>
                        </TableRow>
                      ))}
                      {completedTasks.length > 10 && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                            And {completedTasks.length - 10} more tasks...
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No completed tasks yet</p>
                )}
              </div>
            )}
            
            {/* Leaderboard Detail */}
            {(activeDetail === "leaderboard" || activeDetail === "") && (
              <div>
                <h3 className="font-semibold mb-2 text-lg">Current Leaderboard</h3>
                {leaderboardUsers.length > 0 ? (
                  <div className="space-y-4">
                    {leaderboardUsers.map((user, index) => (
                      <div key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{user.username || 'Anonymous'}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            <span>{user.total_points} points</span>
                            <span className="mx-2">•</span>
                            <span>{user.streak_days} day streak</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">Loading leaderboard data...</p>
                )}
                
                <Button 
                  className="w-full mt-4" 
                  onClick={handleViewFullLeaderboard}
                >
                  View Full Leaderboard
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StatsCard;

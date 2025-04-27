
import React, { useState, useEffect } from 'react';
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Award, Star, Trophy, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type LeaderboardPeriod = "daily" | "weekly" | "monthly" | "allTime";

interface LeaderboardUser {
  id: string;
  username: string;
  avatar_url: string | null;
  total_points: number;
  streak_days: number;
}

const LeaderboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [period, setPeriod] = useState<LeaderboardPeriod>("daily");

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      
      try {
        let query = supabase
          .from('profiles')
          .select('id, username, avatar_url, total_points, streak_days')
          .order('total_points', { ascending: false })
          .limit(10);
        
        // In a real implementation, we would filter by time period
        // For example, for daily leaderboard, we'd join with points_history
        // and sum points earned today. But for now, we'll use total_points.
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setLeaderboardData(data);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [period]);

  return (
    <PageContainer>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full" onValueChange={(value) => setPeriod(value as LeaderboardPeriod)}>
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="daily">Today</TabsTrigger>
              <TabsTrigger value="weekly">This Week</TabsTrigger>
              <TabsTrigger value="monthly">This Month</TabsTrigger>
              <TabsTrigger value="allTime">All Time</TabsTrigger>
            </TabsList>
            
            {["daily", "weekly", "monthly", "allTime"].map((tabValue) => (
              <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                <div className="bg-accent/20 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    {tabValue === "daily" && "Today's Top Achievers"}
                    {tabValue === "weekly" && "This Week's Champions"}
                    {tabValue === "monthly" && "Monthly Masters"}
                    {tabValue === "allTime" && "All-Time Legends"}
                  </h3>
                  
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[120px]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {leaderboardData.map((user, index) => (
                        <li key={user.id} className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border">
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
                          <div>
                            {index === 0 && <Trophy className="h-6 w-6 text-yellow-400" />}
                            {index === 1 && <Award className="h-6 w-6 text-gray-300" />}
                            {index === 2 && <Award className="h-6 w-6 text-amber-600" />}
                          </div>
                        </li>
                      ))}
                      
                      {leaderboardData.length === 0 && (
                        <div className="text-center py-8">
                          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No data available for this period</p>
                        </div>
                      )}
                    </ul>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default LeaderboardPage;

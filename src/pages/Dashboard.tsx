
import React, { useState, useEffect } from 'react';
import { usePoints } from "@/contexts/points";
import PageContainer from "@/components/layout/PageContainer";
import TaskList from "@/components/tasks/TaskList";
import RewardList from "@/components/rewards/RewardList";
import DynamicRewards from "@/components/rewards/DynamicRewards";
import StatsCard from "@/components/stats/StatsCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalGambit from "@/components/features/PersonalGambit";
import SkillEvolution from "@/components/features/SkillEvolution";
import ComboChain from "@/components/features/ComboChain";
import TimeFlux from "@/components/features/TimeFlux";
import MomentumEngine from "@/components/features/MomentumEngine";
import GameList from "@/components/games/GameList";
import SocialTracker from "@/components/social/SocialTracker";
import FoodMenu from "@/components/food/FoodMenu";
import QuizWidget from "@/components/quiz/QuizWidget";
import HabitForecast from "@/components/analytics/HabitForecast";
import { Trophy, Users, Star, Calendar, Brain, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import JournalEntry from '@/components/journal/JournalEntry';
import JournalHistory from '@/components/journal/JournalHistory';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { tasks, rewards, stats, completeTask, redeemReward, addTask } = usePoints();
  const { toast } = useToast();
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [dynamicQuests, setDynamicQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const activeTasks = tasks.filter(task => !task.completed);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url, total_points, streak_days')
          .order('total_points', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setTopUsers(data || []);
        
        // Generate dynamic quests based on time of day
        generateDynamicQuests();
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, []);
  
  const generateDynamicQuests = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const quests = [];
    
    // Morning quests
    if (hour < 12) {
      quests.push({
        id: `morning-${Date.now()}`,
        title: "Complete morning routine",
        points: 10,
        category: "morning"
      });
      quests.push({
        id: `hydrate-${Date.now()}`,
        title: "Drink water first thing in the morning",
        points: 5,
        category: "health"
      });
      quests.push({
        id: `meditation-${Date.now()}`,
        title: "Morning meditation (5 minutes)",
        points: 8,
        category: "health"
      });
      quests.push({
        id: `journal-${Date.now()}`,
        title: "Write your daily intentions",
        points: 7,
        category: "personal"
      });
    }
    
    // Afternoon quests
    if (hour >= 12 && hour < 17) {
      quests.push({
        id: `walk-${Date.now()}`,
        title: "Take a 10-minute walk break",
        points: 8,
        category: "health"
      });
      quests.push({
        id: `focus-${Date.now()}`,
        title: "Complete a focused work session",
        points: 15,
        category: "work"
      });
      quests.push({
        id: `posture-${Date.now()}`,
        title: "Check and correct your posture",
        points: 5,
        category: "health"
      });
      quests.push({
        id: `stretch-${Date.now()}`,
        title: "Do a quick desk stretching routine",
        points: 7,
        category: "health"
      });
    }
    
    // Evening quests
    if (hour >= 17) {
      quests.push({
        id: `reflect-${Date.now()}`,
        title: "Reflect on today's achievements",
        points: 7,
        category: "personal"
      });
      quests.push({
        id: `plan-${Date.now()}`,
        title: "Plan tomorrow's priorities",
        points: 6,
        category: "personal"
      });
      quests.push({
        id: `screen-${Date.now()}`,
        title: "No screens 1 hour before bed",
        points: 12,
        category: "health"
      });
      quests.push({
        id: `reading-${Date.now()}`,
        title: "Read for 15 minutes before sleep",
        points: 10,
        category: "personal"
      });
    }
    
    // Weekend special quests
    if (day === 0 || day === 6) {
      quests.push({
        id: `hobby-${Date.now()}`,
        title: "Spend time on a hobby",
        points: 12,
        category: "personal"
      });
      quests.push({
        id: `digital-${Date.now()}`,
        title: "Digital declutter for 30 minutes",
        points: 15,
        category: "personal"
      });
      quests.push({
        id: `outdoors-${Date.now()}`,
        title: "Spend 30+ minutes outdoors",
        points: 18,
        category: "health"
      });
    } else {
      // Weekday quests
      quests.push({
        id: `productive-${Date.now()}`,
        title: "Complete most important task of the day",
        points: 20,
        category: "work"
      });
      quests.push({
        id: `email-${Date.now()}`,
        title: "Process inbox to zero",
        points: 10,
        category: "work"
      });
      quests.push({
        id: `learn-${Date.now()}`,
        title: "Learn something new (15+ minutes)",
        points: 12,
        category: "personal"
      });
    }
    
    // Health quests for any day
    quests.push({
      id: `water-${Date.now()}`,
      title: "Drink 8 glasses of water today",
      points: 10,
      category: "health"
    });
    quests.push({
      id: `exercise-${Date.now()}`,
      title: "Exercise for 20+ minutes",
      points: 15,
      category: "health"
    });
    quests.push({
      id: `mindful-${Date.now()}`,
      title: "Practice mindfulness for 10 minutes",
      points: 12,
      category: "personal"
    });
    
    setDynamicQuests(quests);
  };
  
  const handleAddDynamicQuest = (quest: any) => {
    addTask(quest.title, quest.points, quest.category);
    toast({
      title: "Quest Added",
      description: `${quest.title} has been added to your tasks.`,
    });
  };

  const handleViewFullLeaderboard = () => {
    navigate("/leaderboard");
  };

  return (
    <PageContainer>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-6"
      >
        <StatsCard stats={stats} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="grid gap-6">
              <TaskList 
                tasks={activeTasks}
                title="Today's Quests"
                onCompleteTask={completeTask}
              />
              
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Daily Dynamic Quests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {dynamicQuests.slice(0, 6).map((quest, index) => (
                        <motion.div 
                          key={quest.id} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/5"
                        >
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span>{quest.title}</span>
                            <span className="text-sm text-muted-foreground">+{quest.points} pts</span>
                          </div>
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleAddDynamicQuest(quest)}
                            >
                              Add
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RewardList 
              rewards={rewards}
              availablePoints={stats.pointsAvailable}
              onRedeemReward={redeemReward}
            />
            
            <Card className="h-full">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-4">Loading...</div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {topUsers.map((user, index) => (
                        <motion.div 
                          key={user.id} 
                          className="flex items-center gap-3 p-3 border rounded-md"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold ${index === 0 ? "animate-pulse" : ""}`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{user.username || 'Anonymous'}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Star className="h-3 w-3 mr-1 text-yellow-400" />
                              <span>{user.total_points} pts</span>
                              <span className="mx-1">•</span>
                              <span>{user.streak_days}d streak</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={handleViewFullLeaderboard}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Full Leaderboard
                      </Button>
                    </motion.div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <QuizWidget />
          <HabitForecast />
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DynamicRewards />
          <GameList />
          <SocialTracker />
        </motion.div>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Tabs defaultValue="timeflux" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="timeflux">TimeFlux</TabsTrigger>
              <TabsTrigger value="momentum">Momentum Engine</TabsTrigger>
              <TabsTrigger value="skills">Skill Evolution</TabsTrigger>
              <TabsTrigger value="gambit">Personal Gambit</TabsTrigger>
              <TabsTrigger value="combo">Combo Chain</TabsTrigger>
            </TabsList>
            <TabsContent value="gambit" className="mt-0">
              <PersonalGambit />
            </TabsContent>
            <TabsContent value="skills" className="mt-0">
              <SkillEvolution />
            </TabsContent>
            <TabsContent value="combo" className="mt-0">
              <ComboChain />
            </TabsContent>
            <TabsContent value="timeflux" className="mt-0">
              <TimeFlux />
            </TabsContent>
            <TabsContent value="momentum" className="mt-0">
              <MomentumEngine />
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <FoodMenu />
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <JournalEntry />
          <JournalHistory />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;

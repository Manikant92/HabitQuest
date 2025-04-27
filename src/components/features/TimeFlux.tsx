
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Activity, Plus, Check, AlertCircle } from "lucide-react";
import { usePoints } from "@/contexts/points";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

const TimeFlux = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeZone, setTimeZone] = useState<string>("");
  const [userLevel, setUserLevel] = useState<number>(1);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [trackedSessions, setTrackedSessions] = useState<Record<string, boolean>>({
    Morning: false,
    Afternoon: false,
    Evening: false,
    Night: false
  });
  const { stats, addTask } = usePoints();
  const { toast } = useToast();
  
  useEffect(() => {
    // Update the current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Get user's timezone
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Fetch user level from database
    const fetchUserLevel = async () => {
      try {
        const { data: authData } = await supabase.auth.getSession();
        if (authData.session) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('level')
            .eq('id', authData.session.user.id)
            .single();
          
          if (profileData && profileData.level) {
            setUserLevel(profileData.level);
          }
          
          // Fetch already tracked sessions for today
          const today = new Date();
          const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
          
          const { data: sessions } = await supabase
            .from('points_history')
            .select('description')
            .eq('user_id', authData.session.user.id)
            .gte('created_at', startOfDay)
            .ilike('description', '%Study Session%');
            
          if (sessions && sessions.length > 0) {
            const tracked: Record<string, boolean> = {...trackedSessions};
            sessions.forEach(session => {
              const timeframe = session.description.split(' ')[0]; // Extract timeframe from "Morning Study Session"
              if (timeframe && tracked.hasOwnProperty(timeframe)) {
                tracked[timeframe] = true;
              }
            });
            setTrackedSessions(tracked);
          }
        }
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };
    
    fetchUserLevel();
    
    return () => clearInterval(timer);
  }, []);
  
  const getHour = () => currentTime.getHours();
  
  const getStudyPoints = (timeframe: string) => {
    // Increase points based on user level
    const levelMultiplier = 1 + (userLevel * 0.1);
    
    switch (timeframe) {
      case 'Morning': return Math.round(6 * levelMultiplier); // Morning
      case 'Afternoon': return Math.round(4 * levelMultiplier); // Afternoon
      case 'Night': return Math.round(2 * levelMultiplier); // Late night
      default: return Math.round(3 * levelMultiplier); // Default
    }
  };
  
  const getEntertainmentCost = () => {
    const hour = getHour();
    // Decrease cost as user levels up (small advantage)
    const levelDiscount = Math.min(0.2, userLevel * 0.04);
    
    if (hour >= 20 || hour < 8) {
      return Math.round(15 * (1 - levelDiscount)); // Evening/night
    }
    return Math.round(10 * (1 - levelDiscount)); // Day
  };
  
  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const trackStudySession = (timeframe: string) => {
    setShowConfirm(null);
    const points = getStudyPoints(timeframe);
    addTask(`${timeframe} Study Session`, points, "personal");
    
    // Update tracked sessions
    setTrackedSessions(prev => ({
      ...prev,
      [timeframe]: true
    }));
    
    // Log to database
    const logSessionToDb = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user) {
          await supabase.from('points_history').insert({
            amount: points,
            description: `${timeframe} Study Session`,
            type: 'earned',
            user_id: userData.user.id
          });
        }
      } catch (error) {
        console.error("Error logging session:", error);
      }
    };
    
    logSessionToDb();
    
    toast({
      title: "Study Session Tracked",
      description: `Earned ${points} points for studying during ${timeframe}.`,
    });
  };
  
  const getCurrentTimeframe = () => {
    const hour = getHour();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 22) return "Evening";
    return "Night";
  };

  const getTimeframeEfficiency = (timeframe: string) => {
    switch (timeframe) {
      case 'Morning': return 90;
      case 'Afternoon': return 70;
      case 'Evening': return 65;
      case 'Night': return 40;
    }
    return 50;
  };

  return (
    <Card className="pixel-card h-full overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Clock className="h-5 w-5" />
          TIMEFLUX SYSTEM <span className="ml-1 px-1.5 py-0.5 bg-primary/10 rounded text-sm">LEVEL {userLevel}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        <div className="flex justify-between items-center">
          <div className="text-sm opacity-80">
            Current timeframe: <span className="font-medium">{getCurrentTimeframe()}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-primary font-mono text-xl">
              {formatTime()}
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="text-primary font-mono border-b border-primary/30 pb-1">FOCUS EFFICIENCY ZONES</h3>
            
            {['Morning', 'Afternoon', 'Evening', 'Night'].map((timeframe) => (
              <motion.div
                key={timeframe}
                className="space-y-1.5"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between text-sm">
                  <span>{timeframe}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{getStudyPoints(timeframe)} pts</span>
                    <div className="w-16 flex justify-end">
                      {trackedSessions[timeframe] ? (
                        <span className="flex items-center text-green-500 text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Tracked
                        </span>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 px-2 bg-primary/5 hover:bg-primary/20"
                          onClick={() => setShowConfirm(timeframe)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Track
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress value={getTimeframeEfficiency(timeframe)} className="h-2" />
                  {getCurrentTimeframe() === timeframe && (
                    <motion.div 
                      className="absolute top-0 h-2 w-1.5 bg-primary rounded"
                      animate={{ x: ["-3px", "3px", "-3px"] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                  )}
                </div>
                
                <AnimatePresence>
                  {showConfirm === timeframe && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-end gap-2 overflow-hidden"
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowConfirm(null)}
                        className="h-7 px-2"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={() => trackStudySession(timeframe)}
                        className="h-7 px-2"
                      >
                        Confirm
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <div className="border-t border-primary/30 pt-4 space-y-3">
            <h3 className="text-primary font-mono border-b border-primary/30 pb-1">LEISURE DYNAMICS</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Digital content before 8 PM</span>
                <span className="font-mono">{getEntertainmentCost()} pts</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Digital content after 8 PM</span>
                <span className="font-mono">{Math.round(5 * (1 - Math.min(0.1, userLevel * 0.001)))} pts</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Gaming progression</span>
                <span className="font-mono">+{Math.round(2 + (userLevel * 0.2))} pts/hr</span>
              </div>
              
              <motion.div
                whileHover={{ y: -2 }}
                className="bg-primary/10 p-3 rounded-lg mt-2"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-primary mt-0.5" />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">Level {userLevel} Status</p>
                    <p className="text-muted-foreground">
                      You've earned a {Math.round(userLevel * 4)}% efficiency bonus and  
                      {Math.round(Math.min(0.2, userLevel * 0.04) * 100)}%  leisure discount
                    </p>
                    <div className="mt-1.5">
                      <div className="text-xs text-muted-foreground mb-1">
                        Progress to Level {userLevel + 1}:
                      </div>
                      <Progress 
                        value={stats.totalPoints % 100} 
                        className="h-1.5" 
                      />
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {stats.totalPoints % 100}/100
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeFlux;


import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Plus, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/points";
import { supabase } from "@/integrations/supabase/client";

interface MomentumTracker {
  name: string;
  current: number;
  goal: number;
  pointsPerUnit: number[];
  completionBonus: number;
}

const MomentumEngine = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [trackers, setTrackers] = useState<MomentumTracker[]>([
    { 
      name: "study",
      current: 0,
      goal: 4,
      pointsPerUnit: [4, 5, 7, 10],
      completionBonus: 5
    },
    { 
      name: "training",
      current: 0,
      goal: 3,
      pointsPerUnit: [5, 7, 10],
      completionBonus: 15
    },
  ]);
  
  const { toast } = useToast();
  const { addTask } = usePoints();

  useEffect(() => {
    // Fetch user level and progress from database
    const fetchUserData = async () => {
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
            
            // Adjust goals based on user level
            setTrackers(prev => prev.map(tracker => ({
              ...tracker,
              goal: tracker.goal + Math.floor(profileData.level / 3),
              pointsPerUnit: tracker.pointsPerUnit.map(points => 
                Math.round(points * (1 + (profileData.level * 0.05)))
              ),
              completionBonus: Math.round(tracker.completionBonus * (1 + (profileData.level * 0.1)))
            })));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
    fetchUserData();
  }, []);
  
  const getTrackerTotal = (tracker: MomentumTracker) => {
    return tracker.pointsPerUnit.slice(0, tracker.current).reduce((a, b) => a + b, 0);
  };
  
  const getTrackerPercent = (tracker: MomentumTracker) => {
    return (tracker.current / tracker.goal) * 100;
  };
  
  const updateProgress = async (trackerIndex: number, changeAmount: number) => {
    setTrackers(prev => {
      const updatedTrackers = [...prev];
      const tracker = { ...updatedTrackers[trackerIndex] };
      
      // Ensure we don't go below 0 or above goal
      const newValue = Math.max(0, Math.min(tracker.goal, tracker.current + changeAmount));
      
      // Check if reaching goal for the first time
      const reachedGoal = tracker.current < tracker.goal && newValue >= tracker.goal;
      
      tracker.current = newValue;
      updatedTrackers[trackerIndex] = tracker;
      
      // Handle goal completion
      if (reachedGoal) {
        // Add bonus points
        addTask(`${tracker.name.charAt(0).toUpperCase() + tracker.name.slice(1)} Goal Completed`, 
          tracker.completionBonus, "personal");
        
        toast({
          title: `${tracker.name.charAt(0).toUpperCase() + tracker.name.slice(1)} Goal Completed!`,
          description: `You earned a ${tracker.completionBonus} point bonus!`,
        });
      } else if (changeAmount > 0) {
        // Add points for incremental progress
        const pointsForThisUnit = tracker.pointsPerUnit[tracker.current - 1];
        addTask(`${tracker.name.charAt(0).toUpperCase() + tracker.name.slice(1)} Progress`, 
          pointsForThisUnit, "personal");
        
        toast({
          title: `${tracker.name.charAt(0).toUpperCase() + tracker.name.slice(1)} Progress!`,
          description: `You earned ${pointsForThisUnit} points!`,
        });
      }
      
      return updatedTrackers;
    });
  };

  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Target className="h-5 w-5" />
          MOMENTUM ENGINE (LEVEL {userLevel})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Rewards amplify as you advance:
        </div>
        
        <div className="space-y-6">
          {trackers.map((tracker, index) => (
            <div key={tracker.name} className="space-y-3">
              <h3 className="text-primary font-mono">
                {tracker.name.toUpperCase()} MOMENTUM ({tracker.current}/{tracker.goal} UNITS):
              </h3>
              <Progress value={getTrackerPercent(tracker)} className="h-2 bg-muted" />
              <div className="grid grid-cols-6 gap-1 text-center text-sm">
                {tracker.pointsPerUnit.map((points, i) => (
                  <div 
                    key={i} 
                    className={`p-1 rounded ${i < tracker.current ? 'bg-primary/20 text-primary' : ''} ${i >= tracker.goal ? 'hidden' : ''}`}
                  >
                    {points}p
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span>Current: {getTrackerTotal(tracker)} points</span>
                  {tracker.current >= tracker.goal && (
                    <span className="ml-2 text-primary">+{tracker.completionBonus} bonus!</span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateProgress(index, 1)}
                    className="h-8 w-8"
                    disabled={tracker.current >= tracker.goal}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateProgress(index, -1)}
                    className="h-8 w-8"
                    disabled={tracker.current <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="border-t border-primary/30 pt-4 space-y-1">
            <p className="text-primary font-mono">MOMENTUM SCALING:</p>
            <p className="text-sm">Level {userLevel} bonus: +{Math.round(userLevel * 5)}% points on completion</p>
            <p className="text-sm">Next level unlocks at {userLevel * 100 + 100} total points</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MomentumEngine;

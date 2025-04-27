
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Trophy, Gift, Sparkles, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/points";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const DynamicRewards = () => {
  const [rewards, setRewards] = useState([
    {
      id: "daily-momentum-1",
      title: "Daily Focus Boost",
      description: "50% extra points on your next 3 tasks",
      cost: 15,
      category: "productivity",
      cooldownUntil: null as number | null
    },
    {
      id: "skill-boost-1",
      title: "Learning Accelerator",
      description: "Double learning points for 2 hours",
      cost: 25,
      category: "personal-growth",
      cooldownUntil: null as number | null
    },
    {
      id: "wellness-reward-1",
      title: "Mindfulness Package",
      description: "Unlock meditation and relaxation resources",
      cost: 30,
      category: "wellness",
      cooldownUntil: null as number | null
    },
    {
      id: "social-reward-1",
      title: "Connection Credit",
      description: "Bonus social interaction points",
      cost: 20,
      category: "social",
      cooldownUntil: null as number | null
    },
    {
      id: "creative-spark-1",
      title: "Creative Inspiration",
      description: "Unlock special creative challenges",
      cost: 35,
      category: "creativity",
      cooldownUntil: null as number | null
    },
    {
      id: "adventure-pass-1",
      title: "Adventure Pass",
      description: "Access to special outdoor activities",
      cost: 40,
      category: "adventure",
      cooldownUntil: null as number | null
    },
    {
      id: "knowledge-key-1",
      title: "Knowledge Key",
      description: "Access to premium learning resources",
      cost: 45,
      category: "education",
      cooldownUntil: null as number | null
    },
    {
      id: "time-token-1",
      title: "Time Token",
      description: "Extended deadline on one task",
      cost: 30,
      category: "time-management",
      cooldownUntil: null as number | null
    }
  ]);

  const { redeemReward, stats } = usePoints();
  const { toast } = useToast();
  
  // Load cooldown times from localStorage when component mounts
  useEffect(() => {
    const savedCooldowns = localStorage.getItem('dynamicRewardsCooldowns');
    if (savedCooldowns) {
      try {
        const parsedCooldowns = JSON.parse(savedCooldowns);
        setRewards(rewards.map(reward => {
          if (parsedCooldowns[reward.id]) {
            return {
              ...reward,
              cooldownUntil: parsedCooldowns[reward.id]
            };
          }
          return reward;
        }));
      } catch (error) {
        console.error('Error loading cooldowns:', error);
      }
    }
  }, []);

  // Add an effect to update cooldowns every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setRewards(prevRewards => [...prevRewards]); // Force re-render to update cooldowns
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Helper function to check if a reward is on cooldown
  const isOnCooldown = (reward: any): boolean => {
    if (!reward.cooldownUntil) return false;
    return Date.now() < reward.cooldownUntil;
  };
  
  // Helper function to format remaining cooldown time
  const formatCooldownTime = (cooldownUntil: number): string => {
    const remainingMs = cooldownUntil - Date.now();
    const minutes = Math.floor(remainingMs / (1000 * 60));
    
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    
    return `${minutes}m`;
  };

  const handleRedeemReward = async (reward: any) => {
    if (stats.pointsAvailable < reward.cost) {
      toast({
        title: "Not Enough Points",
        description: `You need ${reward.cost - stats.pointsAvailable} more points.`,
        variant: "destructive"
      });
      return;
    }
    
    if (isOnCooldown(reward)) {
      toast({
        title: "On Cooldown",
        description: `This reward will be available again in ${formatCooldownTime(reward.cooldownUntil as number)}.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Log the points spent in points_history
        const { error: pointsError } = await supabase
          .from('points_history')
          .insert({
            user_id: user.id,
            amount: reward.cost,
            type: 'spent',
            description: `Redeemed ${reward.title}`
          });

        if (pointsError) throw pointsError;

        // Update the user's profile total points
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            total_points: stats.totalPoints - reward.cost 
          })
          .eq('id', user.id);

        if (profileError) throw profileError;

        // Apply cooldown (1 hour = 3600000 ms)
        const cooldownUntil = Date.now() + 3600000;
        
        // Update local state
        setRewards(rewards.map(r => 
          r.id === reward.id ? { ...r, cooldownUntil } : r
        ));
        
        // Save cooldowns to localStorage
        const savedCooldowns = localStorage.getItem('dynamicRewardsCooldowns');
        const cooldowns = savedCooldowns ? JSON.parse(savedCooldowns) : {};
        cooldowns[reward.id] = cooldownUntil;
        localStorage.setItem('dynamicRewardsCooldowns', JSON.stringify(cooldowns));

        redeemReward(reward.id);
        
        toast({
          title: "Reward Unlocked!",
          description: `You've redeemed ${reward.title} for ${reward.cost} points. This reward will be on cooldown for 1 hour.`
        });
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Error",
        description: "Failed to redeem reward. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Dynamic Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4 hover:bg-accent/10 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{reward.title}</h3>
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                  </div>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 mr-1" fill="currentColor" />
                    {reward.cost}
                  </div>
                </div>
                {isOnCooldown(reward) ? (
                  <div className="w-full mt-3 flex items-center justify-center p-2 bg-muted/50 text-muted-foreground rounded-md text-sm">
                    <Clock className="h-3 w-3 mr-1" />
                    Available in {formatCooldownTime(reward.cooldownUntil as number)}
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => handleRedeemReward(reward)}
                    disabled={stats.pointsAvailable < reward.cost}
                  >
                    Redeem
                  </Button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicRewards;

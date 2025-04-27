
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Plus, Minus, Trophy, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/points";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Skill {
  name: string;
  level: number;
  progress: number;
  description: string;
  lastActivity: string;
  decayRate: number;
}

const SkillEvolution = () => {
  const [skills, setSkills] = useState<Skill[]>([
    { 
      name: "Endurance", 
      level: 3, 
      progress: 30,
      description: "Your physical stamina and ability to persist through challenges",
      lastActivity: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      decayRate: 5
    },
    { 
      name: "Focus", 
      level: 2, 
      progress: 70,
      description: "Your ability to concentrate deeply on tasks without distraction",
      lastActivity: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      decayRate: 8
    },
    { 
      name: "Strength", 
      level: 4, 
      progress: 10,
      description: "Your physical power and muscular capability",
      lastActivity: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      decayRate: 7
    },
  ]);
  const { toast } = useToast();
  const { addTask } = usePoints();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to fetch user skills from database
    const fetchSkills = async () => {
      try {
        const { data: authData } = await supabase.auth.getSession();
        if (authData.session) {
          // This would require a skills table in a real implementation
          console.log("Would fetch user skills here");
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };
    
    fetchSkills();
    
    // Apply skill decay based on last activity date
    const decaySkills = () => {
      const now = new Date();
      setSkills(prevSkills => 
        prevSkills.map(skill => {
          const lastActivity = new Date(skill.lastActivity);
          const daysSinceActivity = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
          
          // Apply decay for inactivity beyond 3 days
          if (daysSinceActivity > 3) {
            const daysToDecay = daysSinceActivity - 3;
            const decayAmount = daysToDecay * skill.decayRate;
            
            return {
              ...skill,
              progress: Math.max(0, skill.progress - decayAmount)
            };
          }
          
          return skill;
        })
      );
    };
    
    // Check for decay on mount
    decaySkills();
  }, []);

  const getRequirements = (level: number, skillName: string) => {
    switch (skillName.toLowerCase()) {
      case "endurance":
        return {
          "push-ups": 10 + (level * 2),
          "walking minutes": 10 + (level * 3),
        };
      case "focus":
        return {
          "focus minutes": 15 + (level * 5),
        };
      case "strength":
        return {
          "push-ups": 15 + (level * 3),
          "squats": 20 + (level * 2),
        };
      default:
        return {
          "training sessions": 10 + (level * 2),
        };
    }
  };
  
  const updateProgress = async (skillIndex: number, changeAmount: number) => {
    // Update local state
    setSkills(prevSkills => {
      const updatedSkills = [...prevSkills];
      const skill = { ...updatedSkills[skillIndex] };
      
      // Update progress
      skill.progress += changeAmount;
      
      // Check for level up
      if (skill.progress >= 100) {
        skill.level += 1;
        skill.progress = 0;
        
        // Show level up toast
        toast({
          title: `${skill.name} Level Up!`,
          description: `Your ${skill.name.toLowerCase()} is now level ${skill.level}. New challenges await!`,
        });
        
        // Add points for leveling up
        addTask(`${skill.name} Level Up`, skill.level * 5, "personal");
        
        // Log to database
        const logLevelUpToDb = async () => {
          try {
            const { data: userData } = await supabase.auth.getUser();
            if (userData?.user) {
              await supabase.from('points_history').insert({
                amount: skill.level * 5,
                description: `${skill.name} Level Up`,
                type: 'earned',
                user_id: userData.user.id
              });
            }
          } catch (error) {
            console.error("Error logging level up:", error);
          }
        };
        
        logLevelUpToDb();
      }
      
      // Check for progress loss (negative)
      if (skill.progress < 0) {
        skill.progress = 0;
        
        toast({
          title: `${skill.name} Progress Reset`,
          description: `You've reset your progress for this skill.`,
          variant: "destructive"
        });
      }
      
      // Update last activity date when making positive progress
      if (changeAmount > 0) {
        skill.lastActivity = new Date().toISOString();
      }
      
      updatedSkills[skillIndex] = skill;
      return updatedSkills;
    });
    
    // In a real app, we would update this in the database
    try {
      // This is a simulated database update
      console.log("Updating skill in database:", skillIndex, changeAmount);
      
      // In a full implementation, this would save to the database:
      // await supabase.from('user_skills').upsert({...})
    } catch (error) {
      console.error("Error updating skill:", error);
    }
  };

  // Calculate days since last activity
  const getDaysSinceActivity = (lastActivityDate: string) => {
    const lastActivity = new Date(lastActivityDate);
    const now = new Date();
    return Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="pixel-card h-full">
        <CardHeader className="bg-primary/5">
          <CardTitle className="flex items-center gap-2 text-primary">
            <TrendingUp className="h-5 w-5" />
            SKILL EVOLUTION SYSTEM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-5">
          <div className="text-sm text-muted-foreground mb-2">
            Skill difficulty scales with your growth level
          </div>
          
          <div className="space-y-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-end">
                  <motion.button
                    onClick={() => setSelectedSkill(selectedSkill === skill.name ? null : skill.name)}
                    className="text-left focus:outline-none"
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="text-primary font-mono flex gap-1.5 items-center">
                      {skill.name.toUpperCase()} 
                      <span className="px-1.5 py-0.5 bg-primary/10 rounded text-sm">
                        LVL {skill.level}
                      </span>
                      {getDaysSinceActivity(skill.lastActivity) > 3 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Skill is decaying due to inactivity</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </h3>
                  </motion.button>
                  <span className="text-xs font-mono opacity-70">
                    {skill.progress}/100
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {skill.description}
                  </p>
                  <div className="relative">
                    <Progress value={skill.progress} className="h-2.5 bg-muted" />
                    <motion.div
                      className={`absolute left-0 top-0 h-2.5 bg-primary rounded-full ${skill.progress >= 90 ? 'animate-pulse' : ''}`}
                      style={{ width: `${Math.min(skill.progress, 100)}%` }}
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-muted-foreground mt-1">
                      Last activity: {getDaysSinceActivity(skill.lastActivity)} days ago
                    </div>
                    <div className="flex space-x-2">
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => updateProgress(index, 10)}
                          className="h-8 w-8 bg-primary/5 hover:bg-primary/20"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => updateProgress(index, -10)}
                          className="h-8 w-8"
                          disabled={skill.progress < 10}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {selectedSkill === skill.name && (
                    <motion.div 
                      className="grid grid-cols-2 gap-2 bg-background rounded-md p-2 border mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {Object.entries(getRequirements(skill.level, skill.name)).map(([key, value]) => (
                        <div key={key} className="bg-primary/5 p-2 rounded-md">
                          <div className="text-xs font-medium text-primary">
                            {key}:
                          </div>
                          <div className="text-sm">
                            {value}
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="border-t border-primary/30 pt-4 space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-start gap-2">
              <Trophy className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-primary font-mono mb-1">SKILL MAINTENANCE:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                    <span>Skills decay after 3+ days of inactivity</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                    <span>Regular practice maintains and improves your abilities</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                    <span>Higher levels require more consistent training</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default SkillEvolution;

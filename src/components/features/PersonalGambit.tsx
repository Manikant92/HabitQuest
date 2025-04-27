
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Check, Target } from "lucide-react";
import { usePoints } from "@/contexts/points";
import { toast } from "@/hooks/use-toast";

interface PersonalGambit {
  goal: string;
  difficulty: string;
  preferredActivities: string[];
}

const PersonalGambit = () => {
  const [step, setStep] = useState(1);
  const [personalGambit, setPersonalGambit] = useState<PersonalGambit>({
    goal: "",
    difficulty: "medium",
    preferredActivities: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  const { addTask } = usePoints();
  
  const handleNext = () => {
    if (step === 1 && !personalGambit.goal) {
      toast({
        title: "Goal Required",
        description: "Please define your goal before proceeding",
        variant: "destructive"
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
      generatePersonalTasks();
    }
  };
  
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const updatePersonalGambit = (field: keyof PersonalGambit, value: any) => {
    setPersonalGambit(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const generatePersonalTasks = () => {
    // Generate personalized tasks based on user preferences
    const activities = [
      { id: "exercise", label: "Exercise", points: 5, category: "health" },
      { id: "meditation", label: "Meditation", points: 3, category: "wellness" },
      { id: "reading", label: "Reading", points: 4, category: "personal" },
      { id: "cooking", label: "Home cooking", points: 8, category: "health" },
      { id: "studying", label: "Studying", points: 6, category: "work" },
      { id: "walking", label: "Walking", points: 3, category: "health" },
    ];
    
    // Add selected activities as tasks
    personalGambit.preferredActivities.forEach(activityId => {
      const activity = activities.find(a => a.id === activityId);
      if (activity) {
        // Adjust points based on difficulty
        let points = activity.points;
        if (personalGambit.difficulty === "easy") points = Math.max(2, points - 1);
        if (personalGambit.difficulty === "hard") points = points + 2;
        
        // Add the task to the user's tasks
        const taskTitle = `${activity.label} session`;
        addTask(taskTitle, points, activity.category as any);
        
        toast({
          title: "Task Added",
          description: `Added ${taskTitle} (${points} points)`,
        });
      }
    });
  };
  
  const activities = [
    { id: "exercise", label: "Exercise", points: 5 },
    { id: "meditation", label: "Meditation", points: 3 },
    { id: "reading", label: "Reading", points: 4 },
    { id: "cooking", label: "Home cooking", points: 8 },
    { id: "studying", label: "Studying", points: 6 },
    { id: "walking", label: "Walking", points: 3 },
  ];
  
  const toggleActivity = (activityId: string) => {
    setPersonalGambit(prev => {
      const activities = [...prev.preferredActivities];
      const index = activities.indexOf(activityId);
      
      if (index > -1) {
        activities.splice(index, 1);
      } else {
        activities.push(activityId);
      }
      
      return {
        ...prev,
        preferredActivities: activities
      };
    });
  };
  
  return (
    <Card className="pixel-card w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Target className="h-5 w-5" />
          PERSONAL GAMBIT SYSTEM
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isComplete ? (
          <>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-primary font-mono">MISSION OBJECTIVE</h3>
                <div className="space-y-2">
                  <Label htmlFor="goal">What quest are you embarking on?</Label>
                  <Input 
                    id="goal" 
                    value={personalGambit.goal} 
                    onChange={(e) => updatePersonalGambit("goal", e.target.value)}
                    className="pixel-border bg-black/40 text-white"
                    placeholder="Fitness mastery, coding skills, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Challenge rating</Label>
                  <Select 
                    value={personalGambit.difficulty} 
                    onValueChange={(value) => updatePersonalGambit("difficulty", value)}
                  >
                    <SelectTrigger className="pixel-border bg-black/40 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-primary">
                      <SelectItem value="easy">Novice - Start gentle</SelectItem>
                      <SelectItem value="medium">Adept - Balanced challenge</SelectItem>
                      <SelectItem value="hard">Master - Push your limits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-primary font-mono">SELECT ABILITIES</h3>
                <p className="text-sm text-muted-foreground">Choose activities you enjoy:</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {activities.map(activity => (
                    <Button
                      key={activity.id}
                      type="button"
                      variant={personalGambit.preferredActivities.includes(activity.id) ? "default" : "outline"}
                      className={`justify-start ${personalGambit.preferredActivities.includes(activity.id) ? 'bg-primary text-black' : 'border-primary/50'}`}
                      onClick={() => toggleActivity(activity.id)}
                    >
                      {personalGambit.preferredActivities.includes(activity.id) && (
                        <Check className="mr-2 h-4 w-4" />
                      )}
                      {activity.label} ({activity.points}pts)
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-primary font-mono">SYSTEM CALIBRATION:</h3>
                <div className="space-y-2 text-sm">
                  <p className="border-b border-primary/30 pb-2">
                    Home cooking = 8 points
                  </p>
                  <div>
                    <p>Energy consumption costs:</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      <li>Before 7 PM = 8 points</li>
                      <li>After 7 PM = 15 points</li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-primary/30 pt-2 mt-2">
                    <p>Physical training tiers:</p>
                    <ul className="list-inside pl-2 space-y-1">
                      <li>10min active = 3 points</li>
                      <li>20min intensity = 5 points</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={handlePrev}
                disabled={step === 1}
                className="border-primary/50"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-primary text-black hover:bg-primary/80"
              >
                {step === 3 ? "Complete" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4">
              <div className="bg-primary/20 rounded-full p-3">
                <Check className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-center text-primary font-mono">SYSTEM CALIBRATED</h3>
            <p className="text-center text-sm">
              Your quest parameters have been set for:<br />
              <span className="font-bold">{personalGambit.goal || "Adventure awaits"}</span>
            </p>
            
            <div className="border-t border-primary/30 pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                Tasks have been added based on your preferences
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalGambit;

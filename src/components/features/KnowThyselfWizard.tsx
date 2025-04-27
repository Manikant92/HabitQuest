
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Check, Target } from "lucide-react";

interface PersonalEconomy {
  goal: string;
  difficulty: string;
  preferredActivities: string[];
}

const KnowThyselfWizard = () => {
  const [step, setStep] = useState(1);
  const [personalEconomy, setPersonalEconomy] = useState<PersonalEconomy>({
    goal: "",
    difficulty: "medium",
    preferredActivities: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsComplete(true);
    }
  };
  
  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const updatePersonalEconomy = (field: keyof PersonalEconomy, value: any) => {
    setPersonalEconomy(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const activities = [
    { id: "exercise", label: "Exercise", points: 3 },
    { id: "meditation", label: "Meditation", points: 2 },
    { id: "reading", label: "Reading", points: 2 },
    { id: "cooking", label: "Home cooking", points: 8 },
    { id: "studying", label: "Studying", points: 4 },
    { id: "walking", label: "Walking", points: 3 },
  ];
  
  const toggleActivity = (activityId: string) => {
    setPersonalEconomy(prev => {
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
        <CardTitle className="flex items-center gap-2 text-habit-pixelgreen">
          <Target className="h-5 w-5" />
          "KNOW THYSELF" WIZARD
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isComplete ? (
          <>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-habit-pixelgreen font-mono">CURRENT GOAL?</h3>
                <div className="space-y-2">
                  <Label htmlFor="goal">What are you working towards?</Label>
                  <Input 
                    id="goal" 
                    value={personalEconomy.goal} 
                    onChange={(e) => updatePersonalEconomy("goal", e.target.value)}
                    className="pixel-border bg-black/40 text-white"
                    placeholder="Weight loss, learning, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty level</Label>
                  <Select 
                    value={personalEconomy.difficulty} 
                    onValueChange={(value) => updatePersonalEconomy("difficulty", value)}
                  >
                    <SelectTrigger className="pixel-border bg-black/40 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-habit-pixelgreen">
                      <SelectItem value="easy">Easy - Start gentle</SelectItem>
                      <SelectItem value="medium">Medium - Balanced challenge</SelectItem>
                      <SelectItem value="hard">Hard - Push yourself</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-habit-pixelgreen font-mono">SELECT ACTIVITIES</h3>
                <p className="text-sm text-muted-foreground">Choose activities you enjoy:</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {activities.map(activity => (
                    <Button
                      key={activity.id}
                      type="button"
                      variant={personalEconomy.preferredActivities.includes(activity.id) ? "default" : "outline"}
                      className={`justify-start ${personalEconomy.preferredActivities.includes(activity.id) ? 'bg-habit-pixelgreen text-black' : 'border-habit-pixelgreen/50'}`}
                      onClick={() => toggleActivity(activity.id)}
                    >
                      {personalEconomy.preferredActivities.includes(activity.id) && (
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
                <h3 className="text-habit-pixelgreen font-mono">SYSTEM ADJUSTS:</h3>
                <div className="space-y-2 text-sm">
                  <p className="border-b border-habit-pixelgreen/30 pb-2">
                    Home cooking = 8 points
                  </p>
                  <div>
                    <p>Late snacks cost more:</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      <li>Before 7 PM = 8 points</li>
                      <li>After 7 PM = 15 points</li>
                    </ul>
                  </div>
                  
                  <div className="border-t border-habit-pixelgreen/30 pt-2 mt-2">
                    <p>Exercise starts gentle:</p>
                    <ul className="list-inside pl-2 space-y-1">
                      <li>10min walk = 3 points</li>
                      <li>20min workout = 5 points</li>
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
                className="border-habit-pixelgreen/50"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-habit-pixelgreen text-black hover:bg-habit-pixelgreen/80"
              >
                {step === 3 ? "Complete" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4">
              <div className="bg-habit-pixelgreen/20 rounded-full p-3">
                <Check className="h-8 w-8 text-habit-pixelgreen" />
              </div>
            </div>
            
            <h3 className="text-center text-habit-pixelgreen font-mono">PERSONAL ECONOMY SET</h3>
            <p className="text-center text-sm">
              Your point system has been calibrated to your goal:<br />
              <span className="font-bold">{personalEconomy.goal || "General improvement"}</span>
            </p>
            
            <div className="border-t border-habit-pixelgreen/30 pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                You can recalibrate your system anytime
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowThyselfWizard;

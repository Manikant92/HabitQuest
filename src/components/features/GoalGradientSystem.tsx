
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

const GoalGradientSystem = () => {
  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-habit-pixelgreen">
          <Target className="h-5 w-5" />
          "GOAL GRADIENT" SYSTEM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Points scale with progress:
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">DAILY STUDY GOAL (4 HOURS):</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p>Hour 1: 4 points</p>
              <p>Hour 2: 5 points</p>
              <p>Hour 3: 7 points</p>
              <p>Hour 4: 10 points + daily bonus</p>
            </div>
          </div>
          
          <div className="border-t border-habit-pixelgreen/30 pt-4 space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">WEEKLY TARGETS:</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p>First gym visit: 5 points</p>
              <p>Last gym visit: 10 points</p>
              <p>Completion bonus: +15 points</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalGradientSystem;


import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const ProgressiveLoadSystem = () => {
  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-habit-pixelgreen">
          <TrendingUp className="h-5 w-5" />
          "PROGRESSIVE LOAD" SYSTEM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Points adapt as you improve:
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">EXERCISE TRACKING:</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p><span className="font-mono text-habit-pixelgreen">WEEK 1:</span> 10 pushups = 3 points</p>
              <p><span className="font-mono text-habit-pixelgreen">WEEK 2:</span> 12 pushups = 3 points</p>
              <p><span className="font-mono text-habit-pixelgreen">WEEK 3:</span> 15 pushups = 3 points</p>
            </div>
          </div>
          
          <div className="border-t border-habit-pixelgreen/30 pt-4 space-y-1">
            <p className="text-habit-pixelgreen font-mono">SKIPPING DAYS?</p>
            <p className="text-sm">REQUIREMENTS SCALE BACK</p>
          </div>
          
          <div className="border-t border-habit-pixelgreen/30 pt-4 space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">Study sessions:</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p><span className="font-mono text-habit-pixelgreen">FIRST WEEK:</span> 20min = 4 points</p>
              <p><span className="font-mono text-habit-pixelgreen">AFTER MASTERY:</span> Need 25min for 4 points</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressiveLoadSystem;

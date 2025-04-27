
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const TimeContextEngine = () => {
  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-habit-pixelgreen">
          <Clock className="h-5 w-5" />
          "TIME CONTEXT" ENGINE
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Smart timing for activities:
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">STUDY EFFICIENCY:</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p>8-11 AM: 6 points/hour</p>
              <p>2-4 PM: 4 points/hour</p>
              <p>After 10 PM: 2 points/hour</p>
            </div>
          </div>
          
          <div className="border-t border-habit-pixelgreen/30 pt-4 space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">ENTERTAINMENT COSTS:</h3>
            <div className="space-y-1 pl-2 text-sm">
              <p>Netflix before 8 PM: 10 points</p>
              <p>Netflix after 8 PM: 15 points</p>
              <p>Gaming progression: +2 points/hour</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeContextEngine;

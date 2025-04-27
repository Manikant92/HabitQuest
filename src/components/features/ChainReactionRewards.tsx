
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";

const ChainReactionRewards = () => {
  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-habit-pixelgreen">
          <Link className="h-5 w-5" />
          "CHAIN REACTION" REWARDS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Link activities for bonus points:
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-habit-pixelgreen font-mono">MORNING VICTORY:</h3>
            <div className="border-t border-habit-pixelgreen/30 mt-1 pt-2">
              <div className="space-y-1 pl-2 text-sm">
                <p>Wake up 7 AM (3 points)</p>
                <p>+ Exercise (4 points)</p>
                <p>+ Healthy breakfast (3 points)</p>
                <p className="border-t border-dashed border-habit-pixelgreen/50 pt-1 mt-1">
                  = 13 points (instead of 10)
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-habit-pixelgreen/30 pt-4 text-center">
            <p className="bg-habit-pixelgreen/20 inline-block px-3 py-1 rounded-full text-habit-pixelgreen text-sm">
              Bonus +3 for chain completion
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChainReactionRewards;

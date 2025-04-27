
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface PointsBalanceProps {
  points: number;
  targetPoints?: number;
}

const PointsBalance = ({ points, targetPoints = 50 }: PointsBalanceProps) => {
  const [displayPoints, setDisplayPoints] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progress = targetPoints > 0 ? (points / targetPoints) * 100 : 0;

  useEffect(() => {
    const duration = 1000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setDisplayPoints(Math.floor(progress * points));
      setAnimatedProgress(progress * (points / targetPoints) * 100);

      if (frame === totalFrames) {
        clearInterval(counter);
        setDisplayPoints(points);
        setAnimatedProgress(progress);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [points, targetPoints]);

  return (
    <Card className="border-2 border-primary/20 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-habit-purple to-habit-darkpurple bg-clip-text text-transparent">
          Point Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-primary animate-fade-in">
            {displayPoints}
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            points available
          </div>
          
          <div className="w-full mt-6">
            <div className="flex justify-between text-xs mb-1">
              <span>Daily Progress</span>
              <span className="text-primary">{Math.min(100, Math.round(progress))}%</span>
            </div>
            <Progress 
              value={animatedProgress} 
              className="h-2 bg-secondary/30" 
            />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-muted-foreground">
                Target: {targetPoints}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsBalance;

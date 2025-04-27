
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePoints } from "@/contexts/points";
import { toast } from "@/hooks/use-toast";

interface ChainItem {
  id: string;
  title: string;
  points: number;
  completed: boolean;
}

interface Chain {
  id: string;
  name: string;
  bonusPoints: number;
  tasks: ChainItem[];
}

const ComboChain = () => {
  const { addTask } = usePoints();
  const [activeChain, setActiveChain] = useState(0);
  
  // Sample chains the user can activate
  const chains: Chain[] = [
    {
      id: "morning-ritual",
      name: "MORNING POWER RITUAL",
      bonusPoints: 3,
      tasks: [
        { id: "wake-up", title: "Wake up before 7 AM", points: 3, completed: false },
        { id: "workout", title: "Quick morning exercise", points: 4, completed: false },
        { id: "breakfast", title: "Nutritious breakfast", points: 3, completed: false }
      ]
    },
    {
      id: "focus-flow",
      name: "FOCUS FLOW",
      bonusPoints: 5,
      tasks: [
        { id: "plan-day", title: "Plan today's tasks", points: 2, completed: false },
        { id: "deep-work", title: "60 min deep work", points: 6, completed: false },
        { id: "reflection", title: "Reflection break", points: 2, completed: false }
      ]
    }
  ];
  
  const activateChain = (chainId: string) => {
    const chain = chains.find(c => c.id === chainId);
    if (!chain) return;
    
    // Add all tasks from the chain to the user's task list
    chain.tasks.forEach(task => {
      addTask(task.title, task.points, "combo");
    });
    
    toast({
      title: "Combo Chain Activated",
      description: `Complete all tasks in "${chain.name}" for ${chain.bonusPoints} bonus points!`,
    });
  };

  return (
    <Card className="pixel-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Link className="h-5 w-5" />
          COMBO CHAIN SYSTEM
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm opacity-80">
          Link actions for massive rewards:
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-primary font-mono">{chains[activeChain].name}</h3>
            <div className="border-t border-primary/30 mt-1 pt-2">
              <div className="space-y-3 pl-2 text-sm">
                {chains[activeChain].tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center gap-2">
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border border-primary flex items-center justify-center">
                      {task.completed ? <Check className="h-3 w-3 text-primary" /> : index + 1}
                    </div>
                    <p>{task.title} ({task.points} pts)</p>
                  </div>
                ))}
                <p className="border-t border-dashed border-primary/50 pt-2 mt-2 flex justify-between">
                  <span>Regular Total:</span>
                  <span>{chains[activeChain].tasks.reduce((sum, task) => sum + task.points, 0)} points</span>
                </p>
                <p className="font-bold flex justify-between">
                  <span>With Combo Bonus:</span>
                  <span className="text-primary">{chains[activeChain].tasks.reduce((sum, task) => sum + task.points, 0) + chains[activeChain].bonusPoints} points</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary/30 pt-4 flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveChain(activeChain === 0 ? chains.length - 1 : activeChain - 1)}
              className="border-primary/40 px-2"
            >
              ←
            </Button>
            <Button
              onClick={() => activateChain(chains[activeChain].id)}
              size="sm"
              className="bg-primary text-black hover:bg-primary/80"
            >
              Activate Chain
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveChain((activeChain + 1) % chains.length)}
              className="border-primary/40 px-2"
            >
              →
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComboChain;


import { useState } from 'react';
import { Task } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onComplete: (taskId: string) => void;
}

const TaskItem = ({ task, onComplete }: TaskItemProps) => {
  const { toast } = useToast();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleComplete = () => {
    if (task.completed) return;
    
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(task.id);
      setIsCompleting(false);
      
      toast({
        title: `Quest Completed! +${task.points} Points`,
        description: (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-habit-pixelgreen" />
            <span>{task.title}</span>
          </div>
        ),
      });
    }, 300);
  };

  const renderPoints = () => {
    return Array(task.points).fill(0).map((_, index) => (
      <span 
        key={index} 
        className={cn(
          "point-circle transition-all duration-300",
          task.completed ? "opacity-100" : isHovered ? "opacity-75" : "opacity-50",
          isCompleting && "animate-point-earned"
        )} 
      />
    ));
  };

  return (
    <div 
      className={cn(
        "group flex items-center space-x-2 rounded-lg border border-habit-pixelgreen/50 p-3 mb-2 transition-all hover:shadow-md",
        task.completed ? "bg-habit-pixelgreen/10" : "bg-black/40 hover:border-habit-pixelgreen hover:bg-black/50",
        isCompleting && "scale-[0.98]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button 
        size="sm" 
        variant={task.completed ? "default" : "outline"} 
        className={cn(
          "h-8 w-8 rounded-full p-0 shrink-0 transition-all duration-300",
          task.completed ? "bg-habit-pixelgreen text-black" : "text-muted-foreground border-habit-pixelgreen/50",
          isHovered && !task.completed && "bg-habit-pixelgreen/10"
        )}
        onClick={handleComplete}
        disabled={task.completed}
      >
        <Check className={cn("h-4 w-4", isHovered && !task.completed && "text-habit-pixelgreen")} />
        <span className="sr-only">Complete quest</span>
      </Button>

      <div className="flex-1 space-y-1">
        <div className="flex items-center">
          <p className={cn(
            "text-sm font-medium leading-none",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
        </div>
        <div className="flex items-center pt-1">
          <Star className="h-3 w-3 mr-1 text-habit-pixelgreen" />
          <div className="flex space-x-1">
            {renderPoints()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;

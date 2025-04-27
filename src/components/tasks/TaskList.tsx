
import TaskItem from "./TaskItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@/types/types";

interface TaskListProps {
  tasks: Task[];
  title: string;
  onCompleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, title, onCompleteTask }: TaskListProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No tasks available
          </div>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onComplete={onCompleteTask} 
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TaskList;

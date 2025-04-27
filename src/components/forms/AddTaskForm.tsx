
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Plus } from "lucide-react";

interface AddTaskFormProps {
  onAddTask: (
    title: string,
    points: number,
    category: "morning" | "work" | "health" | "personal" | "other"
  ) => void;
}

const AddTaskForm = ({ onAddTask }: AddTaskFormProps) => {
  const [title, setTitle] = useState("");
  const [points, setPoints] = useState(1);
  const [category, setCategory] = useState<"morning" | "work" | "health" | "personal" | "other">("personal");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTask(title.trim(), points, category);
    setTitle("");
    setPoints(1);
    setCategory("personal");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Task</SheetTitle>
          <SheetDescription>
            Create a new task to earn points when completed
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g., Morning meditation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning Routine</SelectItem>
                <SelectItem value="work">Work/Study</SelectItem>
                <SelectItem value="health">Health & Fitness</SelectItem>
                <SelectItem value="personal">Personal Growth</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="points">Point Value: {points}</Label>
              <div className="flex gap-1">
                {Array(points).fill(0).map((_, i) => (
                  <span key={i} className="point-circle" />
                ))}
              </div>
            </div>
            <Slider
              id="points"
              min={1}
              max={5}
              step={1}
              value={[points]}
              onValueChange={(value) => setPoints(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground pt-1">
              <span>Easy</span>
              <span>Hard</span>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddTaskForm;

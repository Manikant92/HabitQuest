
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
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Star } from "lucide-react";

interface AddRewardFormProps {
  onAddReward: (
    title: string,
    cost: number,
    description: string,
    category: "entertainment" | "food" | "self-care" | "shopping" | "other"
  ) => void;
}

const AddRewardForm = ({ onAddReward }: AddRewardFormProps) => {
  const [title, setTitle] = useState("");
  const [cost, setCost] = useState(5);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"entertainment" | "food" | "self-care" | "shopping" | "other">("entertainment");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddReward(title.trim(), cost, description, category);
    setTitle("");
    setCost(5);
    setDescription("");
    setCategory("entertainment");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Star className="h-4 w-4" />
          Create Reward
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create New Reward</SheetTitle>
          <SheetDescription>
            Add a new reward that you can redeem with your earned points
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Reward Title</Label>
            <Input
              id="title"
              placeholder="e.g., 1 hour of gaming"
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
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="food">Food & Drinks</SelectItem>
                <SelectItem value="self-care">Self-care</SelectItem>
                <SelectItem value="shopping">Shopping</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this reward..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="cost">Point Cost: {cost}</Label>
            </div>
            <Slider
              id="cost"
              min={1}
              max={30}
              step={1}
              value={[cost]}
              onValueChange={(value) => setCost(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Small reward</span>
              <span>Big reward</span>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Create Reward
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddRewardForm;

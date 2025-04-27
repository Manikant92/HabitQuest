
import { useState } from "react";
import { Reward } from "@/types/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RewardItemProps {
  reward: Reward;
  availablePoints: number;
  onRedeem: (rewardId: string) => void;
}

const RewardItem = ({ reward, availablePoints, onRedeem }: RewardItemProps) => {
  const { toast } = useToast();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const canAfford = availablePoints >= reward.cost;

  const handleRedeem = () => {
    if (!canAfford) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.cost - availablePoints} more points to unlock this reward.`,
        variant: "destructive",
      });
      return;
    }

    setIsRedeeming(true);
    setTimeout(() => {
      onRedeem(reward.id);
      setIsRedeeming(false);
      toast({
        title: "Reward Unlocked! 🎉",
        description: `You've spent ${reward.cost} points on ${reward.title}`,
      });
    }, 300);
  };

  return (
    <div
      className={cn(
        "reward-card hover:border-primary/30 transition-all duration-300",
        isRedeeming && "scale-[0.98]",
        !canAfford && "opacity-70",
        isHovered && canAfford && "border-primary/50 bg-accent/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-medium">{reward.title}</h3>
        <div className="flex items-center space-x-1 text-sm">
          <span>{reward.cost}</span>
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
      
      {reward.description && (
        <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
      )}
      
      <Button
        variant={canAfford ? "default" : "outline"}
        size="sm"
        className={cn(
          "w-full transition-all duration-300",
          canAfford && isHovered && "bg-primary/90 scale-105"
        )}
        onClick={handleRedeem}
        disabled={!canAfford || isRedeeming}
      >
        {canAfford ? "Unlock Reward" : `Need ${reward.cost - availablePoints} more points`}
      </Button>
    </div>
  );
};

export default RewardItem;

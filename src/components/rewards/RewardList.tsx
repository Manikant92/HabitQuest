
import { Reward } from "@/types/types";
import RewardItem from "./RewardItem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState, useEffect } from "react";

interface RewardListProps {
  rewards: Reward[];
  availablePoints: number;
  onRedeemReward: (rewardId: string) => void;
}

const RewardList = ({ rewards, availablePoints, onRedeemReward }: RewardListProps) => {
  const [defaultRewards, setDefaultRewards] = useState<Reward[]>([]);
  
  useEffect(() => {
    // Add default rewards if none are available
    if (rewards.length === 0) {
      setDefaultRewards([
        {
          id: "default-reward-1",
          title: "Extended Break",
          description: "Take an extra 15-minute break",
          cost: 20,
          category: "personal"
        },
        {
          id: "default-reward-2",
          title: "Snack Time",
          description: "Enjoy your favorite snack",
          cost: 15,
          category: "food"
        },
        {
          id: "default-reward-3",
          title: "Screen Time",
          description: "30 minutes of guilt-free screen time",
          cost: 25,
          category: "entertainment"
        },
        {
          id: "default-reward-4",
          title: "Hobby Time",
          description: "Spend 1 hour on your favorite hobby",
          cost: 30,
          category: "personal"
        },
        {
          id: "default-reward-5",
          title: "Movie Night",
          description: "Watch a movie of your choice",
          cost: 40,
          category: "entertainment"
        },
        {
          id: "default-reward-6",
          title: "Social Media Break",
          description: "20 minutes on social media without guilt",
          cost: 15,
          category: "social"
        }
      ]);
    } else {
      setDefaultRewards([]);
    }
  }, [rewards]);
  
  const displayRewards = rewards.length > 0 ? rewards : defaultRewards;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
          {displayRewards.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground col-span-full">
              No rewards available
            </div>
          ) : (
            displayRewards.map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <RewardItem
                  reward={reward}
                  availablePoints={availablePoints}
                  onRedeem={onRedeemReward}
                />
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardList;

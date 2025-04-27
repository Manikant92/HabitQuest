
import { usePoints } from "@/contexts/points";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatsPage = () => {
  const { stats, pointHistory } = usePoints();

  return (
    <PageContainer>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Your Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Points Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Points Earned:</span>
                  <span className="font-bold">{stats.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points Available:</span>
                  <span className="font-bold">{stats.pointsAvailable}</span>
                </div>
                <div className="flex justify-between">
                  <span>Points Spent:</span>
                  <span className="font-bold">{stats.pointsSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Streak:</span>
                  <span className="font-bold">{stats.streakDays} days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Tasks Completed:</span>
                  <span className="font-bold">{stats.tasksCompleted}</span>
                </div>
                {stats.topTask && (
                  <div className="flex justify-between">
                    <span>Top Task:</span>
                    <span className="font-bold">{stats.topTask}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default StatsPage;

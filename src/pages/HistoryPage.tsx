
import { usePoints } from "@/contexts/points";
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const HistoryPage = () => {
  const { pointHistory } = usePoints();

  // Sort history by date (most recent first)
  const sortedHistory = [...pointHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <PageContainer>
      <div className="grid gap-6">
        <h1 className="text-2xl font-bold">Points History</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {sortedHistory.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                No activity recorded yet. Complete tasks or redeem rewards to see your history.
              </p>
            ) : (
              <div className="space-y-4">
                {sortedHistory.map((record) => (
                  <div 
                    key={record.id} 
                    className="flex justify-between items-center border-b border-border pb-2"
                  >
                    <div>
                      <p className="font-medium">{record.source}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(record.date), "MMM d, yyyy • h:mm a")}
                      </p>
                    </div>
                    <div className={`font-bold ${record.type === "earned" ? "text-green-500" : "text-red-500"}`}>
                      {record.type === "earned" ? "+" : "-"}{record.amount} points
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default HistoryPage;

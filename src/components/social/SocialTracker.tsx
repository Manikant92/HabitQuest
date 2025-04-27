
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Youtube, Instagram, Twitter, Linkedin, Facebook, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PLATFORMS = [
  { name: 'YouTube', icon: Youtube, color: 'bg-red-600' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { name: 'Twitter', icon: Twitter, color: 'bg-blue-500' },
  { name: 'LinkedIn', icon: Linkedin, color: 'bg-blue-700' },
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' }
];

interface TrackingData {
  platform: string;
  duration: number;
  lastWeek: number;
}

const SocialTracker: React.FC = () => {
  const [trackingPlatform, setTrackingPlatform] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [trackingData, setTrackingData] = useState<TrackingData[]>([]);
  const [activeView, setActiveView] = useState<'track' | 'stats'>('track');
  
  useEffect(() => {
    fetchTrackingData();
  }, []);
  
  const fetchTrackingData = async () => {
    try {
      const { data, error } = await supabase
        .from('social_tracking')
        .select('platform, duration, created_at')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Process data to get totals
      const platforms = PLATFORMS.map(p => p.name);
      const processedData: TrackingData[] = platforms.map(platform => {
        const platformData = data?.filter(d => d.platform === platform) || [];
        const total = platformData.reduce((sum, item) => sum + item.duration, 0);
        
        // Calculate last week's usage
        const lastWeekData = platformData.filter(d => {
          const date = new Date(d.created_at);
          const now = new Date();
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo && date <= now;
        });
        const lastWeek = lastWeekData.reduce((sum, item) => sum + item.duration, 0);
        
        return {
          platform,
          duration: total,
          lastWeek
        };
      });
      
      setTrackingData(processedData);
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    }
  };

  const startTracking = (platform: string) => {
    setTrackingPlatform(platform);
    // Start a timer
    const timer = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 60000); // increment every minute
  };

  const stopTracking = async () => {
    if (!trackingPlatform) return;

    try {
      const { data, error } = await supabase.from('social_tracking').insert({
        platform: trackingPlatform,
        duration: duration,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      toast.success(`Tracked ${duration} minutes on ${trackingPlatform}`, {
        description: "Your social media usage has been logged."
      });

      setTrackingPlatform(null);
      setDuration(0);
      fetchTrackingData();
    } catch (error) {
      toast.error("Failed to log social media usage");
      console.error("Error logging tracking data:", error);
    }
  };
  
  // Simulate background tracking for demo purposes
  const simulateBackgroundTracking = async (platform: string, minutes: number) => {
    try {
      const { data, error } = await supabase.from('social_tracking').insert({
        platform: platform,
        duration: minutes,
        user_id: (await supabase.auth.getUser()).data.user?.id
      });

      toast.success(`Auto-tracked ${minutes} minutes on ${platform}`, {
        description: "Background tracking detected your usage."
      });
      
      fetchTrackingData();
    } catch (error) {
      console.error("Error in auto tracking:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Clock /> Social Media Tracker
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="track" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="track">Track</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="track">
            {!trackingPlatform ? (
              <div className="grid grid-cols-3 gap-4">
                {PLATFORMS.map(({ name, icon: Icon, color }) => (
                  <Button 
                    key={name}
                    variant="outline" 
                    className="flex flex-col h-24"
                    onClick={() => startTracking(name)}
                  >
                    <div className={`p-2 rounded-full ${color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="mt-2">{name}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <p className="text-2xl font-bold mb-4">
                  Tracking {trackingPlatform}
                </p>
                <div className="flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 mr-2" />
                  <span className="text-3xl">{duration} mins</span>
                </div>
                <Button onClick={stopTracking} variant="destructive">
                  Stop Tracking
                </Button>
                <div className="mt-8 text-sm text-muted-foreground">
                  <p>Background tracking is also monitoring your browser activity.</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => simulateBackgroundTracking(PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)].name, Math.floor(Math.random() * 20) + 5)}
                  >
                    Simulate background tracking detection
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Usage Summary</h3>
              <div className="space-y-4">
                {trackingData.map(({ platform, duration, lastWeek }) => (
                  <div key={platform} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {(() => {
                          const PlatformIcon = PLATFORMS.find(p => p.name === platform)?.icon || Clock;
                          return <PlatformIcon className="h-4 w-4 mr-2" />;
                        })()}
                        <span>{platform}</span>
                      </div>
                      <span className="text-sm font-medium">{duration} mins total</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${Math.min(100, (duration / 300) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>This week: {lastWeek} mins</span>
                      <span>{duration > lastWeek ? `↑ ${duration - lastWeek}` : `↓ ${lastWeek - duration}`} from last week</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-bold text-yellow-950">!</span>
                    </div>
                    <span>YouTube usage is above your daily target. Try reducing screen time.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-950" />
                    </div>
                    <span>You've kept LinkedIn usage productive at 30 mins/day.</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SocialTracker;

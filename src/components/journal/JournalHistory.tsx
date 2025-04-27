
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { Book, Smile, X, CalendarDays, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  created_at: string;
}

const JournalHistory = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJournalEntries = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (error) throw error;
          setEntries(data || []);
        }
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJournalEntries();
    
    // Subscribe to changes in journal entries
    const channel = supabase
      .channel('journal_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'journal_entries' 
      }, fetchJournalEntries)
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getMoodIcon = (mood: string) => {
    const moodIcons: { [key: string]: React.ReactNode } = {
      'Happy': <Smile className="text-green-500" />,
      'Excited': <Smile className="text-yellow-500" />,
      'Calm': <Smile className="text-blue-500" />,
      'Sad': <Smile className="text-gray-500" />,
      'Anxious': <AlertCircle className="text-orange-500" />,
      'Frustrated': <AlertCircle className="text-red-500" />,
      // Add more mood icons as needed
    };
    return moodIcons[mood] || <Book className="text-primary" />;
  };

  const getMoodColor = (mood: string): string => {
    const moodColors: { [key: string]: string } = {
      'Happy': 'bg-green-100 text-green-800',
      'Excited': 'bg-yellow-100 text-yellow-800',
      'Calm': 'bg-blue-100 text-blue-800',
      'Sad': 'bg-gray-100 text-gray-800',
      'Anxious': 'bg-orange-100 text-orange-800',
      'Frustrated': 'bg-red-100 text-red-800',
      // Add more mood colors as needed
    };
    return moodColors[mood] || 'bg-primary/10 text-primary';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="h-5 w-5" />
          Journal History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-4">Loading journal entries...</p>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Book className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                No journal entries yet
              </p>
              <p className="text-xs text-muted-foreground">
                Start writing your thoughts in the journal entry form
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:bg-accent/10 transition-colors cursor-pointer"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{entry.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        <span>{format(new Date(entry.created_at), 'PPP')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.mood && (
                        <Badge variant="outline" className={getMoodColor(entry.mood)}>
                          {entry.mood}
                        </Badge>
                      )}
                      {getMoodIcon(entry.mood)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <Dialog open={selectedEntry !== null} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                {selectedEntry?.title}
                <DialogClose className="rounded-full hover:bg-accent/10 p-2">
                  <X className="h-4 w-4" />
                </DialogClose>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {selectedEntry?.created_at && format(new Date(selectedEntry.created_at), 'PPP')}
                  </span>
                </div>
                {selectedEntry?.mood && (
                  <Badge variant="outline" className={getMoodColor(selectedEntry.mood)}>
                    <span className="flex items-center gap-1">
                      {getMoodIcon(selectedEntry.mood)}
                      {selectedEntry.mood}
                    </span>
                  </Badge>
                )}
              </div>
              
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selectedEntry?.content}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default JournalHistory;

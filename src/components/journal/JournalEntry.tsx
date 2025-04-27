
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const moods = [
  'Happy', 'Excited', 'Calm', 'Stressed', 
  'Tired', 'Motivated', 'Anxious', 'Peaceful'
];

const JournalEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to create a journal entry",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase.from('journal_entries').insert({
        user_id: user.id,
        title,
        content,
        mood
      });

      if (error) throw error;

      toast({
        title: "Journal Entry Saved",
        description: "Your thoughts have been recorded successfully!",
      });

      // Reset form
      setTitle('');
      setContent('');
      setMood('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save journal entry",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-background border rounded-lg"
    >
      <h2 className="text-xl font-semibold mb-4">Daily Reflection</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
          placeholder="Entry Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Textarea 
          placeholder="Write your thoughts here..." 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="min-h-[150px]"
        />
        <Select value={mood} onValueChange={setMood}>
          <SelectTrigger>
            <SelectValue placeholder="Select your mood" />
          </SelectTrigger>
          <SelectContent>
            {moods.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          Save Journal Entry
        </Button>
      </form>
    </motion.div>
  );
};

export default JournalEntry;


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/points";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

const QuizWidget = () => {
  const [active, setActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const { toast } = useToast();
  const { addTask } = usePoints();

  // Sample quiz questions - in a real implementation, these would come from an AI service
  const generateQuestion = () => {
    const questions = [
      {
        id: 1,
        text: "What habit is most effective for improving focus?",
        options: ["Social media breaks", "Regular meditation", "Multitasking", "Constant notifications"],
        correctAnswer: 1
      },
      {
        id: 2,
        text: "How many hours of sleep are typically recommended for adults?",
        options: ["4-5 hours", "6 hours", "7-9 hours", "10+ hours"],
        correctAnswer: 2
      },
      {
        id: 3,
        text: "Which activity is best for building mental resilience?",
        options: ["Avoiding challenges", "Setting impossible goals", "Gradual exposure to difficulties", "Constant comfort"],
        correctAnswer: 2
      },
      {
        id: 4,
        text: "What's an effective strategy for habit formation?",
        options: ["Sudden major changes", "Linking new habits to existing routines", "Focusing on results only", "Working on many habits at once"],
        correctAnswer: 1
      },
      {
        id: 5,
        text: "Which statement about willpower is most accurate?",
        options: ["It's unlimited", "It depletes throughout the day", "It's unchangeable", "It doesn't affect habits"],
        correctAnswer: 1
      }
    ];
    
    return questions[Math.floor(Math.random() * questions.length)];
  };

  const startQuiz = () => {
    setActive(true);
    setCurrentQuestion(generateQuestion());
    setSelectedOption(null);
    setIsCorrect(null);
    setTimeLeft(15);
    setScore(0);
    setQuestionCount(0);
    
    // Log quiz start to database
    const logQuizStart = async () => {
      try {
        const { data: userData } = await supabase.auth.getSession();
        if (userData?.session) {
          await supabase.from("game_sessions").insert({
            game_id: "quiz_game", // This would be a proper UUID in production
            user_id: userData.session.user.id,
            completed: false,
            score: 0
          });
        }
      } catch (error) {
        console.error("Error logging quiz start:", error);
      }
    };
    
    logQuizStart();
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    const correct = optionIndex === currentQuestion?.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(prev => prev + 5);
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (questionCount < 4) {
        setQuestionCount(prev => prev + 1);
        setCurrentQuestion(generateQuestion());
        setSelectedOption(null);
        setIsCorrect(null);
        setTimeLeft(15);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
    setActive(false);
    
    // Add points based on score
    if (score > 0) {
      addTask("Daily Knowledge Quiz", score, "personal");
      
      toast({
        title: "Quiz Completed!",
        description: `You earned ${score} points from the knowledge quiz.`,
      });
      
      try {
        const { data: userData } = await supabase.auth.getSession();
        if (userData?.session) {
          // Update game session
          await supabase.from("game_sessions").insert({
            game_id: "quiz_game",
            user_id: userData.session.user.id,
            completed: true,
            score: score
          });
          
          // Log points
          await supabase.from("points_history").insert({
            user_id: userData.session.user.id,
            amount: score,
            type: "earned",
            description: "Daily Knowledge Quiz"
          });
        }
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    }
  };

  // Display options if quiz is active and question is loaded
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Knowledge Boost
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {!active ? (
          <div className="text-center py-3 space-y-3">
            <p className="text-sm text-muted-foreground mb-3">
              Test your knowledge with a quick quiz and earn points!
            </p>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button onClick={startQuiz} className="w-full">
                Start Quiz
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{timeLeft}s</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Question {questionCount + 1}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span>{score}</span>
              </div>
            </div>
            
            <p className="font-medium text-center mb-3">{currentQuestion?.text}</p>
            
            <div className="grid gap-2">
              {currentQuestion?.options.map((option, idx) => (
                <motion.div key={idx} 
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button 
                    variant={selectedOption === idx ? "default" : "outline"}
                    className={`w-full justify-start ${
                      isCorrect !== null && idx === currentQuestion.correctAnswer
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : isCorrect === false && idx === selectedOption
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : ""
                    }`}
                    disabled={selectedOption !== null}
                    onClick={() => handleAnswer(idx)}
                  >
                    {option}
                  </Button>
                </motion.div>
              ))}
            </div>
            
            {isCorrect !== null && (
              <div className={`text-center p-2 rounded ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                {isCorrect ? "Correct!" : "Incorrect!"}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizWidget;

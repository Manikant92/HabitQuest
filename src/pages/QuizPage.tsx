
import React, { useState, useEffect } from 'react';
import PageContainer from "@/components/layout/PageContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { usePoints } from "@/contexts/points/PointsContext";
import { Brain, Check, Clock, Star, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface QuizQuestion {
  id: string;
  question: string;
  answer: number;
  options?: number[];
}

const generateMathQuestion = (): QuizQuestion => {
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  
  let a: number, b: number, answer: number, question: string;
  
  switch(operation) {
    case '+':
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 100) + 1;
      answer = a + b;
      question = `${a} + ${b} = ?`;
      break;
    case '-':
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      question = `${a} - ${b} = ?`;
      break;
    case '*':
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      question = `${a} × ${b} = ?`;
      break;
    default:
      a = Math.floor(Math.random() * 100) + 1;
      b = Math.floor(Math.random() * 100) + 1;
      answer = a + b;
      question = `${a} + ${b} = ?`;
  }
  
  // Generate options (including correct answer)
  const options = [answer];
  while (options.length < 4) {
    const randomOffset = Math.floor(Math.random() * 10) + 1;
    const randomOption = Math.random() > 0.5 ? answer + randomOffset : Math.max(0, answer - randomOffset);
    if (!options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  
  // Shuffle options
  options.sort(() => Math.random() - 0.5);
  
  return { 
    id: `q-${Date.now()}`, 
    question, 
    answer,
    options
  };
};

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizActive, setQuizActive] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  
  const { toast } = useToast();
  const { addTask } = usePoints();

  const generateQuiz = () => {
    const newQuestions = Array(5).fill(null).map(() => generateMathQuestion());
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setQuizActive(true);
    setQuizCompleted(false);
    setUserAnswer("");
    setSelectedOption(null);
    setIsAnswerCorrect(null);
  };

  useEffect(() => {
    if (quizActive && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Time's up for this question
            clearInterval(timer);
            handleAnswer();
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [quizActive, currentQuestionIndex, quizCompleted]);

  const handleAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    setIsAnswerCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    // Pause to show the result
    setTimeout(() => {
      // Move to next question or end quiz
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerCorrect(null);
        setTimeLeft(30);
      } else {
        endQuiz();
      }
    }, 1500);
  };

  const endQuiz = async () => {
    setQuizCompleted(true);
    setQuizActive(false);
    
    // Calculate points based on score
    const earnedPoints = score * 5;
    
    if (earnedPoints > 0) {
      // Add completion task
      addTask("Math Quiz Completion", earnedPoints, "personal");
      
      toast({
        title: `Quiz Completed! +${earnedPoints} points`,
        description: `You answered ${score} out of ${questions.length} correctly.`,
      });
      
      try {
        // Get the current user's ID
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("User not authenticated");
        
        // Log this achievement to the database
        await supabase
          .from('points_history')
          .insert({
            amount: earnedPoints,
            description: `Math Quiz: ${score}/${questions.length} correct`,
            type: 'earned',
            user_id: userData.user.id
          });
      } catch (error) {
        console.error("Error saving quiz results:", error);
      }
    } else {
      toast({
        title: "Quiz Completed",
        description: "Keep practicing to earn points!",
        variant: "destructive",
      });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <PageContainer>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Math Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!quizActive && !quizCompleted ? (
            <div className="text-center py-8">
              <Brain className="h-16 w-16 mx-auto text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ready for a Math Challenge?</h2>
              <p className="mb-6 text-muted-foreground">
                Test your skills with 5 quick math questions. Answer correctly to earn points!
              </p>
              <Button onClick={generateQuiz} size="lg" className="animate-pulse">
                Start Challenge
              </Button>
            </div>
          ) : quizCompleted ? (
            <div className="text-center py-8 space-y-6">
              <h2 className="text-2xl font-bold">Quiz Completed!</h2>
              <div className="text-5xl font-bold text-primary">
                {score} / {questions.length}
              </div>
              <p className="text-lg">
                You earned <span className="text-primary font-bold">{score * 5}</span> points!
              </p>
              <Button onClick={generateQuiz} size="lg">
                Play Again
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm font-semibold">
                  Question {currentQuestionIndex + 1}/{questions.length}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className={timeLeft <= 5 ? "text-destructive animate-pulse" : ""}>
                    {timeLeft}s
                  </span>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{score * 5} pts</span>
                </div>
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold mb-6">{currentQuestion?.question}</h2>
                
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {currentQuestion?.options?.map((option) => (
                    <Button
                      key={option}
                      onClick={() => setSelectedOption(option)}
                      variant={selectedOption === option ? "default" : "outline"}
                      className={`text-xl h-16 ${
                        isAnswerCorrect !== null 
                          ? option === currentQuestion.answer 
                            ? "bg-green-500 hover:bg-green-600" 
                            : selectedOption === option 
                              ? "bg-red-500 hover:bg-red-600" 
                              : ""
                          : ""
                      }`}
                      disabled={isAnswerCorrect !== null}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
              
              {selectedOption !== null && isAnswerCorrect === null && (
                <div className="flex justify-center">
                  <Button onClick={handleAnswer}>Submit Answer</Button>
                </div>
              )}
              
              {isAnswerCorrect !== null && (
                <div className={`text-center p-4 rounded-lg ${isAnswerCorrect ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {isAnswerCorrect ? (
                    <div className="flex items-center justify-center gap-2">
                      <Check className="h-6 w-6 text-green-500" />
                      <span className="font-bold">Correct!</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <X className="h-6 w-6 text-red-500" />
                      <span className="font-bold">
                        Incorrect. The answer was {currentQuestion.answer}.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default QuizPage;

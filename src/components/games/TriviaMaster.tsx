
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, RotateCcw } from "lucide-react";

interface TriviaMasterProps {
  onScore: (points: number) => void;
  timeLeft: number;
}

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

const TriviaMaster: React.FC<TriviaMasterProps> = ({ onScore, timeLeft }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);

  const questions: Question[] = [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctIndex: 1,
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctIndex: 2,
      category: "Geography",
      difficulty: "easy"
    },
    {
      question: "Who wrote 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctIndex: 1,
      category: "Literature",
      difficulty: "easy"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctIndex: 3,
      category: "Geography",
      difficulty: "easy"
    },
    {
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctIndex: 2,
      category: "Science",
      difficulty: "medium"
    },
    {
      question: "Which famous scientist developed the theory of relativity?",
      options: ["Isaac Newton", "Niels Bohr", "Albert Einstein", "Galileo Galilei"],
      correctIndex: 2,
      category: "Science",
      difficulty: "medium"
    },
    {
      question: "What is the largest mammal on Earth?",
      options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
      correctIndex: 1,
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "In which year did the Titanic sink?",
      options: ["1910", "1912", "1915", "1918"],
      correctIndex: 1,
      category: "History",
      difficulty: "medium"
    },
    {
      question: "What gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
      correctIndex: 2,
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Thailand", "Korea", "Japan"],
      correctIndex: 3,
      category: "Geography",
      difficulty: "easy"
    },
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctIndex: 2,
      category: "Mathematics",
      difficulty: "easy"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctIndex: 2,
      category: "Art",
      difficulty: "easy"
    },
    {
      question: "What is the capital of Australia?",
      options: ["Sydney", "Melbourne", "Canberra", "Perth"],
      correctIndex: 2,
      category: "Geography",
      difficulty: "medium"
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Osmium", "Oxygen", "Oganesson", "Osmium"],
      correctIndex: 1,
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "In what year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctIndex: 2,
      category: "History",
      difficulty: "medium"
    },
    {
      question: "How many sides does a hexagon have?",
      options: ["5", "6", "7", "8"],
      correctIndex: 1,
      category: "Mathematics",
      difficulty: "easy"
    },
    {
      question: "Which organ is responsible for filtering blood in the human body?",
      options: ["Liver", "Kidneys", "Heart", "Lungs"],
      correctIndex: 1,
      category: "Biology",
      difficulty: "medium"
    },
    {
      question: "What is the hardest natural substance on Earth?",
      options: ["Gold", "Iron", "Diamond", "Platinum"],
      correctIndex: 2,
      category: "Science",
      difficulty: "easy"
    },
    {
      question: "Who was the first person to step on the moon?",
      options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"],
      correctIndex: 2,
      category: "History",
      difficulty: "easy"
    },
    {
      question: "What is the freezing point of water in Celsius?",
      options: ["-10°C", "-5°C", "0°C", "5°C"],
      correctIndex: 2,
      category: "Science",
      difficulty: "easy"
    }
  ];

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    // Filter out already answered questions if possible
    let availableQuestions = questions;
    if (answeredQuestions.length < questions.length) {
      availableQuestions = questions.filter(q => !answeredQuestions.includes(q.question));
    }
    
    // If all questions have been answered, reset the answered questions
    if (availableQuestions.length === 0) {
      setAnsweredQuestions([]);
      availableQuestions = questions;
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleSelectOption = (index: number) => {
    setSelectedOption(index);
    
    if (currentQuestion && index === currentQuestion.correctIndex) {
      setIsCorrect(true);
      
      // Calculate points based on difficulty and streak
      let pointsToAward = 10;
      if (currentQuestion.difficulty === 'medium') pointsToAward = 15;
      if (currentQuestion.difficulty === 'hard') pointsToAward = 20;
      
      // Add streak bonus (every 3 correct answers)
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak > 0 && newStreak % 3 === 0) {
        pointsToAward += 5;
      }
      
      onScore(pointsToAward);
      
      // Remember this question
      if (currentQuestion) {
        setAnsweredQuestions(prev => [...prev, currentQuestion.question]);
      }
      
      // Show correct answer briefly before moving on
      setTimeout(generateQuestion, 1000);
    } else {
      setIsCorrect(false);
      setStreak(0);
      onScore(-5);
    }
  };

  const skipQuestion = () => {
    // Small penalty for skipping
    onScore(-2);
    generateQuestion();
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      {currentQuestion && (
        <>
          {streak > 0 && (
            <div className={`text-center text-sm font-medium ${streak >= 3 ? 'text-green-500' : ''}`}>
              Streak: {streak} {streak >= 3 ? '🔥' : ''}
            </div>
          )}
          
          <div className="flex justify-between items-center mb-1 text-xs text-muted-foreground">
            <span className="bg-primary/20 rounded-full px-2 py-0.5">{currentQuestion.category}</span>
            <span className={`rounded-full px-2 py-0.5 ${
              currentQuestion.difficulty === 'easy' 
                ? 'bg-green-100 text-green-800' 
                : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}>
              {currentQuestion.difficulty}
            </span>
          </div>
          
          <div className="text-lg font-medium text-center mb-2 bg-primary/10 rounded-lg p-4">
            {currentQuestion.question}
          </div>
          
          <div className="space-y-3 w-full">
            {currentQuestion.options.map((option, index) => (
              <Button 
                key={index}
                variant="outline"
                className={`w-full justify-start text-left ${
                  selectedOption === index && isCorrect ? "bg-green-500 hover:bg-green-600 text-white" :
                  selectedOption === index && isCorrect === false ? "bg-red-500 hover:bg-red-600 text-white" : ""
                }`}
                onClick={() => handleSelectOption(index)}
                disabled={selectedOption !== null}
              >
                <span className="mr-2">{String.fromCharCode(65 + index)}.</span> {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <Brain className="inline h-4 w-4 mr-1" />
              Test your knowledge!
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={skipQuestion}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Skip (-2 pts)
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TriviaMaster;

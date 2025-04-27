
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface MathChallengeProps {
  onScore: (points: number) => void;
  timeLeft: number;
}

const MathChallenge: React.FC<MathChallengeProps> = ({ onScore, timeLeft }) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operation, setOperation] = useState<'+' | '-' | '×' | '÷'>('×');
  const [answer, setAnswer] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  const [options, setOptions] = useState<number[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<number>(1);
  
  useEffect(() => {
    generateNewProblem();
  }, [difficulty]);

  // Increase difficulty every 5 correct answers
  useEffect(() => {
    if (streak > 0 && streak % 5 === 0) {
      setDifficulty(prev => Math.min(3, prev + 1));
    }
  }, [streak]);

  const generateNewProblem = () => {
    const operations: ('+' | '-' | '×' | '÷')[] = ['+', '-', '×'];
    // Add division for higher difficulties
    if (difficulty > 1) {
      operations.push('÷');
    }
    
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    
    let a = 0, b = 0, result = 0;
    
    switch(randomOp) {
      case '+':
        // Adjust difficulty
        const maxAddend = difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100;
        a = Math.floor(Math.random() * maxAddend) + 1;
        b = Math.floor(Math.random() * maxAddend) + 1;
        result = a + b;
        break;
      case '-':
        const maxMinuend = difficulty === 1 ? 20 : difficulty === 2 ? 50 : 100;
        a = Math.floor(Math.random() * maxMinuend) + 10;
        b = Math.floor(Math.random() * a) + 1;
        result = a - b;
        break;
      case '×':
        const maxFactor = difficulty === 1 ? 10 : difficulty === 2 ? 12 : 15;
        a = Math.floor(Math.random() * maxFactor) + 1;
        b = Math.floor(Math.random() * maxFactor) + 1;
        result = a * b;
        break;
      case '÷':
        // Create division problems with whole number answers
        b = Math.floor(Math.random() * 10) + 1;
        result = Math.floor(Math.random() * 10) + 1;
        a = b * result;
        break;
    }
    
    setNum1(a);
    setNum2(b);
    setOperation(randomOp);
    setCorrectAnswer(result);
    setAnswer('');
    
    // Generate answer options
    const answerOptions = [result];
    const minOffset = 1;
    const maxOffset = difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20;
    
    while (answerOptions.length < 4) {
      const offset = Math.floor(Math.random() * maxOffset) + minOffset;
      const wrongAnswer = Math.random() > 0.5 ? result + offset : Math.max(0, result - offset);
      if (!answerOptions.includes(wrongAnswer)) {
        answerOptions.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    setOptions(answerOptions.sort(() => Math.random() - 0.5));
  };

  const handleSelectAnswer = (selectedAnswer: number) => {
    setAnswer(selectedAnswer.toString());
    if (selectedAnswer === correctAnswer) {
      // Award points based on difficulty
      const basePoints = 10;
      const difficultyBonus = (difficulty - 1) * 5;
      const streakBonus = Math.floor(streak / 3) * 2;
      
      const totalPoints = basePoints + difficultyBonus + streakBonus;
      onScore(totalPoints);
      setStreak(prev => prev + 1);
      
      // Small delay before next problem
      setTimeout(generateNewProblem, 500);
    } else {
      onScore(-5);
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {streak > 0 && (
        <div className={`text-sm font-medium ${streak >= 5 ? 'text-green-500' : ''}`}>
          Streak: {streak} {streak >= 5 ? '🔥' : ''}
        </div>
      )}
      
      <div className="flex items-center justify-center text-3xl font-bold mb-2 bg-primary/10 rounded-lg p-4 w-full">
        <span>{num1}</span>
        <span className="mx-2">{operation}</span>
        <span>{num2}</span>
        <span className="mx-2">=</span>
        <span className="text-primary">?</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((option, index) => (
          <Button 
            key={index}
            variant={answer === option.toString() ? "default" : "outline"}
            className={`h-14 text-xl font-bold ${answer === option.toString() && option === correctAnswer ? "bg-green-500 hover:bg-green-600" : ""}`}
            onClick={() => handleSelectAnswer(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground mt-3">
        <Calculator className="inline h-4 w-4 mr-1" />
        {difficulty === 1 ? "Easy" : difficulty === 2 ? "Medium" : "Hard"} difficulty
      </div>
    </div>
  );
};

export default MathChallenge;

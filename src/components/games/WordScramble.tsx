
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, RotateCcw } from "lucide-react";

interface WordScrambleProps {
  onScore: (points: number) => void;
  timeLeft: number;
}

const WordScramble: React.FC<WordScrambleProps> = ({ onScore, timeLeft }) => {
  const [word, setWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const words = [
    "apple", "banana", "orange", "grape", "kiwi", 
    "happy", "smile", "laugh", "world", "earth",
    "ocean", "beach", "cloud", "light", "house",
    "music", "piano", "dance", "party", "frame",
    "book", "story", "paper", "pencil", "table",
    "garden", "flower", "forest", "river", "mountain",
    "summer", "winter", "autumn", "spring", "weather",
    "planet", "galaxy", "rocket", "space", "stars",
    "coffee", "cookie", "pizza", "pasta", "salad",
    "camera", "memory", "friend", "family", "school"
  ];

  useEffect(() => {
    generateNewWord();
  }, []);

  const scrambleWord = (word: string): string => {
    const characters = word.split('');
    let scrambled = '';
    
    // Keep scrambling until we get a different arrangement
    while (scrambled === '' || scrambled === word) {
      const shuffled = [...characters].sort(() => Math.random() - 0.5);
      scrambled = shuffled.join('');
    }
    
    return scrambled;
  };

  const generateNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];
    
    setWord(selectedWord);
    setScrambledWord(scrambleWord(selectedWord));
    setUserInput("");
    setFeedback(null);
    setHintUsed(false);
    setShowHint(false);
  };

  const handleGuess = () => {
    if (userInput.toLowerCase() === word.toLowerCase()) {
      setFeedback("Correct!");
      // Award fewer points if hint was used
      onScore(hintUsed ? 10 : 20);
      setTimeout(() => {
        generateNewWord();
      }, 1000);
    } else {
      setFeedback("Try again!");
      onScore(-5);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const showWordHint = () => {
    setHintUsed(true);
    setShowHint(true);
    // Small penalty for using hint
    onScore(-2);
  };

  const getHint = (): string => {
    // Show first letter + blanks for remaining letters + last letter
    return word[0] + "_ ".repeat(word.length - 2) + word[word.length - 1];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleGuess();
    }
  };

  return (
    <div className="flex flex-col space-y-4 w-full">
      <div className="text-center text-2xl font-bold p-4 bg-primary/10 rounded-lg">
        {scrambledWord}
      </div>
      
      <div className="space-y-3">
        <Input
          type="text"
          placeholder="Unscramble the word..."
          value={userInput}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="text-center"
          autoComplete="off"
        />
        
        <div className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={handleGuess}
            variant="default"
          >
            <Play className="mr-2 h-4 w-4" />
            Submit Guess
          </Button>
          
          <Button
            variant="outline"
            onClick={generateNewWord}
            title="Skip this word"
            className="px-3"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        
        {showHint ? (
          <div className="text-center p-2 bg-primary/5 rounded text-sm">
            <p className="font-medium">Hint: {getHint()}</p>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full text-xs"
            onClick={showWordHint}
          >
            Need a hint? (-2 points)
          </Button>
        )}
        
        {feedback && (
          <div className={`text-center p-2 rounded ${
            feedback === "Correct!" ? "text-green-500" : "text-red-500"
          }`}>
            {feedback}
          </div>
        )}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        Unscramble the letters to form a word
      </div>
    </div>
  );
};

export default WordScramble;


import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Gamepad } from "lucide-react";

interface MemoryMatchProps {
  onScore: (points: number) => void;
  timeLeft: number;
}

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryMatch: React.FC<MemoryMatchProps> = ({ onScore, timeLeft }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [canFlip, setCanFlip] = useState(true);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const emojis = ['🐱', '🐶', '🦄', '🦊', '🐼', '🦁', '🐵', '🐸'];
    let cardValues = [...emojis, ...emojis];
    
    // Shuffle the cards
    cardValues = cardValues.sort(() => Math.random() - 0.5);
    
    const newCards = cardValues.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    
    setCards(newCards);
    setFlippedCards([]);
    setCanFlip(true);
  };

  const handleCardClick = (id: number) => {
    if (!canFlip || cards[id].flipped || cards[id].matched) return;
    
    // Flip the card
    const updatedCards = [...cards];
    updatedCards[id] = { ...updatedCards[id], flipped: true };
    setCards(updatedCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // If two cards are flipped, check for a match
    if (newFlippedCards.length === 2) {
      setCanFlip(false);
      
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].value === cards[secondId].value) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId] = { ...matchedCards[firstId], matched: true };
          matchedCards[secondId] = { ...matchedCards[secondId], matched: true };
          setCards(matchedCards);
          setFlippedCards([]);
          setCanFlip(true);
          
          onScore(10);
          
          // Check if all cards are matched
          if (matchedCards.every(card => card.matched)) {
            // Game complete
            onScore(30); // Bonus for completing
            setTimeout(initializeGame, 1500);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId] = { ...resetCards[firstId], flipped: false };
          resetCards[secondId] = { ...resetCards[secondId], flipped: false };
          setCards(resetCards);
          setFlippedCards([]);
          setCanFlip(true);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      <div className="grid grid-cols-4 gap-2 w-full">
        {cards.map(card => (
          <Button
            key={card.id}
            variant="outline"
            className={`h-14 text-xl font-bold ${card.matched ? 'opacity-50' : ''}`}
            onClick={() => handleCardClick(card.id)}
          >
            {card.flipped || card.matched ? card.value : '?'}
          </Button>
        ))}
      </div>
      
      <div className="text-center text-sm text-muted-foreground mt-3">
        <Gamepad className="inline h-4 w-4 mr-1" />
        Match pairs to earn points!
      </div>
    </div>
  );
};

export default MemoryMatch;

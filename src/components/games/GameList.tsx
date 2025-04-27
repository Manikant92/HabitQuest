
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad, Brain, Star, Calculator } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePoints } from "@/contexts/points/PointsContext";
import { toast } from "sonner";
import MathChallenge from './MathChallenge';
import TriviaMaster from './TriviaMaster';
import MemoryMatch from './MemoryMatch';
import WordScramble from './WordScramble';

interface Game {
  id: string;
  name: string;
  type: string;
  description: string;
  points: number;
}

interface GameSession {
  id: string;
  game_id: string;
  score: number;
  completed: boolean;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [gameInProgress, setGameInProgress] = useState<Game | null>(null);
  const [isGameDialogOpen, setIsGameDialogOpen] = useState(false);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(30); // seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const { stats, redeemReward, addTask } = usePoints();

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase.from('games').select('*');
      if (data) {
        // If no games found, create default ones
        if (data.length === 0) {
          const defaultGames = [
            {
              id: '1',
              name: 'Math Challenge',
              type: 'math',
              description: 'Test your math skills with quick calculations',
              points: 5
            },
            {
              id: '2',
              name: 'Trivia Master',
              type: 'trivia',
              description: 'Answer questions on various topics',
              points: 5
            },
            {
              id: '3',
              name: 'Memory Match',
              type: 'memory',
              description: 'Find matching pairs of cards',
              points: 10
            },
            {
              id: '4',
              name: 'Word Scramble',
              type: 'word',
              description: 'Unscramble letters to form words',
              points: 10
            }
          ];
          setGames(defaultGames);
        } else {
          setGames(data);
        }
      } else if (error) {
        console.error("Error fetching games:", error);
        // Fallback to default games
        setGames([
          {
            id: '1',
            name: 'Math Challenge',
            type: 'math',
            description: 'Test your math skills with quick calculations',
            points: 5
          },
          {
            id: '2',
            name: 'Trivia Master',
            type: 'trivia',
            description: 'Answer questions on various topics',
            points: 5
          },
          {
            id: '3',
            name: 'Memory Match',
            type: 'memory',
            description: 'Find matching pairs of cards',
            points: 10
          },
          {
            id: '4',
            name: 'Word Scramble',
            type: 'word',
            description: 'Unscramble letters to form words',
            points: 10
          }
        ]);
      }
    };
    
    fetchGames();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && gameTime > 0) {
      timer = setInterval(() => {
        setGameTime((prev) => prev - 1);
      }, 1000);
    } else if (gameTime === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, gameTime]);

  const handlePlayGame = async (game: Game) => {
    // Check if user has enough points
    if (stats.pointsAvailable < game.points) {
      toast.error("Not enough points", {
        description: `You need ${game.points - stats.pointsAvailable} more points to play`
      });
      return;
    }

    // Redeem points to play the game
    redeemReward(`game-${game.id}`);
    
    // Start game session
    try {
      const { data, error } = await supabase.from('game_sessions').insert({
        game_id: game.id,
        score: 0,
        completed: false,
        user_id: (await supabase.auth.getUser()).data.user?.id
      }).select();
      
      if (data && data.length > 0) {
        setGameSessionId(data[0].id);
      }
      
      setGameInProgress(game);
      setIsGameDialogOpen(true);
      setScore(0);
      setGameTime(30);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error starting game session:", error);
      toast.error("Failed to start game");
    }
  };

  const handleGameScore = (points: number) => {
    setScore(prev => Math.max(0, prev + points));
  };

  const endGame = async () => {
    setIsPlaying(false);
    
    try {
      // Update game session
      if (gameSessionId) {
        await supabase
          .from('game_sessions')
          .update({
            score: score,
            completed: true
          })
          .eq('id', gameSessionId);
      }
      
      // Award points for high score
      if (score > 50) {
        const earnedPoints = Math.floor(score / 10);
        addTask(`${gameInProgress?.name} High Score`, earnedPoints, "other");
        toast.success(`Earned ${earnedPoints} points for your high score!`, {
          description: `Score: ${score}`
        });
        
        // Log points to database
        await supabase.from('points_history').insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          amount: earnedPoints,
          description: `${gameInProgress?.name} High Score`,
          type: 'earned'
        });
      }
    } catch (error) {
      console.error("Error ending game session:", error);
    }
  };

  const renderGameContent = () => {
    if (!gameInProgress) return null;
    
    switch(gameInProgress.type) {
      case 'math':
        return <MathChallenge onScore={handleGameScore} timeLeft={gameTime} />;
      case 'trivia':
        return <TriviaMaster onScore={handleGameScore} timeLeft={gameTime} />;
      case 'memory':
        return <MemoryMatch onScore={handleGameScore} timeLeft={gameTime} />;
      case 'word':
        return <WordScramble onScore={handleGameScore} timeLeft={gameTime} />;
      default:
        return (
          <div className="text-center p-6">
            <Button 
              className="w-32 h-32 rounded-full text-xl font-bold"
              onClick={() => handleGameScore(Math.floor(Math.random() * 10) + 1)}
            >
              CLICK
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">Click to score points!</p>
          </div>
        );
    }
  };

  const getGameIcon = (gameType: string) => {
    switch(gameType) {
      case 'math':
        return <Calculator className="h-4 w-4 mr-1 text-blue-500" />;
      case 'trivia':
        return <Brain className="h-4 w-4 mr-1 text-purple-500" />;
      case 'memory':
        return <Gamepad className="h-4 w-4 mr-1 text-green-500" />;
      case 'word':
        return <Brain className="h-4 w-4 mr-1 text-orange-500" />;
      default:
        return <Gamepad className="h-4 w-4 mr-1 text-primary" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad /> Game Center
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="border rounded-lg p-4 hover:bg-accent/10 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold flex items-center gap-1">
                {getGameIcon(game.type)}
                {game.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                {game.points} pts
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{game.description}</p>
            <Button 
              onClick={() => handlePlayGame(game)} 
              className="w-full"
              variant="outline"
              disabled={stats.pointsAvailable < game.points}
            >
              {stats.pointsAvailable >= game.points ? 'Play Now' : `Need ${game.points - stats.pointsAvailable} more points`}
            </Button>
          </div>
        ))}
      </CardContent>
      
      <Dialog open={isGameDialogOpen} onOpenChange={setIsGameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{gameInProgress?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {isPlaying ? (
              <div className="text-center space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 mr-1 text-yellow-400" />
                    <span className="text-xl font-bold">{score}</span>
                  </div>
                  <div className={`text-xl font-mono ${gameTime <= 10 ? "text-red-500 animate-pulse" : ""}`}>
                    {gameTime}s
                  </div>
                </div>
                
                <div className="bg-black/10 backdrop-blur-sm rounded-lg p-4 min-h-64 overflow-auto">
                  {renderGameContent()}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-6">
                <h2 className="text-2xl font-bold">Game Over!</h2>
                <div className="text-5xl font-bold">Score: {score}</div>
                
                <div className="space-y-2">
                  {score > 50 && (
                    <div className="bg-green-500/20 text-green-500 py-2 px-4 rounded-md font-semibold">
                      High Score Bonus: +{Math.floor(score / 10)} points
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    {score > 70 
                      ? "Impressive! You're a natural!" 
                      : score > 40 
                        ? "Good job! Keep practicing!" 
                        : "Keep trying, you'll get better!"}
                  </p>
                </div>
                
                <div className="space-x-4">
                  <Button 
                    variant="outline"
                    onClick={() => setIsGameDialogOpen(false)}
                  >
                    Close
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      if (stats.pointsAvailable >= (gameInProgress?.points || 0)) {
                        setScore(0);
                        setGameTime(30);
                        setIsPlaying(true);
                        redeemReward(`game-${gameInProgress?.id}`);
                      } else {
                        toast.error("Not enough points to play again");
                      }
                    }}
                  >
                    Play Again
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GameList;

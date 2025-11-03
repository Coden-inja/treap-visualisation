import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, Trophy, Clock, Target, Star } from 'lucide-react';
import { toast } from 'sonner';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetTime: number; // in seconds
  targetMoves: number;
  goal: string;
  hints: string[];
  checkCompletion: () => boolean;
}

interface PlayModeProps {
  challenges: Challenge[];
  onChallengeStart?: (challenge: Challenge) => void;
  onChallengeComplete?: (challenge: Challenge, time: number, moves: number) => void;
}

export const PlayMode = ({ challenges, onChallengeStart, onChallengeComplete }: PlayModeProps) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsActive(true);
    setTimer(0);
    setMoves(0);
    setShowHint(false);
    onChallengeStart?.(challenge);
    toast.success(`Challenge started: ${challenge.title}`);
  };

  const checkProgress = () => {
    if (!selectedChallenge) return;

    if (selectedChallenge.checkCompletion()) {
      setIsActive(false);
      
      // Calculate score
      const timeBonus = Math.max(0, selectedChallenge.targetTime - timer) * 10;
      const movesBonus = Math.max(0, selectedChallenge.targetMoves - moves) * 5;
      const difficultyMultiplier = 
        selectedChallenge.difficulty === 'easy' ? 1 :
        selectedChallenge.difficulty === 'medium' ? 1.5 : 2;
      const finalScore = Math.round((100 + timeBonus + movesBonus) * difficultyMultiplier);
      
      setScore(finalScore);
      setCompletedChallenges(prev => new Set(prev).add(selectedChallenge.id));
      onChallengeComplete?.(selectedChallenge, timer, moves);
      
      toast.success('Challenge completed!', {
        description: `Score: ${finalScore} points`,
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-primary/20 text-primary';
      case 'medium': return 'bg-secondary/20 text-secondary';
      case 'hard': return 'bg-accent/20 text-accent';
      default: return 'bg-muted';
    }
  };

  if (!selectedChallenge) {
    return (
      <Card className="glass border-primary/20 h-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Play Mode</CardTitle>
          </div>
          <CardDescription>Choose a challenge and test your skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {challenges.map((challenge) => (
            <Card
              key={challenge.id}
              className="border-primary/20 hover:glow-primary transition-all cursor-pointer"
              onClick={() => startChallenge(challenge)}
            >
              <CardHeader className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{challenge.title}</CardTitle>
                      {completedChallenges.has(challenge.id) && (
                        <Trophy className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    <CardDescription className="text-xs">
                      {challenge.description}
                    </CardDescription>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                <div className="flex gap-3 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {challenge.targetTime}s
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {challenge.targetMoves} moves
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass border-primary/20 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{selectedChallenge.title}</CardTitle>
            <CardDescription>{selectedChallenge.description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
            {selectedChallenge.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-primary/20 p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
            <div className="text-xl font-bold">{formatTime(timer)}</div>
            <Progress 
              value={Math.min((timer / selectedChallenge.targetTime) * 100, 100)} 
              className="h-1 mt-1"
            />
          </Card>

          <Card className="border-primary/20 p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-secondary" />
              <div className="text-xs text-muted-foreground">Moves</div>
            </div>
            <div className="text-xl font-bold">{moves}</div>
            <Progress 
              value={Math.min((moves / selectedChallenge.targetMoves) * 100, 100)} 
              className="h-1 mt-1"
            />
          </Card>

          <Card className="border-primary/20 p-3">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              <div className="text-xs text-muted-foreground">Score</div>
            </div>
            <div className="text-xl font-bold">{score}</div>
            <div className="h-1 mt-1" />
          </Card>
        </div>

        {/* Goal */}
        <Card className="border-accent/20 bg-accent/5 p-4">
          <div className="flex items-start gap-2">
            <Target className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-accent">Goal</div>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedChallenge.goal}
              </div>
            </div>
          </div>
        </Card>

        {/* Hints */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHint(!showHint)}
            className="w-full border-primary/20"
          >
            {showHint ? 'Hide' : 'Show'} Hints
          </Button>
          {showHint && (
            <Card className="border-primary/20 bg-primary/5 p-3">
              <ul className="space-y-1 text-xs text-muted-foreground">
                {selectedChallenge.hints.map((hint, idx) => (
                  <li key={idx}>• {hint}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 mt-auto pt-4 border-t border-primary/20">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedChallenge(null);
              setIsActive(false);
              setScore(0);
            }}
            className="flex-1 border-primary/20"
          >
            Back to Challenges
          </Button>
          <Button
            onClick={() => {
              setMoves(prev => prev + 1);
              checkProgress();
            }}
            disabled={!isActive}
            className="flex-1 bg-primary text-primary-foreground"
          >
            Check Progress
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Play, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  pseudocode: string[];
  highlightNodes?: number[];
  actionLabel?: string;
  action?: () => void;
}

interface LearnModeProps {
  title: string;
  steps: LearningStep[];
  onStepChange?: (stepIndex: number) => void;
  onHighlight?: (nodes: number[]) => void;
}

export const LearnMode = ({ title, steps, onStepChange, onHighlight }: LearnModeProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
      if (steps[nextStep].highlightNodes) {
        onHighlight?.(steps[nextStep].highlightNodes || []);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
      if (steps[prevStep].highlightNodes) {
        onHighlight?.(steps[prevStep].highlightNodes || []);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    onStepChange?.(0);
    onHighlight?.([]);
  };

  const handleAutoPlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && currentStep < steps.length - 1) {
      const interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          const next = prev + 1;
          onStepChange?.(next);
          if (steps[next].highlightNodes) {
            onHighlight?.(steps[next].highlightNodes || []);
          }
          return next;
        });
      }, 3000);
    }
  };

  return (
    <Card className="glass border-primary/20 h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
        <CardDescription>Follow along with the step-by-step tutorial</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {Math.round(progress)}% Complete
          </p>
        </div>

        {/* Step Content */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-primary">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>

          {/* Pseudocode */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-1 font-mono text-xs">
            <div className="text-accent font-semibold mb-2">Pseudocode:</div>
            {step.pseudocode.map((line, idx) => (
              <div key={idx} className="text-foreground/80">
                {line}
              </div>
            ))}
          </div>

          {/* Action Button */}
          {step.actionLabel && step.action && (
            <Button
              onClick={step.action}
              className="w-full bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
              variant="outline"
            >
              {step.actionLabel}
            </Button>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-2 pt-4 border-t border-primary/20">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="border-primary/20"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoPlay}
            className="border-primary/20"
          >
            <Play className={`h-4 w-4 ${isPlaying ? 'text-accent' : ''}`} />
          </Button>
          <div className="flex-1 flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex-1 border-primary/20"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="flex-1 border-primary/20"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
